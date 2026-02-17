import React from 'react';
import { Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { LeaderboardEntry, GameId } from '../../types';

const GAME_LABELS: Record<GameId, { label: string; color: string }> = {
  star: { label: '⭐ 별 수집', color: 'gold' },
  memory: { label: '🃏 기억력', color: 'purple' },
  jump: { label: '🏃 점프', color: 'green' },
};

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  loading: boolean;
  showGame?: boolean;
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  entries,
  loading,
  showGame = true,
}) => {
  const columns: ColumnsType<LeaderboardEntry> = [
    {
      title: '순위',
      key: 'rank',
      width: 60,
      render: (_: unknown, __: unknown, index: number) => (
        <span style={{ fontWeight: 'bold', fontSize: 16 }}>
          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}`}
        </span>
      ),
    },
    {
      title: '닉네임',
      dataIndex: 'nickname',
      key: 'nickname',
      render: (name: string) => <span style={{ fontWeight: 'bold' }}>{name}</span>,
    },
    ...(showGame
      ? [
          {
            title: '게임',
            dataIndex: 'game',
            key: 'game',
            render: (game: GameId) => (
              <Tag color={GAME_LABELS[game]?.color}>{GAME_LABELS[game]?.label ?? game}</Tag>
            ),
          } as ColumnsType<LeaderboardEntry>[number],
        ]
      : []),
    {
      title: '점수',
      dataIndex: 'score',
      key: 'score',
      render: (score: number) => (
        <span style={{ fontWeight: 'bold', color: '#1890ff', fontSize: 16 }}>{score}</span>
      ),
    },
    {
      title: '날짜',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (ts: string) => new Date(ts).toLocaleDateString('ko-KR'),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={entries}
      rowKey="id"
      loading={loading}
      pagination={false}
      size="middle"
    />
  );
};

export default LeaderboardTable;
