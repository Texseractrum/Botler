'use server';

import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export async function sendWhatsAppMessage(serviceName: string, roomNumber: string | undefined, minutes: number) {
  try {
    const message = await client.messages.create({
      body: `${serviceName} \n${roomNumber ? `Service for room ${roomNumber}` : ''} \nWe will be with you in ${minutes} minutes`,
      from: 'whatsapp:+14155238886',  // Replace with your Twilio WhatsApp number
      to: 'whatsapp:+447341366667'     // Replace with recipient's WhatsApp number
    });

    console.log('Message sent:', message.sid);
    return { success: true };
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    return { success: false, error };
  }
} 