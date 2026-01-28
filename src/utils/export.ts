import type Konva from 'konva';
import type { ExportScale } from '@/types/canvas';

export const exportCanvas = async (
  stage: Konva.Stage,
  scale: ExportScale,
  filename: string = 'gradient-image.png'
): Promise<void> => {
  try {
    // Save current scale
    const currentScale = stage.scaleX();
    
    // Apply export scale
    stage.scale({ x: scale, y: scale });
    
    // Export as data URL
    const dataURL = stage.toDataURL({ pixelRatio: 1 });
    
    // Restore original scale
    stage.scale({ x: currentScale, y: currentScale });
    
    // Create download link
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Export failed:', error);
    throw error;
  }
};

export const generateFilename = (scale: ExportScale): string => {
  const timestamp = new Date().toISOString().split('T')[0];
  return `gradient-bg-${timestamp}-${scale}x.png`;
};
