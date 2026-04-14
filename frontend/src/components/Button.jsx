import React from 'react';

const Button = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
    borderRadius: 'var(--radius-md)',
    transition: 'all var(--transition-fast)',
    cursor: 'pointer',
    border: 'none',
    outline: 'none',
    minWidth: '120px',
    minHeight: '44px',
    whiteSpace: 'nowrap',
  };

  const variants = {
    primary: {
      backgroundColor: 'var(--color-primary)',
      color: '#fff',
      boxShadow: 'var(--shadow-sm)',
    },
    primaryHover: {
      backgroundColor: 'var(--color-primary-hover)',
    },
    secondary: {
      backgroundColor: '#E0E7FF',
      color: 'var(--color-primary)',
    },
    danger: {
      backgroundColor: 'var(--color-danger)',
      color: '#fff',
    },
    outline: {
      backgroundColor: 'transparent',
      border: '1px solid var(--color-border)',
      color: 'var(--color-text)',
    }
  };

  const sizes = {
    sm: { padding: '0.5rem 1rem', fontSize: '0.875rem', minHeight: '36px', minWidth: '100px' },
    md: { padding: '0.625rem 1.25rem', fontSize: '1rem', minHeight: '44px', minWidth: '120px' },
    lg: { padding: '0.75rem 1.5rem', fontSize: '1.125rem', minHeight: '48px', minWidth: '140px' },
  };

  return (
    <button
      style={{ ...baseStyle, ...variants[variant], ...sizes[size] }}
      className={className}
      onMouseOver={(e) => {
        if (variant === 'primary') e.currentTarget.style.backgroundColor = variants.primaryHover.backgroundColor;
      }}
      onMouseOut={(e) => {
        if (variant === 'primary') e.currentTarget.style.backgroundColor = variants.primary.backgroundColor;
      }}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
