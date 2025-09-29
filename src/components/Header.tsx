import React from 'react';

const Header: React.FC = () => {
  return (
    <header style={{ 
      background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
      color: 'white',
      padding: '2rem 0',
      textAlign: 'center' as const
    }}>
      <div className="container">
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 'bold', 
          marginBottom: '0.5rem',
          textShadow: '0 2px 4px rgba(0,0,0,0.3)'
        }}>
          IconCut
        </h1>
        <p style={{ 
          fontSize: '1.2rem', 
          opacity: 0.9,
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          快速生成多尺寸图标 - 支持网站、iOS、Android 平台
        </p>
      </div>
    </header>
  );
};

export default Header;