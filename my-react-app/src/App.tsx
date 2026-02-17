import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/Dashboard';
import GameHub from './pages/GameHub';
import Leaderboard from './pages/Leaderboard';

// 게임 페이지는 Phaser(~3MB)를 포함하므로 동적 import로 코드 스플리팅
// → 메인 번들에서 제외되어 초기 번들 크기 및 webpack 컴파일 메모리 대폭 감소
const StarCollectorPage = React.lazy(() => import('./games/star-collector/StarCollectorPage'));
const MemoryMatchPage = React.lazy(() => import('./games/memory-match/MemoryMatchPage'));
const JumpRunnerPage = React.lazy(() => import('./games/jump-runner/JumpRunnerPage'));

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>게임 로딩 중...</div>}>
        <Routes>
          <Route path="/" element={<GameHub />} />
          <Route path="/game/star" element={<StarCollectorPage />} />
          <Route path="/game/memory" element={<MemoryMatchPage />} />
          <Route path="/game/jump" element={<JumpRunnerPage />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
