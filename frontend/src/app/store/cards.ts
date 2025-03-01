'use client';

import { create } from 'zustand';

export interface Card {
  id: string;
  title: string;
  roomNumber?: string;
  type: 'maintenance' | 'event' | 'other';
  created_at: number;
}

interface CardStore {
  cards: Card[];
  addCard: (card: Card) => void;
  removeCard: (id: string) => void;
  setCards: (cards: Card[]) => void;
  getCardsByType: (type: Card['type']) => Card[];
}

export const useCardStore = create<CardStore>((set, get) => ({
  cards: [],
  addCard: (card) => {
    console.log('Adding card to store:', card);
    set((state) => {
      const newCards = [...state.cards, card];
      console.log('Updated cards in store:', newCards);
      return { cards: newCards };
    });
  },
  removeCard: (id) => {
    console.log('Removing card from store:', id);
    set((state) => ({
      cards: state.cards.filter(card => card.id !== id)
    }));
  },
  setCards: (cards) => {
    console.log('Setting all cards in store:', cards);
    set({ cards });
  },
  getCardsByType: (type) => {
    const filteredCards = get().cards.filter(card => card.type === type);
    console.log(`Getting cards of type ${type}:`, filteredCards);
    return filteredCards;
  },
})); 