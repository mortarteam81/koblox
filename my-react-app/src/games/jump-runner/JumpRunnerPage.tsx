import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PhaserGame from '../shared/PhaserGame';
import GameResult from '../shared/GameResult';
import NicknameModal from '../../components/game/NicknameModal';
import { useGameStore } from '../../stores/useGameStore';
import { JumpRunnerScene } from './JumpRunnerScene';

const GAME_WIDTH = 480;
const GAME_HEIGHT = 280;

const JumpRunnerPage: React.FC = () => {
  const navigate = useNavigate();
  const { nickname, setScore } = useGameStore();
  const [showModal, setShowModal] = useState(!nickname);
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [gameKey, setGameKey] = useState(0);

  const handleGameEnd = useCallback(
    (score: number) => {
      setScore('jump', score);
      setFinalScore(score);
    },
    [setScore]
  );

  const buildConfig = useCallback((): Phaser.Types.Core.GameConfig => {
    return {
      type: Phaser.AUTO,
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
      backgroundColor: '#87ceeb',
      scene: JumpRunnerScene,
      callbacks: {
        preBoot: (game: Phaser.Game) => {
          game.registry.set('onGameEnd', handleGameEnd);
        },
      },
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
        background: 'linear-gradient(135deg, #1a3a1a 0%, #2d5a2d 100%)',
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
          🏃 점프 달리기
        </h1>
      </div>

      <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 12 }}>
        스페이스바 / 클릭 / 탭으로 점프!
      </p>

      <div style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
        <PhaserGame key={gameKey} config={buildConfig()} />
      </div>

      {finalScore !== null && (
        <GameResult game="jump" score={finalScore} onRestart={handleRestart} />
      )}

      {showModal && <NicknameModal onConfirm={() => setShowModal(false)} />}
    </div>
  );
};

export default JumpRunnerPage;
