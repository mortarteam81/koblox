import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../../stores/useGameStore';
import { leaderboardService } from '../../services/leaderboardService';
import type { GameId } from '../../types';

interface GameResultProps {
  game: GameId;
  score: number;
  onRestart: () => void;
}

const GameResult: React.FC<GameResultProps> = ({ game, score, onRestart }) => {
  const navigate = useNavigate();
  const { nickname } = useGameStore();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!nickname || submitted) return;
    setSubmitting(true);
    setError(null);
    try {
      await leaderboardService.submitScore({ nickname, game, score });
      setSubmitted(true);
    } catch {
      setError('점수 등록에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.85)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        gap: 16,
        color: '#fff',
      }}
    >
      <div style={{ fontSize: 48 }}>🎮</div>
      <h2 style={{ fontSize: 28, margin: 0 }}>게임 종료!</h2>
      <p style={{ fontSize: 22, margin: 0 }}>
        최종 점수: <strong>{score}</strong>
      </p>

      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={!nickname || submitting}
          style={btnStyle('#52c41a')}
        >
          {submitting ? '등록 중...' : '점수 등록하기'}
        </button>
      ) : (
        <p style={{ color: '#52c41a', fontWeight: 'bold' }}>✓ 점수가 등록되었습니다!</p>
      )}

      {error && <p style={{ color: '#ff4d4f' }}>{error}</p>}

      <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
        <button onClick={onRestart} style={btnStyle('#1890ff')}>
          다시 하기
        </button>
        <button onClick={() => navigate('/')} style={btnStyle('#595959')}>
          게임 허브
        </button>
        <button onClick={() => navigate('/leaderboard')} style={btnStyle('#faad14')}>
          리더보드
        </button>
      </div>
    </div>
  );
};

function btnStyle(bg: string): React.CSSProperties {
  return {
    background: bg,
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '10px 20px',
    fontSize: 16,
    cursor: 'pointer',
    fontWeight: 'bold',
  };
}

export default GameResult;
