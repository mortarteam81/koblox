import React from 'react';
import { Button as AntButton } from 'antd';
import './App.css';
import Dashboard from '@pages/Dashboard';

const App: React.FC = () => {
  return (
    <div className="App">
      <Dashboard />
    </div>
  );
};

export default App;
