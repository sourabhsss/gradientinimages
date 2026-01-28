import { Line } from 'react-konva';
import { useCanvasStore } from '@/store/useCanvasStore';

interface AlignmentGuidesProps {
  showVertical: boolean;
  showHorizontal: boolean;
}

export function AlignmentGuides({ showVertical, showHorizontal }: AlignmentGuidesProps) {
  const { canvasSize } = useCanvasStore();
  
  const guideColor = '#FF006E'; // Bright pink/magenta like Canva
  const guideWidth = 1.5;

  return (
    <>
      {/* Vertical center guide (when horizontally centered) */}
      {showVertical && (
        <Line
          points={[canvasSize.width / 2, 0, canvasSize.width / 2, canvasSize.height]}
          stroke={guideColor}
          strokeWidth={guideWidth}
          dash={[8, 4]}
          listening={false}
        />
      )}

      {/* Horizontal center guide (when vertically centered) */}
      {showHorizontal && (
        <Line
          points={[0, canvasSize.height / 2, canvasSize.width, canvasSize.height / 2]}
          stroke={guideColor}
          strokeWidth={guideWidth}
          dash={[8, 4]}
          listening={false}
        />
      )}
    </>
  );
}
