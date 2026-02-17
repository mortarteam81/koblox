import React, { useState } from 'react';
import { useGameStore } from '../../stores/useGameStore';

interface NicknameModalProps {
  onConfirm: () => void;
}

const NicknameModal: React.FC<NicknameModalProps> = ({ onConfirm }) => {
  const { nickname, setNickname } = useGameStore();
  const [input, setInput] = useState(nickname);
  const [error, setError] = useState('');

  const validate = (value: string): string => {
    if (value.length < 2) return '닉네임은 2자 이상이어야 합니다';
    if (value.length > 12) return '닉네임은 12자 이하여야 합니다';
    if (!/^[가-힣a-zA-Z0-9]+$/.test(value)) return '한글, 영문, 숫자만 사용 가능합니다';
    return '';
  };

  const handleConfirm = () => {
    const err = validate(input);
    if (err) {
      setError(err);
      return;
    }
    setNickname(input);
    onConfirm();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 200,
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 16,
          padding: 32,
          width: 320,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        }}
      >
        <h2 style={{ margin: 0, textAlign: 'center', fontSize: 22 }}>닉네임을 입력하세요</h2>
        <p style={{ margin: 0, color: '#888', textAlign: 'center', fontSize: 13 }}>
          2~12자, 한글·영문·숫자만 사용 가능합니다
        </p>
        <input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setError('');
          }}
          onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
          maxLength={12}
          placeholder="닉네임 입력"
          autoFocus
          style={{
            border: error ? '2px solid #ff4d4f' : '2px solid #d9d9d9',
            borderRadius: 8,
            padding: '10px 12px',
            fontSize: 16,
            outline: 'none',
          }}
        />
        {error && <p style={{ color: '#ff4d4f', margin: 0, fontSize: 13 }}>{error}</p>}
        <button
          onClick={handleConfirm}
          style={{
            background: '#1890ff',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '12px 0',
            fontSize: 16,
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          게임 시작!
        </button>
      </div>
    </div>
  );
};

export default NicknameModal;
