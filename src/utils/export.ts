import type Konva from 'konva';
import type { ExportScale } from '@/types/canvas';

export const exportCanvas = async (
  stage: Konva.Stage,
  scale: ExportScale,
  filename: string = 'gradient-image.png'
): Promise<void> => {
  try {
    // Find and hide UI guides layer (rulers and alignment lines)
    const uiGuidesLayer = stage.findOne('.ui-guides');
    const wasVisible = uiGuidesLayer?.visible() ?? false;
    if (uiGuidesLayer) {
      uiGuidesLayer.visible(false);
    }
    
    // Save current scale
    const currentScale = stage.scaleX();
    
    // Reset scale to 1:1 for export (to maintain aspect ratio)
    stage.scale({ x: 1, y: 1 });
    
    // Export as data URL with the specified scale as pixel ratio
    const dataURL = stage.toDataURL({ 
      pixelRatio: scale,
      mimeType: 'image/png',
    });
    
    // Restore original scale
    stage.scale({ x: currentScale, y: currentScale });
    
    // Restore UI guides layer visibility
    if (uiGuidesLayer) {
      uiGuidesLayer.visible(wasVisible);
    }
    
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
