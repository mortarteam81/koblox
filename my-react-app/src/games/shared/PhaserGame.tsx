import React, { useEffect, useRef } from 'react';

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

    import('phaser').then((Phaser) => {
      gameRef.current = new Phaser.Game(gameConfig);
      if (onGameReady && gameRef.current) {
        onGameReady(gameRef.current);
      }
    });

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
