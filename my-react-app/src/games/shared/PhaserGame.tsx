import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';

interface PhaserGameProps {
  config: Phaser.Types.Core.GameConfig;
  onGameReady?: (game: Phaser.Game) => void;
  style?: React.CSSProperties;
}

const PhaserGame: React.FC<PhaserGameProps> = ({ config, onGameReady, style }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;

    const gameConfig: Phaser.Types.Core.GameConfig = {
      ...config,
      parent: containerRef.current,
    };

    // 정적 import 사용 - 씬 파일과 동일한 Phaser 인스턴스를 공유하여
    // 'plugin.boot is not a function' 이중 인스턴스 충돌 방지
    gameRef.current = new Phaser.Game(gameConfig);
    if (onGameReady && gameRef.current) {
      onGameReady(gameRef.current);
    }

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', ...style }}
    />
  );
};

export default PhaserGame;
