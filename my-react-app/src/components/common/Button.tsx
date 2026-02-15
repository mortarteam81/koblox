import React from 'react';
import { Button as AntButton } from 'antd';
import type { ButtonProps as ButtonPropsType } from '@types';

interface ButtonProps extends ButtonPropsType {
  style?: React.CSSProperties;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  onClick,
  style,
  children,
}) => {
  const getType = (): 'primary' | 'default' | 'dashed' | 'text' | 'link' => {
    switch (variant) {
      case 'primary':
        return 'primary';
      case 'secondary':
        return 'default';
      case 'danger':
        return 'default';
      default:
        return 'default';
    }
  };

  const getDanger = (): boolean => variant === 'danger';

  const getSize = (): 'large' | 'middle' | 'small' => {
    switch (size) {
      case 'small':
        return 'small';
      case 'medium':
        return 'middle';
      case 'large':
        return 'large';
      default:
        return 'middle';
    }
  };

  return (
    <AntButton
      type={getType()}
      danger={getDanger()}
      size={getSize()}
      disabled={disabled}
      loading={loading}
      onClick={onClick}
      style={style}
    >
      {children}
    </AntButton>
  );
};

export default Button;
