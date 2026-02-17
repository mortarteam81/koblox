import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameCard } from '../components/game/GameCard';
import NicknameModal from '../components/game/NicknameModal';
import { useGameStore } from '../stores/useGameStore';
import type { GameInfo } from '../components/game/GameCard';
import type { GameId } from '../types';

const GAMES: GameInfo[] = [
  {
    id: 'star',
    title: '별 수집',
    emoji: '⭐',
    description: '캐릭터를 이동해 별을 모으고 장애물을 피하세요!',
    color: '#f5a623',
  },
  {
    id: 'memory',
    title: '기억력 짝 맞추기',
    emoji: '🃏',
    description: '카드를 뒤집어 같은 그림끼리 맞추세요!',
    color: '#7b61ff',
  },
  {
    id: 'jump',
    title: '점프 달리기',
    emoji: '🏃',
    description: '장애물을 점프해서 최대한 멀리 달리세요!',
    color: '#52c41a',
  },
];

const GAME_ROUTES: Record<GameId, string> = {
  star: '/game/star',
  memory: '/game/memory',
  jump: '/game/jump',
};

const GameHub: React.FC = () => {
  const navigate = useNavigate();
  const { nickname } = useGameStore();
  const [showModal, setShowModal] = useState(false);
  const [selectedGame, setSelectedGame] = useState<GameId | null>(null);

  const handlePlay = (gameId: GameId) => {
    setSelectedGame(gameId);
    if (!nickname) {
      setShowModal(true);
    } else {
      navigate(GAME_ROUTES[gameId]);
    }
  };

  const handleModalConfirm = () => {
    setShowModal(false);
    if (selectedGame) {
      navigate(GAME_ROUTES[selectedGame]);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '32px 16px',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h1 style={{ color: '#fff', fontSize: 36, margin: 0, fontWeight: 'bold' }}>
          🎮 미니게임 왕국
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', marginTop: 8, fontSize: 16 }}>
          {nickname ? `${nickname}님, 환영합니다!` : '게임을 선택해 시작하세요!'}
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 24,
          width: '100%',
          maxWidth: 800,
        }}
      >
        {GAMES.map((game) => (
          <GameCard key={game.id} game={game} onPlay={() => handlePlay(game.id)} />
        ))}
      </div>

      <div style={{ marginTop: 32 }}>
        <button
          onClick={() => navigate('/leaderboard')}
          style={{
            background: 'rgba(255,255,255,0.15)',
            color: '#fff',
            border: '2px solid rgba(255,255,255,0.3)',
            borderRadius: 8,
            padding: '10px 24px',
            fontSize: 15,
            cursor: 'pointer',
            marginRight: 12,
          }}
        >
          🏆 리더보드
        </button>
        <button
          onClick={() => setShowModal(true)}
          style={{
            background: 'rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.7)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 8,
            padding: '10px 24px',
            fontSize: 15,
            cursor: 'pointer',
          }}
        >
          ✏️ 닉네임 변경
        </button>
      </div>

      {showModal && <NicknameModal onConfirm={handleModalConfirm} />}
    </div>
  );
};

export default GameHub;
