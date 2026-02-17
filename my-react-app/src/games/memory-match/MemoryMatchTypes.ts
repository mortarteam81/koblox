export interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface MemoryGameState {
  cards: Card[];
  moves: number;
  matchedPairs: number;
  isComplete: boolean;
  firstCard: Card | null;
  secondCard: Card | null;
  isLocked: boolean;
}
