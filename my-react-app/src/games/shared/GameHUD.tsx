import React from 'react';

interface GameHUDProps {
  score: number;
  timeLeft?: number;
  label?: string;
}

const GameHUD: React.FC<GameHUDProps> = ({ score, timeLeft, label = '점수' }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 16px',
        background: 'rgba(0,0,0,0.7)',
        color: '#fff',
        borderRadius: 8,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
      }}
    >
      <span>
        {label}: {score}
      </span>
      {timeLeft !== undefined && (
        <span style={{ color: timeLeft <= 10 ? '#ff4d4f' : '#fff' }}>
          ⏱ {timeLeft}초
        </span>
      )}
    </div>
  );
};

export default GameHUD;
