import { useState, useCallback } from 'react';
import Header from './components/Header';
import ImageUpload from './components/ImageUpload';
import PlatformSelector from './components/PlatformSelector';
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
    // 清理之前的图标 URLs
    if (processedIcons.length > 0) {
      DownloadHelper.revokeUrls(processedIcons);
    }
    
    setUploadedImage(image);
    setProcessedIcons([]);
    setSelectedPlatform(null);
  }, [processedIcons]);

  const handleCropAreaChange = useCallback((newCropArea: CropArea | null) => {
    setCropArea(newCropArea);
    // 如果裁剪区域发生变化，重置已处理的图标
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
      console.error('图标处理失败:', error);
      alert('图标处理失败，请重试');
    } finally {
      setIsProcessing(false);
    }
  }, [uploadedImage, cropArea]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      
      <main style={{ flex: 1, padding: '2rem 0' }}>
        <div className="container">
          <div style={{ 
            display: 'grid', 
            gap: '2rem',
            gridTemplateColumns: '1fr',
            maxWidth: '1000px',
            margin: '0 auto'
          }}>
            
            {/* 步骤指示器 */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem',
              backgroundColor: 'white',
              borderRadius: '12px',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: uploadedImage ? '#10b981' : '#64748b'
              }}>
                <span style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: uploadedImage ? '#10b981' : '#e2e8f0',
                  color: uploadedImage ? 'white' : '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: 'bold'
                }}>
                  1
                </span>
                <span>上传图片</span>
              </div>
              
              <div style={{ width: '2rem', height: '1px', backgroundColor: '#e2e8f0' }}></div>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: selectedPlatform ? '#10b981' : '#64748b'
              }}>
                <span style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: selectedPlatform ? '#10b981' : '#e2e8f0',
                  color: selectedPlatform ? 'white' : '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: 'bold'
                }}>
                  2
                </span>
                <span>选择平台</span>
              </div>
              
              <div style={{ width: '2rem', height: '1px', backgroundColor: '#e2e8f0' }}></div>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: processedIcons.length > 0 ? '#10b981' : '#64748b'
              }}>
                <span style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: processedIcons.length > 0 ? '#10b981' : '#e2e8f0',
                  color: processedIcons.length > 0 ? 'white' : '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: 'bold'
                }}>
                  3
                </span>
                <span>下载图标</span>
              </div>
            </div>

            {/* 上传区域 */}
            <ImageUpload 
              onImageUpload={handleImageUpload}
              isProcessing={isProcessing}
              onCropAreaChange={handleCropAreaChange}
            />

            {/* 显示上传的图片信息 */}
            {uploadedImage && (
              <div className="card">
                <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem', fontWeight: '600' }}>
                  已上传图片
                </h3>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1rem',
                  flexWrap: 'wrap'
                }}>
                  <img
                    src={uploadedImage.url}
                    alt="上传的图片"
                    style={{
                      width: '80px',
                      height: '80px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0'
                    }}
                  />
                  <div>
                    <p style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                      {uploadedImage.file.name}
                    </p>
                    <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                      尺寸: {uploadedImage.width} × {uploadedImage.height} 像素
                    </p>
                    <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                      大小: {(uploadedImage.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 平台选择 */}
            {uploadedImage && (
              <PlatformSelector
                selectedPlatform={selectedPlatform}
                onPlatformSelect={handlePlatformSelect}
                disabled={isProcessing}
              />
            )}

            {/* 图标预览 */}
            {(processedIcons.length > 0 || isProcessing) && selectedPlatform && (
              <IconPreview
                icons={processedIcons}
                platformName={selectedPlatform.name}
                isProcessing={isProcessing}
              />
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;