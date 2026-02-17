import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PhaserGame from '../shared/PhaserGame';
import GameResult from '../shared/GameResult';
import NicknameModal from '../../components/game/NicknameModal';
import { useGameStore } from '../../stores/useGameStore';
import { StarCollectorScene } from './StarCollectorScene';

const GAME_WIDTH = 480;
const GAME_HEIGHT = 360;

const StarCollectorPage: React.FC = () => {
  const navigate = useNavigate();
  const { nickname, setScore } = useGameStore();
  const [showModal, setShowModal] = useState(!nickname);
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [gameKey, setGameKey] = useState(0);

  const handleGameEnd = useCallback(
    (score: number) => {
      setScore('star', score);
      setFinalScore(score);
    },
    [setScore]
  );

  const buildConfig = useCallback((): Phaser.Types.Core.GameConfig => {
    return {
      type: Phaser.AUTO,
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
      backgroundColor: '#0a0a2a',
      scene: [new StarCollectorScene(handleGameEnd)],
      physics: { default: 'arcade', arcade: { gravity: { x: 0, y: 0 }, debug: false } },
    };
  }, [handleGameEnd]);

  const handleRestart = () => {
    setFinalScore(null);
    setGameKey((k) => k + 1);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a2a 0%, #1a1a4a 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '24px 16px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', width: '100%', maxWidth: GAME_WIDTH, marginBottom: 12 }}>
        <button
          onClick={() => navigate('/')}
          style={{ background: 'none', border: 'none', color: '#fff', fontSize: 20, cursor: 'pointer' }}
        >
          ←
        </button>
        <h1 style={{ color: '#fff', margin: '0 auto', fontSize: 20, fontWeight: 'bold' }}>
          ⭐ 별 수집
        </h1>
      </div>

      <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 12 }}>
        방향키 / WASD로 이동 | 모바일: 드래그
      </p>

      <div style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
        <PhaserGame key={gameKey} config={buildConfig()} />
      </div>

      {finalScore !== null && (
        <GameResult game="star" score={finalScore} onRestart={handleRestart} />
      )}

      {showModal && <NicknameModal onConfirm={() => setShowModal(false)} />}
    </div>
  );
};

export default StarCollectorPage;
