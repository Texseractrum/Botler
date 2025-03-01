import { NextResponse } from 'next/server';

// Define the Card type
interface Card {
  id: string;
  title: string;
  roomNumber?: string; // Make this optional to match the store
  type: 'maintenance' | 'event' | 'other';
  created_at: number;  // Add timestamp
}

// In-memory storage for cards - export it so it can be imported elsewhere
export let cards: Card[] = [];

export async function POST(request: Request) {
  try {
    console.log('API - POST request received');
    
    // Log the raw request
    const clone = request.clone();
    const rawBody = await clone.text();
    console.log('API - Raw request body:', rawBody);
    
    let data;
    try {
      data = await request.json();
      console.log('API - Parsed request data:', data);
    } catch (parseError) {
      console.error('API - Error parsing request JSON:', parseError);
      return NextResponse.json({
        status: 'error',
        message: 'Invalid JSON in request body'
      }, { status: 400 });
    }
    
    // Validate required fields
    if (!data.title || (!data.type && !data.columnType)) {
      console.error('API - Missing required fields:', data);
      return NextResponse.json({
        status: 'error',
        message: 'Missing required fields: title and type are required'
      }, { status: 400 });
    }
    
    // Use type from columnType if needed
    const cardWithId: Card = {
      ...data,
      type: data.type || data.columnType, // Use columnType as fallback
      id: crypto.randomUUID(),
      created_at: Date.now()
    };

    // Add the card to our storage
    cards.push(cardWithId);
    console.log('API - Created new card:', cardWithId);
    console.log('API - Current cards in memory:', cards);

    return NextResponse.json({
      status: 'success',
      message: 'Card created successfully',
      data: cardWithId
    }, { status: 201 });

  } catch (error) {
    console.error('Error processing card creation:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Failed to create card',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

export async function GET() {
  // Add debugging for GET requests
  console.log('API - GET request received');
  console.log('API - Current cards in memory:', cards);
  
  // Sort cards by creation time
  const sortedCards = [...cards].sort((a, b) => b.created_at - a.created_at);
  
  console.log('API - Returning sorted cards:', sortedCards);
  
  return NextResponse.json({
    status: 'success',
    data: sortedCards
  });
} 