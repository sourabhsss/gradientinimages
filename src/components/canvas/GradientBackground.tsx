import { Rect } from 'react-konva';
import { useCanvasStore } from '@/store/useCanvasStore';
import { useMemo } from 'react';

export function GradientBackground() {
  const { canvasSize, gradient } = useCanvasStore();

  // Calculate gradient start and end points based on CSS gradient angle convention
  // CSS gradient angles: 0deg = bottom to top, 90deg = left to right, etc.
  const gradientPoints = useMemo(() => {
    // Convert CSS angle to radians (CSS angles are clockwise from top)
    const cssAngle = gradient.angle;
    const radians = ((cssAngle - 90) * Math.PI) / 180;
    
    // Calculate the gradient line length needed to cover the entire rectangle
    const width = canvasSize.width;
    const height = canvasSize.height;
    
    // The gradient line needs to be long enough to cover corner to corner
    const diagonal = Math.sqrt(width * width + height * height);
    
    // Calculate direction vector
    const dx = Math.cos(radians);
    const dy = Math.sin(radians);
    
    // Center of the canvas
    const cx = width / 2;
    const cy = height / 2;
    
    // Calculate start and end points extending from center
    const halfLength = diagonal / 2;
    
    return {
      start: {
        x: cx - dx * halfLength,
        y: cy - dy * halfLength,
      },
      end: {
        x: cx + dx * halfLength,
        y: cy + dy * halfLength,
      },
    };
  }, [gradient.angle, canvasSize.width, canvasSize.height]);

  const colorStops = useMemo(() => {
    const colors = gradient.colors;
    if (colors.length === 2) {
      return [0, colors[0], 1, colors[1]];
    } else if (colors.length === 3) {
      return [0, colors[0], 0.5, colors[1], 1, colors[2]];
    } else {
      return [0, colors[0], 0.33, colors[1], 0.66, colors[2], 1, colors[3]];
    }
  }, [gradient.colors]);

  return (
    <Rect
      x={0}
      y={0}
      width={canvasSize.width}
      height={canvasSize.height}
      fillLinearGradientStartPoint={gradientPoints.start}
      fillLinearGradientEndPoint={gradientPoints.end}
      fillLinearGradientColorStops={colorStops}
      listening={false}
    />
  );
}
