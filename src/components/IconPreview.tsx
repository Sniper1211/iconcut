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
        <div className="icon-preview-loading">
          <div className="loading icon-preview-loading-spinner"></div>
          <p className="icon-preview-loading-text">Generating icons...</p>
        </div>
      </div>
    );
  }

  if (icons.length === 0) {
    return null;
  }

  return (
    <div className="card">
      <div className="icon-preview-header">
        <h2 className="icon-preview-title">
          Download Icons for {platformName}
        </h2>
        <button 
          onClick={handleDownloadAll}
          className="btn btn-success icon-preview-download-all"
        >
          📦 Download All ({icons.length})
        </button>
      </div>

      <div className="icon-preview-grid">
        {icons.map((icon, index) => (
          <div key={index} className="icon-preview-item">
            <div className="icon-preview-image-container">
              <img
                src={icon.url}
                alt={`${icon.size.width}x${icon.size.height}`}
                className="icon-preview-image"
              />
            </div>
            
            <div className="icon-preview-details">
              <div className="icon-preview-size">
                {icon.size.width} × {icon.size.height}
              </div>
              <div className="icon-preview-name">
                {icon.size.name}
              </div>
            </div>
            
            <button
              onClick={() => handleDownloadSingle(icon)}
              className="btn btn-secondary icon-preview-download-btn"
            >
              Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IconPreview;