'use server';

import twilio from 'twilio';

// Access environment variables safely
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

// Check if credentials exist
if (!accountSid || !authToken) {
  console.error('Missing Twilio credentials in environment variables');
}

const client = twilio(accountSid, authToken);

export async function sendWhatsAppMessage(serviceName: string, roomNumber: string | undefined, minutes: number) {
  try {
    // Log for debugging (remove in production)
    console.log('Sending WhatsApp with credentials:', { 
      accountSid: accountSid?.substring(0, 5) + '...',
      authTokenExists: !!authToken
    });
    
    const message = await client.messages.create({
      body: `${serviceName} \n${roomNumber ? `Service for room ${roomNumber}` : ''} \nWe will be with you in ${minutes} minutes`,
      from: 'whatsapp:+14155238886',  // Your Twilio WhatsApp number
      to: 'whatsapp:+447341366667'    // Recipient's WhatsApp number
    });

    console.log('Message sent:', message.sid);
    return { success: true };
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    return { success: false, error };
  }
} 