import { IconSize, ProcessedIcon, CropArea } from '../types';

export class ImageProcessor {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
  }

  async processImage(imageFile: File, sizes: IconSize[], cropArea?: CropArea): Promise<ProcessedIcon[]> {
    const img = await this.loadImage(imageFile);
    const processedIcons: ProcessedIcon[] = [];

    for (const size of sizes) {
      const blob = await this.resizeImage(img, size, cropArea);
      const url = URL.createObjectURL(blob);
      
      processedIcons.push({
        size,
        blob,
        url
      });
    }

    return processedIcons;
  }

  private loadImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  private async resizeImage(img: HTMLImageElement, size: IconSize, cropArea?: CropArea): Promise<Blob> {
    const { width, height } = size;
    
    // Set canvas size
    this.canvas.width = width;
    this.canvas.height = height;
    
    // Clear canvas
    this.ctx.clearRect(0, 0, width, height);
    
    // Calculate crop area
    let sourceX = 0;
    let sourceY = 0;
    let sourceWidth = img.width;
    let sourceHeight = img.height;
    
    if (cropArea) {
      // Use custom crop area
      sourceX = cropArea.x;
      sourceY = cropArea.y;
      sourceWidth = cropArea.width;
      sourceHeight = cropArea.height;
    } else {
      // Default center crop
      const sourceSize = Math.min(img.width, img.height);
      sourceX = (img.width - sourceSize) / 2;
      sourceY = (img.height - sourceSize) / 2;
      sourceWidth = sourceSize;
      sourceHeight = sourceSize;
    }
    
    // Draw image
    this.ctx.drawImage(
      img,
      sourceX, sourceY, sourceWidth, sourceHeight,  // Source image area
      0, 0, width, height                          // Target area
    );
    
    // Convert to Blob
    return new Promise((resolve, reject) => {
      this.canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create blob from canvas'));
        }
      }, 'image/png', 1.0);
    });
  }

  cleanup() {
    // Clean up resources
    this.canvas.remove();
  }
}