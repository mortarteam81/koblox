import React, { useState, useCallback } from 'react';
import type { Card, MemoryGameState } from './MemoryMatchTypes';

const EMOJIS = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];

function createCards(): Card[] {
  const pairs = [...EMOJIS, ...EMOJIS];
  return pairs
    .sort(() => Math.random() - 0.5)
    .map((emoji, index) => ({
      id: index,
      emoji,
      isFlipped: false,
      isMatched: false,
    }));
}

const TOTAL_PAIRS = EMOJIS.length;

function computeScore(moves: number): number {
  const base = 1000;
  const penalty = Math.max(0, (moves - TOTAL_PAIRS) * 20);
  return Math.max(0, base - penalty);
}

interface MemoryMatchGameProps {
  onComplete: (score: number) => void;
}

const MemoryMatchGame: React.FC<MemoryMatchGameProps> = ({ onComplete }) => {
  const [state, setState] = useState<MemoryGameState>({
    cards: createCards(),
    moves: 0,
    matchedPairs: 0,
    isComplete: false,
    firstCard: null,
    secondCard: null,
    isLocked: false,
  });

  const handleCardClick = useCallback(
    (card: Card) => {
      if (state.isLocked || card.isFlipped || card.isMatched) return;

      setState((prev) => {
        if (!prev.firstCard) {
          const newCards = prev.cards.map((c) =>
            c.id === card.id ? { ...c, isFlipped: true } : c
          );
          return { ...prev, cards: newCards, firstCard: card };
        }

        if (prev.secondCard) return prev;

        const newCards = prev.cards.map((c) =>
          c.id === card.id ? { ...c, isFlipped: true } : c
        );
        const newMoves = prev.moves + 1;
        const isMatch = prev.firstCard.emoji === card.emoji;

        if (isMatch) {
          const matchedCards = newCards.map((c) =>
            c.emoji === card.emoji ? { ...c, isMatched: true } : c
          );
          const newMatchedPairs = prev.matchedPairs + 1;
          const isComplete = newMatchedPairs === TOTAL_PAIRS;

          if (isComplete) {
            setTimeout(() => onComplete(computeScore(newMoves)), 300);
          }

          return {
            ...prev,
            cards: matchedCards,
            moves: newMoves,
            matchedPairs: newMatchedPairs,
            isComplete,
            firstCard: null,
            secondCard: null,
            isLocked: false,
          };
        }

        return {
          ...prev,
          cards: newCards,
          moves: newMoves,
          secondCard: card,
          isLocked: true,
        };
      });

      if (state.firstCard && state.firstCard.emoji !== card.emoji) {
        setTimeout(() => {
          setState((prev) => {
            if (!prev.secondCard) return prev;
            return {
              ...prev,
              cards: prev.cards.map((c) =>
                c.id === prev.firstCard?.id || c.id === prev.secondCard?.id
                  ? { ...c, isFlipped: false }
                  : c
              ),
              firstCard: null,
              secondCard: null,
              isLocked: false,
            };
          });
        }, 900);
      }
    },
    [state.isLocked, state.firstCard, state.secondCard, onComplete]
  );

  const handleRestart = () => {
    setState({
      cards: createCards(),
      moves: 0,
      matchedPairs: 0,
      isComplete: false,
      firstCard: null,
      secondCard: null,
      isLocked: false,
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      <div style={{ display: 'flex', gap: 24, fontSize: 16, color: '#555' }}>
        <span>이동: <strong>{state.moves}</strong></span>
        <span>맞춘 쌍: <strong>{state.matchedPairs} / {TOTAL_PAIRS}</strong></span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 10,
          padding: 16,
        }}
      >
        {state.cards.map((card) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(card)}
            style={{
              width: 72,
              height: 72,
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 32,
              cursor: card.isMatched || card.isFlipped ? 'default' : 'pointer',
              background: card.isMatched
                ? '#f6ffed'
                : card.isFlipped
                ? '#e6f7ff'
                : '#1890ff',
              border: card.isMatched
                ? '2px solid #52c41a'
                : card.isFlipped
                ? '2px solid #1890ff'
                : '2px solid #096dd9',
              transition: 'all 0.2s',
              boxShadow: card.isMatched ? '0 0 8px rgba(82,196,26,0.4)' : undefined,
              transform: card.isFlipped || card.isMatched ? 'rotateY(0deg)' : 'rotateY(180deg)',
            }}
          >
            {card.isFlipped || card.isMatched ? card.emoji : ''}
          </div>
        ))}
      </div>

      <button
        onClick={handleRestart}
        style={{
          background: '#ff4d4f',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          padding: '8px 20px',
          fontSize: 14,
          cursor: 'pointer',
        }}
      >
        새 게임
      </button>
    </div>
  );
};

export default MemoryMatchGame;
