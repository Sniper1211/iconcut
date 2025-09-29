import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer style={{
      backgroundColor: '#1e293b',
      color: '#94a3b8',
      padding: '2rem 0',
      marginTop: '4rem',
      textAlign: 'center' as const
    }}>
      <div className="container">
        <div style={{ marginBottom: '1rem' }}>
          <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>IconCut</h3>
          <p style={{ fontSize: '0.9rem' }}>
            快速、简单、免费的图标生成工具
          </p>
        </div>
        
        <div style={{ 
          borderTop: '1px solid #334155',
          paddingTop: '1rem',
          fontSize: '0.8rem'
        }}>
          <p>
            © 2024 IconCut. 纯前端处理，保护您的隐私安全
          </p>
          <p style={{ marginTop: '0.5rem' }}>
            支持的格式：PNG, JPG | 处理完全在浏览器本地完成
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;