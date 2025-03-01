import { NextResponse } from 'next/server';
import { cards } from '../route';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    console.log(`API - DELETE request received for card id: ${id}`);
    
    // Find the index of the card with the given id
    const cardIndex = cards.findIndex(card => card.id === id);
    
    if (cardIndex === -1) {
      console.log(`API - Card with id ${id} not found`);
      return NextResponse.json({
        status: 'error',
        message: 'Card not found'
      }, { status: 404 });
    }
    
    // Remove the card from the array
    cards.splice(cardIndex, 1);
    console.log(`API - Card with id ${id} removed`);
    console.log('API - Current cards in memory:', cards);
    
    return NextResponse.json({
      status: 'success',
      message: 'Card deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting card:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Failed to delete card',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 