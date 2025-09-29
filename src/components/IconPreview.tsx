import React from 'react';
import { ProcessedIcon } from '../types';
import { DownloadHelper } from '../utils/downloadHelper';

interface IconPreviewProps {
  icons: ProcessedIcon[];
  platformName: string;
  isProcessing: boolean;
}

const IconPreview: React.FC<IconPreviewProps> = ({ 
  icons, 
  platformName, 
  isProcessing 
}) => {
  const handleDownloadAll = () => {
    DownloadHelper.downloadAsZip(icons, platformName);
  };

  const handleDownloadSingle = (icon: ProcessedIcon) => {
    DownloadHelper.downloadSingle(icon);
  };

  if (isProcessing) {
    return (
      <div className="card">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div className="loading" style={{ 
            width: '40px', 
            height: '40px', 
            margin: '0 auto 1rem' 
          }}></div>
          <p style={{ color: '#64748b' }}>正在生成图标...</p>
        </div>
      </div>
    );
  }

  if (icons.length === 0) {
    return null;
  }

  return (
    <div className="card">
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '1.5rem'
      }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>
          预览图标
        </h2>
        <button 
          onClick={handleDownloadAll}
          className="btn btn-success"
          style={{ fontSize: '1rem' }}
        >
          📦 下载全部 ({icons.length} 个)
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '1rem'
      }}>
        {icons.map((icon, index) => (
          <div
            key={index}
            style={{
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '1rem',
              textAlign: 'center',
              backgroundColor: '#fafafa'
            }}
          >
            <div style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 1rem',
              border: '1px solid #e2e8f0',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'white',
              backgroundImage: `url("data:image/svg+xml,%3csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3cpattern id='smallGrid' width='8' height='8' patternUnits='userSpaceOnUse'%3e%3cpath d='M 8 0 L 0 0 0 8' fill='none' stroke='%23e2e8f0' stroke-width='0.5'/%3e%3c/pattern%3e%3c/defs%3e%3crect width='100' height='100' fill='url(%23smallGrid)' /%3e%3c/svg%3e")`
            }}>
              <img
                src={icon.url}
                alt={`${icon.size.width}x${icon.size.height}`}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain' as const
                }}
              />
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ 
                fontWeight: '600', 
                fontSize: '0.9rem',
                marginBottom: '0.25rem'
              }}>
                {icon.size.width} × {icon.size.height}
              </div>
              <div style={{ 
                fontSize: '0.8rem', 
                color: '#64748b',
                wordBreak: 'break-all' as const
              }}>
                {icon.size.name}
              </div>
            </div>
            
            <button
              onClick={() => handleDownloadSingle(icon)}
              className="btn btn-secondary"
              style={{ 
                fontSize: '0.8rem',
                padding: '6px 12px',
                width: '100%'
              }}
            >
              下载
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IconPreview;