import React, { useCallback, useState, useRef } from 'react';
import { UploadedImage, CropArea, PlatformPreset } from '../types';
import PlatformSelector from './PlatformSelector';

interface ImageUploadProps {
  onImageUpload: (image: UploadedImage) => void;
  isProcessing: boolean;
  onCropAreaChange?: (cropArea: CropArea | null) => void;
  uploadedImage?: UploadedImage | null;
  selectedPlatform?: PlatformPreset | null;
  onPlatformSelect?: (platform: PlatformPreset) => void;
  onImageReselect?: () => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  onImageUpload, 
  isProcessing, 
  onCropAreaChange, 
  uploadedImage, 
  selectedPlatform, 
  onPlatformSelect,
  onImageReselect
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [isDragReject, setIsDragReject] = useState(false);
  const [selectedImage, setSelectedImage] = useState<HTMLImageElement | null>(null);
  const [cropArea, setCropArea] = useState<CropArea | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [resizeStart, setResizeStart] = useState<{ x: number; y: number; width: number; height: number } | null>(null);

  const imageRef = useRef<HTMLImageElement>(null);

  const validateFile = (file: File): boolean => {
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    return validTypes.includes(file.type) && file.size <= maxSize;
  };

  const handleFile = useCallback(async (file: File) => {
    if (!validateFile(file)) {
      alert('Please upload PNG or JPG format images, file size should not exceed 10MB');
      return;
    }

    try {
      const img = new Image();
      const imageUrl = URL.createObjectURL(file);
      
      img.onload = () => {
        setSelectedImage(img);
        // Set default crop area (center square)
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
        alert('Image loading failed, please select a valid image file');
      };
      
      img.src = imageUrl;
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Error processing image, please try again');
    }
  }, [onImageUpload, onCropAreaChange]);



  // Reset crop area
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

