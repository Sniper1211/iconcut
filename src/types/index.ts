export interface IconSize {
  width: number;
  height: number;
  name: string;
}

export interface PlatformPreset {
  id: string;
  name: string;
  description: string;
  sizes: IconSize[];
}

export interface ProcessedIcon {
  size: IconSize;
  blob: Blob;
  url: string;
}

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface UploadedImage {
  file: File;
  url: string;
  width: number;
  height: number;
  cropArea?: CropArea;
}