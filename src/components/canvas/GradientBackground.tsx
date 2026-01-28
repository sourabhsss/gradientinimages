import { Rect } from 'react-konva';
import { useCanvasStore } from '@/store/useCanvasStore';

export function GradientBackground() {
  const { canvasSize, gradient } = useCanvasStore();

  return (
    <Rect
      x={0}
      y={0}
      width={canvasSize.width}
      height={canvasSize.height}
      fillLinearGradientStartPoint={{ x: 0, y: 0 }}
      fillLinearGradientEndPoint={{
        x: canvasSize.width * Math.cos((gradient.angle * Math.PI) / 180),
        y: canvasSize.height * Math.sin((gradient.angle * Math.PI) / 180),
      }}
      fillLinearGradientColorStops={
        gradient.colors.length === 2
          ? [0, gradient.colors[0], 1, gradient.colors[1]]
          : gradient.colors.length === 3
          ? [0, gradient.colors[0], 0.5, gradient.colors[1], 1, gradient.colors[2]]
          : [
              0,
              gradient.colors[0],
              0.33,
              gradient.colors[1],
              0.66,
              gradient.colors[2],
              1,
              gradient.colors[3],
            ]
      }
      listening={false}
    />
  );
}