  // Handle mouse down event
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!selectedImage || !cropArea) return;
    
    const target = e.target as HTMLElement;
    
    // Check if clicking on a resize handle
    if (target.classList.contains('resize-handle')) {
      const handleType = target.className.split(' ').find(cls => 
        ['nw', 'ne', 'sw', 'se', 'n', 's', 'w', 'e'].includes(cls)
      );
      
      if (handleType) {
        setIsResizing(true);
        setResizeHandle(handleType);
        setResizeStart({
          x: e.clientX,
          y: e.clientY,
          width: cropArea.width,
          height: cropArea.height
        });
        e.preventDefault();
        return;
      }
    }
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Convert mouse coordinates to image coordinates
    const imgRect = imageRef.current?.getBoundingClientRect();
    if (!imgRect) return;
    
    const scaleX = selectedImage.width / imgRect.width;
    const scaleY = selectedImage.height / imgRect.height;
    
    const imgX = (x - (rect.left - imgRect.left)) * scaleX;
    const imgY = (y - (rect.top - imgRect.top)) * scaleY;
    
    // Check if within crop area
    if (imgX >= cropArea.x && imgX <= cropArea.x + cropArea.width &&
        imgY >= cropArea.y && imgY <= cropArea.y + cropArea.height) {
      setIsDragging(true);
      setDragStart({ x: imgX - cropArea.x, y: imgY - cropArea.y });
    }
  }, [selectedImage, cropArea]);

  // Handle mouse move event
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!selectedImage || !cropArea) return;
    
    const imgRect = imageRef.current?.getBoundingClientRect();
    if (!imgRect) return;
    
    const scaleX = selectedImage.width / imgRect.width;
    const scaleY = selectedImage.height / imgRect.height;
    
    // Handle resizing
    if (isResizing && resizeHandle && resizeStart) {
      const deltaX = (e.clientX - resizeStart.x) * scaleX;
      const deltaY = (e.clientY - resizeStart.y) * scaleY;
      
      let newX = cropArea.x;
      let newY = cropArea.y;
      let newWidth = resizeStart.width;
      let newHeight = resizeStart.height;
      
      // Apply resize based on handle type
      switch (resizeHandle) {
        case 'se': // Southeast
          newWidth = Math.max(50, resizeStart.width + deltaX);
          newHeight = Math.max(50, resizeStart.height + deltaY);
          break;
        case 'sw': // Southwest
          newWidth = Math.max(50, resizeStart.width - deltaX);
          newHeight = Math.max(50, resizeStart.height + deltaY);
          newX = cropArea.x + (resizeStart.width - newWidth);
          break;
        case 'ne': // Northeast
          newWidth = Math.max(50, resizeStart.width + deltaX);
          newHeight = Math.max(50, resizeStart.height - deltaY);
          newY = cropArea.y + (resizeStart.height - newHeight);
          break;
        case 'nw': // Northwest
          newWidth = Math.max(50, resizeStart.width - deltaX);
          newHeight = Math.max(50, resizeStart.height - deltaY);
          newX = cropArea.x + (resizeStart.width - newWidth);
          newY = cropArea.y + (resizeStart.height - newHeight);
          break;
        case 'e': // East
          newWidth = Math.max(50, resizeStart.width + deltaX);
          break;
        case 'w': // West
          newWidth = Math.max(50, resizeStart.width - deltaX);
          newX = cropArea.x + (resizeStart.width - newWidth);
          break;
        case 's': // South
          newHeight = Math.max(50, resizeStart.height + deltaY);
          break;
        case 'n': // North
          newHeight = Math.max(50, resizeStart.height - deltaY);
          newY = cropArea.y + (resizeStart.height - newHeight);
          break;
      }
      
      // Ensure crop area stays within image bounds
      newX = Math.max(0, Math.min(newX, selectedImage.width - newWidth));
      newY = Math.max(0, Math.min(newY, selectedImage.height - newHeight));
      newWidth = Math.min(newWidth, selectedImage.width - newX);
      newHeight = Math.min(newHeight, selectedImage.height - newY);
      
      const newCropArea: CropArea = {
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight
      };
      
      setCropArea(newCropArea);
      onCropAreaChange?.(newCropArea);
      return;
    }
    
    // Handle dragging
    if (isDragging && dragStart) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const imgX = (x - (rect.left - imgRect.left)) * scaleX;
      const imgY = (y - (rect.top - imgRect.top)) * scaleY;
      
      // Calculate new crop area position
      let newX = imgX - dragStart.x;
      let newY = imgY - dragStart.y;
      
      // Limit boundaries
      newX = Math.max(0, Math.min(newX, selectedImage.width - cropArea.width));
      newY = Math.max(0, Math.min(newY, selectedImage.height - cropArea.height));
      
      const newCropArea: CropArea = {
        ...cropArea,
        x: newX,
        y: newY
      };
      
      setCropArea(newCropArea);
      onCropAreaChange?.(newCropArea);
    }
  }, [isDragging, isResizing, selectedImage, cropArea, dragStart, resizeHandle, resizeStart, onCropAreaChange]);

  // Handle mouse up event
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragStart(null);
    setIsResizing(false);
    setResizeHandle(null);
    setResizeStart(null);
  }, []);

  // Handle mouse leave event
  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
    setDragStart(null);
    setIsResizing(false);
    setResizeHandle(null);
    setResizeStart(null);
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
    
    // Check dragged file type
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
      {!selectedImage ? (
        <>
        <h2 className="image-upload-title">
          Upload Image
        </h2>
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
            Drag image here, or click to select file
          </p>
          <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1.5rem' }}>
            Supports PNG, JPG formats, max 10MB
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
                Processing...
              </>
            ) : (
              'Select File'
            )}
          </label>
        </div>
        </>
      ) : (
        <div className='container'>
          <h2 className="title">
            {'Select Platform'}
          </h2>
          <div className="crop-area-header">
            <div>
              {uploadedImage && (
                <div className="uploaded-image-info">
                  <div className="uploaded-image-details-small">
                    <p className="uploaded-image-name-small">
                      {uploadedImage.file.name}
                    </p>
                    <p className="uploaded-image-meta-small">
                      {uploadedImage.width} × {uploadedImage.height}px • {(uploadedImage.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              )}
            </div>
            <button 
              className="btn btn-primary"
              onClick={() => {
                setSelectedImage(null);
                setCropArea(null);
                onCropAreaChange?.(null);
                onImageReselect?.();
              }}
            >
              Reselect Image
            </button>
          </div>
          
          <div className="crop-platform-container">
            <div className="crop-area-container">
              <h3 className="crop-area-title">Select Crop Area</h3>
              
              <div className="crop-area-main">
                <p className="crop-area-instructions">
                  Drag the selection box to move it, or drag the handles to resize. Ensure important content is within the box.
                </p>
                
                <div 
                  className={`image-preview-container ${isDragging || isResizing ? 'dragging' : ''}`}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseLeave}
                >
                  <img 
                    ref={imageRef}
                    src={selectedImage.src} 
                    alt="Preview" 
                    className="image-preview"
                  />
                  {cropArea && (
                    <div
                      className={`crop-area-overlay ${isDragging ? 'dragging' : ''}`}
                      style={{
                        left: `${(cropArea.x / selectedImage.width) * 100}%`,
                        top: `${(cropArea.y / selectedImage.height) * 100}%`,
                        width: `${(cropArea.width / selectedImage.width) * 100}%`,
                        height: `${(cropArea.height / selectedImage.height) * 100}%`,
                      }}
                    >
                      {/* Resize handles */}
                      <div className="resize-handle nw"></div>
                      <div className="resize-handle ne"></div>
                      <div className="resize-handle sw"></div>
                      <div className="resize-handle se"></div>
                      <div className="resize-handle n"></div>
                      <div className="resize-handle s"></div>
                      <div className="resize-handle w"></div>
                      <div className="resize-handle e"></div>
                    </div>
                  )}
                </div>
                
                <div className="crop-area-controls">
                  <button 
                    className="btn btn-secondary"
                    onClick={resetCropArea}
                  >
                    Reset Square
                  </button>
                  <div className="crop-area-info">
                    Current area: {cropArea?.width}x{cropArea?.height} pixels
                    {cropArea && ` (position: ${Math.round(cropArea.x)},${Math.round(cropArea.y)})`}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="platform-section">
              {/* Platform Selection */}
              {uploadedImage && onPlatformSelect && (
                <PlatformSelector
                  selectedPlatform={selectedPlatform || null}
                  onPlatformSelect={onPlatformSelect}
                  disabled={isProcessing}
                />
              )}
             </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;