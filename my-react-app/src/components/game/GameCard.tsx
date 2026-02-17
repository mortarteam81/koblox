import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { GameId } from '../../types';

interface GameInfo {
  id: GameId;
  title: string;
  emoji: string;
  description: string;
  color: string;
}

interface GameCardProps {
  game: GameInfo;
  onPlay: () => void;
}

const GameCard: React.FC<GameCardProps> = ({ game, onPlay }) => {
  return (
    <div
      onClick={onPlay}
      style={{
        background: game.color,
        borderRadius: 16,
        padding: '24px 20px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
        boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
        transition: 'transform 0.15s, box-shadow 0.15s',
        userSelect: 'none',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.05)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.25)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
      }}
    >
      <span style={{ fontSize: 56 }}>{game.emoji}</span>
      <h3 style={{ margin: 0, fontSize: 20, color: '#fff', fontWeight: 'bold' }}>{game.title}</h3>
      <p style={{ margin: 0, fontSize: 14, color: 'rgba(255,255,255,0.85)', textAlign: 'center' }}>
        {game.description}
      </p>
      <button
        style={{
          marginTop: 8,
          background: '#fff',
          color: game.color,
          border: 'none',
          borderRadius: 8,
          padding: '8px 24px',
          fontSize: 15,
          fontWeight: 'bold',
          cursor: 'pointer',
        }}
        onClick={(e) => {
          e.stopPropagation();
          onPlay();
        }}
      >
        플레이
      </button>
    </div>
  );
};

export { GameCard };
export type { GameInfo };
