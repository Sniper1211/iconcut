import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { ProcessedIcon } from '../types';

export class DownloadHelper {
  static async downloadAsZip(icons: ProcessedIcon[], platformName: string) {
    const zip = new JSZip();
    
    // Create platform folder
    const folder = zip.folder(platformName);
    
    if (!folder) {
      throw new Error('Failed to create folder in ZIP');
    }
    
    // Add all icon files to ZIP
    for (const icon of icons) {
      try {
        const arrayBuffer = await icon.blob.arrayBuffer();
        folder.file(icon.size.name, arrayBuffer);
      } catch (error) {
        console.error(`Failed to add ${icon.size.name} to ZIP:`, error);
        throw new Error(`Failed to process ${icon.size.name}`);
      }
    }
    
    // Generate ZIP file and download
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const fileName = `${platformName}-icons-${Date.now()}.zip`;
    
    saveAs(zipBlob, fileName);
  }
  
  static downloadSingle(icon: ProcessedIcon) {
    saveAs(icon.blob, icon.size.name);
  }
  
  static revokeUrls(icons: ProcessedIcon[]) {
    icons.forEach(icon => {
      URL.revokeObjectURL(icon.url);
    });
  }
}