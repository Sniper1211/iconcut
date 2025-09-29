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
            Fast, simple, and free icon generator tool
          </p>
        </div>
        
        <div style={{ 
          borderTop: '1px solid #334155',
          paddingTop: '1rem',
          fontSize: '0.8rem'
        }}>
          <p>
            © 2024 IconCut. Pure frontend processing, protecting your privacy and security
          </p>
          <p style={{ marginTop: '0.5rem' }}>
            Supported formats: PNG, JPG | Processing completely done locally in browser
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;