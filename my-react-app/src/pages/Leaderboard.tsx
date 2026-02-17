import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs } from 'antd';
import LeaderboardTable from '../components/game/LeaderboardTable';
import { useLeaderboard } from '../hooks/useLeaderboard';
import type { GameId } from '../types';

const TABS: { key: GameId | 'all'; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'star', label: '⭐ 별 수집' },
  { key: 'memory', label: '🃏 기억력' },
  { key: 'jump', label: '🏃 점프' },
];

const LeaderboardContent: React.FC<{ game?: GameId }> = ({ game }) => {
  const { entries, loading, error } = useLeaderboard(game, 10);

  if (error) {
    return <p style={{ color: '#ff4d4f', textAlign: 'center' }}>{error}</p>;
  }

  return <LeaderboardTable entries={entries} loading={loading} showGame={!game} />;
};

const Leaderboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('all');

  const tabItems = TABS.map((tab) => ({
    key: tab.key,
    label: tab.label,
    children: (
      <LeaderboardContent game={tab.key === 'all' ? undefined : (tab.key as GameId)} />
    ),
  }));

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        padding: '32px 16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div style={{ width: '100%', maxWidth: 700 }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24, gap: 16 }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              fontSize: 20,
              cursor: 'pointer',
            }}
          >
            ←
          </button>
          <h1 style={{ color: '#fff', margin: 0, fontSize: 28, fontWeight: 'bold' }}>
            🏆 리더보드
          </h1>
        </div>

        <div
          style={{
            background: '#fff',
            borderRadius: 16,
            padding: 24,
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          }}
        >
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
          />
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
