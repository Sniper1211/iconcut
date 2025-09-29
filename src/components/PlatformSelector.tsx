import React from 'react';
import { PlatformPreset } from '../types';
import { PLATFORM_PRESETS } from '../constants/presets';

interface PlatformSelectorProps {
  selectedPlatform: PlatformPreset | null;
  onPlatformSelect: (platform: PlatformPreset) => void;
  disabled: boolean;
}

const PlatformSelector: React.FC<PlatformSelectorProps> = ({
  selectedPlatform,
  onPlatformSelect,
  disabled
}) => {
  return (
    <div className="card">
      <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem', fontWeight: '600' }}>
        选择平台
      </h2>
      <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
        选择目标平台以生成对应尺寸的图标
      </p>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1rem'
      }}>
        {PLATFORM_PRESETS.map((platform) => (
          <div
            key={platform.id}
            onClick={() => !disabled && onPlatformSelect(platform)}
            style={{
              border: selectedPlatform?.id === platform.id 
                ? '2px solid #3b82f6' 
                : '2px solid #e2e8f0',
              borderRadius: '8px',
              padding: '1.5rem',
              cursor: disabled ? 'not-allowed' : 'pointer',
              backgroundColor: selectedPlatform?.id === platform.id 
                ? '#eff6ff' 
                : 'white',
              transition: 'all 0.2s ease',
              opacity: disabled ? 0.6 : 1
            }}
            onMouseEnter={(e) => {
              if (!disabled && selectedPlatform?.id !== platform.id) {
                e.currentTarget.style.borderColor = '#94a3b8';
              }
            }}
            onMouseLeave={(e) => {
              if (!disabled && selectedPlatform?.id !== platform.id) {
                e.currentTarget.style.borderColor = '#e2e8f0';
              }
            }}
          >
            <h3 style={{ 
              fontSize: '1.2rem', 
              fontWeight: '600', 
              marginBottom: '0.5rem',
              color: selectedPlatform?.id === platform.id ? '#1e40af' : '#1e293b'
            }}>
              {platform.name}
            </h3>
            <p style={{ 
              color: '#64748b', 
              marginBottom: '1rem',
              fontSize: '0.9rem'
            }}>
              {platform.description}
            </p>
            <div style={{ fontSize: '0.8rem', color: '#475569' }}>
              <strong>包含尺寸：</strong>
              <div style={{ marginTop: '0.5rem' }}>
                {platform.sizes.map((size, index) => (
                  <span key={index} style={{
                    display: 'inline-block',
                    backgroundColor: '#f1f5f9',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    marginRight: '4px',
                    marginBottom: '4px'
                  }}>
                    {size.width}×{size.height}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlatformSelector;