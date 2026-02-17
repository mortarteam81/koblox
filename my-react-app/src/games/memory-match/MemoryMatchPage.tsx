import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MemoryMatchGame from './MemoryMatchGame';
import GameResult from '../shared/GameResult';
import NicknameModal from '../../components/game/NicknameModal';
import { useGameStore } from '../../stores/useGameStore';

const MemoryMatchPage: React.FC = () => {
  const navigate = useNavigate();
  const { nickname, setScore } = useGameStore();
  const [showModal, setShowModal] = useState(!nickname);
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [gameKey, setGameKey] = useState(0);

  const handleComplete = (score: number) => {
    setScore('memory', score);
    setFinalScore(score);
  };

  const handleRestart = () => {
    setFinalScore(null);
    setGameKey((k) => k + 1);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #2d1b69 0%, #11998e 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '24px 16px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', width: '100%', maxWidth: 500, marginBottom: 16 }}>
        <button
          onClick={() => navigate('/')}
          style={{ background: 'none', border: 'none', color: '#fff', fontSize: 20, cursor: 'pointer' }}
        >
          ←
        </button>
        <h1 style={{ color: '#fff', margin: '0 auto', fontSize: 22, fontWeight: 'bold' }}>
          🃏 기억력 짝 맞추기
        </h1>
      </div>

      <div
        style={{
          background: '#fff',
          borderRadius: 16,
          padding: 24,
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          width: '100%',
          maxWidth: 500,
        }}
      >
        <MemoryMatchGame key={gameKey} onComplete={handleComplete} />
      </div>

      {finalScore !== null && (
        <GameResult game="memory" score={finalScore} onRestart={handleRestart} />
      )}

      {showModal && <NicknameModal onConfirm={() => setShowModal(false)} />}
    </div>
  );
};

export default MemoryMatchPage;
