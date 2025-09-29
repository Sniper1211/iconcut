import { useState, useCallback } from 'react';
import Header from './components/Header';
import ImageUpload from './components/ImageUpload';
import IconPreview from './components/IconPreview';
import Footer from './components/Footer';
import { UploadedImage, PlatformPreset, ProcessedIcon, CropArea } from './types';
import { ImageProcessor } from './utils/imageProcessor';
import { DownloadHelper } from './utils/downloadHelper';

function App() {
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformPreset | null>(null);
  const [processedIcons, setProcessedIcons] = useState<ProcessedIcon[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cropArea, setCropArea] = useState<CropArea | null>(null);

  const handleImageUpload = useCallback((image: UploadedImage) => {
    // Clean up previous icon URLs
    if (processedIcons.length > 0) {
      DownloadHelper.revokeUrls(processedIcons);
    }
    
    setUploadedImage(image);
    setProcessedIcons([]);
    setSelectedPlatform(null);
  }, [processedIcons]);

  const handleCropAreaChange = useCallback((newCropArea: CropArea | null) => {
    setCropArea(newCropArea);
    // If crop area changes, reset processed icons
    if (processedIcons.length > 0) {
      DownloadHelper.revokeUrls(processedIcons);
      setProcessedIcons([]);
      setSelectedPlatform(null);
    }
  }, [processedIcons]);

  const handlePlatformSelect = useCallback(async (platform: PlatformPreset) => {
    setSelectedPlatform(platform);
    
    if (!uploadedImage) return;
    
    setIsProcessing(true);
    
    try {
      const processor = new ImageProcessor();
      const icons = await processor.processImage(uploadedImage.file, platform.sizes, cropArea || undefined);
      setProcessedIcons(icons);
      processor.cleanup();
    } catch (error) {
      console.error('Icon processing failed:', error);
      alert('Icon processing failed, please try again');
    } finally {
      setIsProcessing(false);
    }
  }, [uploadedImage, cropArea]);

  const handleImageReselect = useCallback(() => {
    setUploadedImage(null);
    setSelectedPlatform(null);
    setProcessedIcons([]);
  }, []);

  return (
    <div className="app-container">
      <Header />
      
      <main className="app-main">
        <div className="container">
          <div className="app-grid">
            
            {/* Step Indicator */}
            <div className="step-indicator">
              <div className="step-item active">
                <span className="step-number active">
                  1
                </span>
                <span>Upload Image</span>
              </div>
              
              <div className="step-divider"></div>
              
              <div className={`step-item ${uploadedImage ? 'active' : 'inactive'}`}>
                <span className={`step-number ${uploadedImage ? 'active' : 'inactive'}`}>
                  2
                </span>
                <span>Select Platform</span>
              </div>
              
              <div className="step-divider"></div>
              
              <div className={`step-item ${processedIcons.length > 0 ? 'active' : 'inactive'}`}>
                <span className={`step-number ${processedIcons.length > 0 ? 'active' : 'inactive'}`}>
                  3
                </span>
                <span>Download Icons</span>
              </div>
            </div>

            {/* Download Icons Container - Always Present */}
            <div className="download-icons-container">
              {selectedPlatform && (
                <IconPreview
                  icons={processedIcons}
                  platformName={selectedPlatform.name}
                  isProcessing={isProcessing}
                />
              )}
            </div>

            {/* Upload Area */}
            <ImageUpload 
              onImageUpload={handleImageUpload}
              isProcessing={isProcessing}
              onCropAreaChange={handleCropAreaChange}
              uploadedImage={uploadedImage}
              selectedPlatform={selectedPlatform}
              onPlatformSelect={handlePlatformSelect}
              onImageReselect={handleImageReselect}
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;