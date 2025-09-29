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
    
    // 设置画布尺寸
    this.canvas.width = width;
    this.canvas.height = height;
    
    // 清空画布
    this.ctx.clearRect(0, 0, width, height);
    
    // 计算裁剪区域
    let sourceX = 0;
    let sourceY = 0;
    let sourceWidth = img.width;
    let sourceHeight = img.height;
    
    if (cropArea) {
      // 使用自定义裁剪区域
      sourceX = cropArea.x;
      sourceY = cropArea.y;
      sourceWidth = cropArea.width;
      sourceHeight = cropArea.height;
    } else {
      // 默认居中裁剪
      const sourceSize = Math.min(img.width, img.height);
      sourceX = (img.width - sourceSize) / 2;
      sourceY = (img.height - sourceSize) / 2;
      sourceWidth = sourceSize;
      sourceHeight = sourceSize;
    }
    
    // 绘制图像
    this.ctx.drawImage(
      img,
      sourceX, sourceY, sourceWidth, sourceHeight,  // 源图像区域
      0, 0, width, height                          // 目标区域
    );
    
    // 转换为 Blob
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
    // 清理资源
    this.canvas.remove();
  }
}