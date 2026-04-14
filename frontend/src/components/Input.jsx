import React from 'react';

const Input = React.forwardRef(({ label, error, className = '', containerStyle = {}, ...props }, ref) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', ...containerStyle }}>
      {label && (
        <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--color-text)' }}>
          {label}
        </label>
      )}
      <input
        ref={ref}
        style={{
          width: '100%',
          padding: '0.625rem 0.875rem',
          borderRadius: 'var(--radius-md)',
          border: `1px solid ${error ? 'var(--color-danger)' : 'var(--color-border)'}`,
          backgroundColor: '#fff',
          fontSize: '1rem',
          color: 'var(--color-text)',
          transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
          outline: 'none',
        }}
        onFocus={(e) => {
          e.target.style.borderColor = 'var(--color-primary)';
          e.target.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = error ? 'var(--color-danger)' : 'var(--color-border)';
          e.target.style.boxShadow = 'none';
        }}
        className={className}
        {...props}
      />
      {error && (
        <p style={{ fontSize: '0.875rem', color: 'var(--color-danger)', marginTop: '0.25rem' }}>
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
