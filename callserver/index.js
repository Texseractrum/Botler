import Fastify from "fastify";
import WebSocket from "ws";
import dotenv from "dotenv";
import fastifyFormBody from "@fastify/formbody";
import fastifyWs from "@fastify/websocket";
import twilio from 'twilio';

// Load environment variables from .env file
dotenv.config();

const { ELEVENLABS_AGENT_ID, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env;

// Check for the required ElevenLabs Agent ID
if (!ELEVENLABS_AGENT_ID) {
console.error("Missing ELEVENLABS_AGENT_ID in environment variables");
process.exit(1);
}

// Initialize Fastify server
const fastify = Fastify();
fastify.register(fastifyFormBody);
fastify.register(fastifyWs);

// Initialize Twilio client
const twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

const PORT = process.env.PORT || 8000;

// Route to handle call redirection
fastify.post("/twilio/redirect-call", async (request, reply) => {
  try {
    // Find the active WebSocket connection
    const connections = fastify.websocketServer.clients;
    if (connections.size === 0) {
      throw new Error("No active calls found");
    }
    
    // Get the first (and presumably only) active connection
    const connection = Array.from(connections)[0];
    
    const call = await connection.redirectCall();
    return { status: "success", message: "Call redirected successfully" };
  } catch (error) {
    console.error('Error redirecting call:', error);
    reply.status(500).send({ 
      status: "error", 
      message: "Failed to redirect call",
      error: error.message 
    });
  }
});

// Root route for health check
fastify.get("/", async (_, reply) => {
  reply.send({ message: "Server is running" });
});

// Route to handle incoming calls from Twilio
fastify.all("/twilio/inbound_call", async (request, reply) => {
// Generate TwiML response to connect the call to a WebSocket stream
const twimlResponse = `<?xml version="1.0" encoding="UTF-8"?>
    <Response>
    <Connect>
        <Stream url="wss://${request.headers.host}/media-stream" />
    </Connect>
    </Response>`;

reply.type("text/xml").send(twimlResponse);
});

// WebSocket route for handling media streams from Twilio
fastify.register(async (fastifyInstance) => {
fastifyInstance.get("/media-stream", { websocket: true }, (connection, req) => {
    console.info("[Server] Twilio connected to media stream.");

    let streamSid = null;
    let callSid = null;  // Store callSid

    // Connect to ElevenLabs Conversational AI WebSocket
    const elevenLabsWs = new WebSocket(
    `wss://api.elevenlabs.io/v1/convai/conversation?agent_id=${ELEVENLABS_AGENT_ID}`
    );

    // Handle open event for ElevenLabs WebSocket
    elevenLabsWs.on("open", () => {
    console.log("[II] Connected to Conversational AI.");
    });

    // Handle messages from ElevenLabs
    elevenLabsWs.on("message", (data) => {
    try {
        const message = JSON.parse(data);
        handleElevenLabsMessage(message, connection);
    } catch (error) {
        console.error("[II] Error parsing message:", error);
    }
    });

    // Handle errors from ElevenLabs WebSocket
    elevenLabsWs.on("error", (error) => {
    console.error("[II] WebSocket error:", error);
    });

    // Handle close event for ElevenLabs WebSocket
    elevenLabsWs.on("close", () => {
    console.log("[II] Disconnected.");
    });

    // Function to handle messages from ElevenLabs
    const handleElevenLabsMessage = (message, connection) => {
    switch (message.type) {
        case "conversation_initiation_metadata":
        console.info("[II] Received conversation initiation metadata.");
        break;
        case "audio":
        if (message.audio_event?.audio_base_64) {
            // Send audio data to Twilio
            const audioData = {
            event: "media",
            streamSid,
            media: {
                payload: message.audio_event.audio_base_64,
            },
            };
            connection.send(JSON.stringify(audioData));
        }
        break;
        case "interruption":
        // Clear Twilio's audio queue
        connection.send(JSON.stringify({ event: "clear", streamSid }));
        break;
        case "ping":
        // Respond to ping events from ElevenLabs
        if (message.ping_event?.event_id) {
            const pongResponse = {
            type: "pong",
            event_id: message.ping_event.event_id,
            };
            elevenLabsWs.send(JSON.stringify(pongResponse));
        }
        break;
    }
    };

    // Handle messages from Twilio
    connection.on("message", async (message) => {
    try {
        const data = JSON.parse(message);
        switch (data.event) {
        case "start":
            streamSid = data.start.streamSid;
            callSid = data.start.callSid;  // Store the callSid when stream starts
            connection.streamSid = streamSid;  // Store streamSid on connection object
            console.log(`[Twilio] Stream started with ID: ${streamSid}, Call SID: ${callSid}`);
            break;
        case "media":
            // Route audio from Twilio to ElevenLabs
            if (elevenLabsWs.readyState === WebSocket.OPEN) {
            // data.media.payload is base64 encoded
            const audioMessage = {
                user_audio_chunk: Buffer.from(
                    data.media.payload,
                    "base64"
                ).toString("base64"),
            };
            elevenLabsWs.send(JSON.stringify(audioMessage));
            }
            break;
        case "stop":
            // Close ElevenLabs WebSocket when Twilio stream stops
            elevenLabsWs.close();
            break;
        case "mark":
            // If we receive a "transfer" mark, trigger the call redirect
            if (data.mark.name === "transfer") {
              try {
                await connection.redirectCall();
                console.log("Call transfer initiated successfully");
              } catch (error) {
                console.error("Failed to transfer call:", error);
              }
            }
            break;
        default:
            console.log(`[Twilio] Received unhandled event: ${data.event}`);
        }
    } catch (error) {
        console.error("[Twilio] Error processing message:", error);
    }
    });

    // Handle close event from Twilio
    connection.on("close", () => {
    elevenLabsWs.close();
    console.log("[Twilio] Client disconnected");
    });

    // Handle errors from Twilio WebSocket
    connection.on("error", (error) => {
    console.error("[Twilio] WebSocket error:", error);
    elevenLabsWs.close();
    });

    // Add method to handle redirection for this connection
    connection.redirectCall = async () => {
      if (!callSid) {
        throw new Error("No active call to redirect");
      }
      
      const call = await twilioClient.calls(callSid)
        .update({
          twiml: `<?xml version="1.0" encoding="UTF-8"?>
            <Response>
              <Dial>+447397530946</Dial>
            </Response>`
        });

      console.log(`Call redirected: ${call.sid}`);
      return call;
    };
});
});

// After all routes are registered, log them
fastify.ready(() => {
  console.log('Registered routes:');
  console.log(fastify.printRoutes());
});

// Start the Fastify server
fastify.listen({ port: PORT }, (err) => {
  if (err) {
    console.error("Error starting server:", err);
    process.exit(1);
  }
  console.log(`[Server] Listening on port ${PORT}`);
});
