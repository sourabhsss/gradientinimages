import { Line } from 'react-konva';
import { useCanvasStore } from '@/store/useCanvasStore';
import { RULER_SIZE } from './Rulers';

interface AlignmentGuidesProps {
  showVertical: boolean;
  showHorizontal: boolean;
}

export function AlignmentGuides({ showVertical, showHorizontal }: AlignmentGuidesProps) {
  const { canvasSize } = useCanvasStore();
  
  const guideColor = '#FFFFFF'; // White solid lines
  const guideWidth = 1.5;
  
  // Calculate center of the content area (excluding rulers)
  // Content area starts at RULER_SIZE and extends to canvasSize
  const contentCenterX = RULER_SIZE + (canvasSize.width - RULER_SIZE) / 2;
  const contentCenterY = RULER_SIZE + (canvasSize.height - RULER_SIZE) / 2;

  return (
    <>
      {/* Vertical center guide (when horizontally centered) */}
      {showVertical && (
        <Line
          points={[contentCenterX, RULER_SIZE, contentCenterX, canvasSize.height]}
          stroke={guideColor}
          strokeWidth={guideWidth}
          listening={false}
        />
      )}

      {/* Horizontal center guide (when vertically centered) */}
      {showHorizontal && (
        <Line
          points={[RULER_SIZE, contentCenterY, canvasSize.width, contentCenterY]}
          stroke={guideColor}
          strokeWidth={guideWidth}
          listening={false}
        />
      )}
    </>
  );
}
