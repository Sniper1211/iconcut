import React, { useCallback, useState, useRef } from 'react';
import { UploadedImage, CropArea } from '../types';

interface ImageUploadProps {
  onImageUpload: (image: UploadedImage) => void;
  isProcessing: boolean;
  onCropAreaChange?: (cropArea: CropArea | null) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload, isProcessing, onCropAreaChange }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [isDragReject, setIsDragReject] = useState(false);
  const [selectedImage, setSelectedImage] = useState<HTMLImageElement | null>(null);
  const [cropArea, setCropArea] = useState<CropArea | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);

  const imageRef = useRef<HTMLImageElement>(null);

  const validateFile = (file: File): boolean => {
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    return validTypes.includes(file.type) && file.size <= maxSize;
  };

  const handleFile = useCallback(async (file: File) => {
    if (!validateFile(file)) {
      alert('请上传 PNG 或 JPG 格式的图片，文件大小不超过 10MB');
      return;
    }

    try {
      const img = new Image();
      const imageUrl = URL.createObjectURL(file);
      
      img.onload = () => {
        setSelectedImage(img);
        // 设置默认裁剪区域（居中正方形）
        const minSize = Math.min(img.width, img.height);
        const x = (img.width - minSize) / 2;
        const y = (img.height - minSize) / 2;
        const defaultCropArea: CropArea = { x, y, width: minSize, height: minSize };
        setCropArea(defaultCropArea);
        onCropAreaChange?.(defaultCropArea);
        
        const uploadedImage: UploadedImage = {
          file,
          url: imageUrl,
          width: img.width,
          height: img.height,
          cropArea: defaultCropArea
        };
        onImageUpload(uploadedImage);
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(imageUrl);
        alert('图片加载失败，请选择有效的图片文件');
      };
      
      img.src = imageUrl;
    } catch (error) {
      console.error('处理图片时出错:', error);
      alert('处理图片时出错，请重试');
    }
  }, [onImageUpload, onCropAreaChange]);



  // 重置裁剪区域
  const resetCropArea = useCallback(() => {
    if (selectedImage) {
      const minSize = Math.min(selectedImage.width, selectedImage.height);
      const x = (selectedImage.width - minSize) / 2;
      const y = (selectedImage.height - minSize) / 2;
      const defaultCropArea: CropArea = { x, y, width: minSize, height: minSize };
      setCropArea(defaultCropArea);
      onCropAreaChange?.(defaultCropArea);
    }
  }, [selectedImage, onCropAreaChange]);

  // 处理鼠标按下事件
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!selectedImage || !cropArea) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // 将鼠标坐标转换为图片坐标
    const imgRect = imageRef.current?.getBoundingClientRect();
    if (!imgRect) return;
    
    const scaleX = selectedImage.width / imgRect.width;
    const scaleY = selectedImage.height / imgRect.height;
    
    const imgX = (x - (rect.left - imgRect.left)) * scaleX;
    const imgY = (y - (rect.top - imgRect.top)) * scaleY;
    
    // 检查是否在裁剪区域内
    if (imgX >= cropArea.x && imgX <= cropArea.x + cropArea.width &&
        imgY >= cropArea.y && imgY <= cropArea.y + cropArea.height) {
      setIsDragging(true);
      setDragStart({ x: imgX - cropArea.x, y: imgY - cropArea.y });
    }
  }, [selectedImage, cropArea]);

  // 处理鼠标移动事件
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !selectedImage || !cropArea || !dragStart) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const imgRect = imageRef.current?.getBoundingClientRect();
    if (!imgRect) return;
    
    const scaleX = selectedImage.width / imgRect.width;
    const scaleY = selectedImage.height / imgRect.height;
    
    const imgX = (x - (rect.left - imgRect.left)) * scaleX;
    const imgY = (y - (rect.top - imgRect.top)) * scaleY;
    
    // 计算新的裁剪区域位置
    let newX = imgX - dragStart.x;
    let newY = imgY - dragStart.y;
    
    // 限制边界
    newX = Math.max(0, Math.min(newX, selectedImage.width - cropArea.width));
    newY = Math.max(0, Math.min(newY, selectedImage.height - cropArea.height));
    
    const newCropArea: CropArea = {
      ...cropArea,
      x: newX,
      y: newY
    };
    
    setCropArea(newCropArea);
    onCropAreaChange?.(newCropArea);
  }, [isDragging, selectedImage, cropArea, dragStart, onCropAreaChange]);

  // 处理鼠标抬起事件
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragStart(null);
  }, []);

  // 处理鼠标离开事件
  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
    setDragStart(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    setIsDragReject(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
    
    // 检查拖拽的文件类型
    if (e.dataTransfer.items) {
      const items = Array.from(e.dataTransfer.items);
      const hasValidFile = items.some(item => 
        item.kind === 'file' && 
        item.type && 
        ['image/png', 'image/jpeg', 'image/jpg'].includes(item.type)
      );
      setIsDragReject(!hasValidFile);
    }
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragActive(false);
    setIsDragReject(false);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  return (
    <div className="card">
      <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem', fontWeight: '600' }}>
        上传图片
      </h2>
      
      {!selectedImage ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            ${isDragActive ? 'drag-active' : ''}
            ${isDragReject ? 'drag-reject' : ''}
          `.trim()}
          style={{
            border: '2px dashed #cbd5e1',
            borderRadius: '12px',
            padding: '3rem 2rem',
            textAlign: 'center' as const,
            backgroundColor: '#f8fafc',
            cursor: isProcessing ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            opacity: isProcessing ? 0.6 : 1
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📁</div>
          <p style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#475569' }}>
            拖拽图片到此处，或点击选择文件
          </p>
          <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1.5rem' }}>
            支持 PNG、JPG 格式，最大 10MB
          </p>
          
          <input
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            onChange={handleFileSelect}
            disabled={isProcessing}
            style={{ display: 'none' }}
            id="file-input"
          />
          <label 
            htmlFor="file-input" 
            className="btn btn-primary" 
            style={{
              cursor: isProcessing ? 'not-allowed' : 'pointer'
            }}
          >
            {isProcessing ? (
              <>
                <span className="loading"></span>
                处理中...
              </>
            ) : (
              '选择文件'
            )}
          </label>
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '600' }}>选择裁剪区域</h3>
            <button 
              className="btn btn-secondary"
              onClick={() => {
                setSelectedImage(null);
                setCropArea(null);
                onCropAreaChange?.(null);
              }}
            >
              重新选择
            </button>
          </div>
          
          <div style={{ 
            border: '1px solid #e2e8f0', 
            borderRadius: '8px', 
            padding: '1rem',
            backgroundColor: '#f8fafc',
            marginBottom: '1rem'
          }}>
            <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1rem' }}>
              拖动选择框调整裁剪区域，确保重要内容在框内
            </p>
            
            <div 
              style={{ 
                position: 'relative', 
                display: 'inline-block',
                cursor: isDragging ? 'grabbing' : 'default'
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
            >
              <img 
                ref={imageRef}
                src={selectedImage.src} 
                alt="预览" 
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '300px', 
                  display: 'block',
                  borderRadius: '4px'
                }}
              />
              {cropArea && (
                <div
                  style={{
                    position: 'absolute',
                    left: `${(cropArea.x / selectedImage.width) * 100}%`,
                    top: `${(cropArea.y / selectedImage.height) * 100}%`,
                    width: `${(cropArea.width / selectedImage.width) * 100}%`,
                    height: `${(cropArea.height / selectedImage.height) * 100}%`,
                    border: '2px solid #3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    cursor: isDragging ? 'grabbing' : 'grab'
                  }}
                />
              )}
            </div>
            
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button 
                className="btn btn-secondary"
                onClick={resetCropArea}
                style={{ fontSize: '0.9rem' }}
              >
                重置为居中
              </button>
              <div style={{ fontSize: '0.9rem', color: '#64748b', display: 'flex', alignItems: 'center' }}>
                当前区域: {cropArea?.width}x{cropArea?.height} 像素
                {cropArea && ` (位置: ${Math.round(cropArea.x)},${Math.round(cropArea.y)})`}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;