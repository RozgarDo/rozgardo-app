import React from 'react';

const Card = ({ children, className = '', hoverEffect = false, ...props }) => {
  return (
    <div
      style={{
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.5rem',
        boxShadow: 'var(--shadow-md)',
        border: '1px solid var(--color-border)',
        transition: 'transform var(--transition-normal), box-shadow var(--transition-normal)',
      }}
      className={`${className}`}
      onMouseOver={(e) => {
        if (hoverEffect) {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
        }
      }}
      onMouseOut={(e) => {
        if (hoverEffect) {
          e.currentTarget.style.transform = 'none';
          e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        }
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
