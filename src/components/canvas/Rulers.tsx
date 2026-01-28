import { Line, Text, Rect } from 'react-konva';
import { useCanvasStore } from '@/store/useCanvasStore';

export function Rulers() {
  const { canvasSize } = useCanvasStore();
  const rulerSize = 20; // Size of ruler track
  const majorTickSize = 10;
  const minorTickSize = 5;
  const tickInterval = 50; // Major tick every 50px
  const minorInterval = 10; // Minor tick every 10px

  const rulerColor = '#94a3b8'; // slate-400
  const rulerBgColor = '#f1f5f9'; // slate-100
  const textColor = '#64748b'; // slate-500

  // Generate horizontal ruler (top)
  const horizontalTicks = [];
  const horizontalLabels = [];
  for (let i = 0; i <= canvasSize.width; i += minorInterval) {
    const isMajor = i % tickInterval === 0;
    const tickSize = isMajor ? majorTickSize : minorTickSize;
    
    horizontalTicks.push(
      <Line
        key={`h-tick-${i}`}
        points={[i, rulerSize - tickSize, i, rulerSize]}
        stroke={rulerColor}
        strokeWidth={1}
      />
    );

    if (isMajor && i > 0) {
      horizontalLabels.push(
        <Text
          key={`h-label-${i}`}
          x={i - 15}
          y={2}
          text={i.toString()}
          fontSize={9}
          fill={textColor}
          fontFamily="system-ui"
        />
      );
    }
  }

  // Generate vertical ruler (left)
  const verticalTicks = [];
  const verticalLabels = [];
  for (let i = 0; i <= canvasSize.height; i += minorInterval) {
    const isMajor = i % tickInterval === 0;
    const tickSize = isMajor ? majorTickSize : minorTickSize;
    
    verticalTicks.push(
      <Line
        key={`v-tick-${i}`}
        points={[rulerSize - tickSize, i, rulerSize, i]}
        stroke={rulerColor}
        strokeWidth={1}
      />
    );

    if (isMajor && i > 0) {
      verticalLabels.push(
        <Text
          key={`v-label-${i}`}
          x={2}
          y={i - 4}
          text={i.toString()}
          fontSize={9}
          fill={textColor}
          fontFamily="system-ui"
        />
      );
    }
  }

  return (
    <>
      {/* Horizontal ruler background */}
      <Rect
        x={0}
        y={0}
        width={canvasSize.width}
        height={rulerSize}
        fill={rulerBgColor}
      />
      
      {/* Vertical ruler background */}
      <Rect
        x={0}
        y={0}
        width={rulerSize}
        height={canvasSize.height}
        fill={rulerBgColor}
      />

      {/* Corner square */}
      <Rect
        x={0}
        y={0}
        width={rulerSize}
        height={rulerSize}
        fill={rulerBgColor}
      />

      {/* Horizontal ruler ticks and labels */}
      {horizontalTicks}
      {horizontalLabels}

      {/* Vertical ruler ticks and labels */}
      {verticalTicks}
      {verticalLabels}

      {/* Ruler borders */}
      <Line
        points={[0, rulerSize, canvasSize.width, rulerSize]}
        stroke={rulerColor}
        strokeWidth={1}
      />
      <Line
        points={[rulerSize, 0, rulerSize, canvasSize.height]}
        stroke={rulerColor}
        strokeWidth={1}
      />
    </>
  );
}
