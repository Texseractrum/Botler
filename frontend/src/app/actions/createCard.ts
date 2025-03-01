'use server';

// Import the Card type from the store for type checking
import { Card as StoreCard } from '../store/cards';
// Import the cards array from the API route
import { cards } from '@/app/api/cards/route';

console.log('Environment variables in createCard action:', {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NODE_ENV: process.env.NODE_ENV,
});

export interface CardData {
  title: string;
  roomNumber?: string;
  columnType: 'maintenance' | 'event' | 'other';
}

export async function createCard(data: CardData) {
  try {
    console.log('createCard action - Creating card:', data);
    
    // Generate a unique ID and add timestamp
    const newCard: StoreCard = {
      id: crypto.randomUUID(),
      title: data.title,
      roomNumber: data.roomNumber,
      type: data.columnType,
      created_at: Date.now()
    };

    // Add the card directly to the in-memory storage
    cards.push(newCard);
    console.log('createCard action - Card created:', newCard);
    
    return { success: true, data: newCard };
  } catch (error) {
    console.error('Error creating card:', error);
    return { success: false, error: `Failed to create card: ${error instanceof Error ? error.message : String(error)}` };
  }
} 