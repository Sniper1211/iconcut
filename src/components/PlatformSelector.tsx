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
    <div>
      <h2 className="platform-selector-title">
        Select Platform
      </h2>
      <p className="platform-selector-description">
        Select target platform to generate corresponding size icons
      </p>
      
      <div className="platform-selector-grid">
        {PLATFORM_PRESETS.map((platform) => (
          <div
            key={platform.id}
            onClick={() => !disabled && onPlatformSelect(platform)}
            className={`platform-card ${selectedPlatform?.id === platform.id ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
          >
            <h3 className={`platform-card-title ${selectedPlatform?.id === platform.id ? 'selected' : ''}`}>
              {platform.name}
            </h3>
            <p className="platform-card-description">
              {platform.description}
            </p>
            <div className="platform-card-sizes">
              <span className="platform-card-sizes-label">Includes sizes:</span>
              <div className="platform-card-sizes-list">
                {platform.sizes.map((size, index) => (
                  <span key={index} className="platform-size-tag">
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