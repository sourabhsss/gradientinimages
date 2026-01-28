import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useCanvasStore } from '@/store/useCanvasStore';

export function FrameControls() {
  const {
    framePadding,
    frameRadius,
    frameShadow,
    setFramePadding,
    setFrameRadius,
    setFrameShadow,
    selectedImageId,
  } = useCanvasStore();

  const isDisabled = !selectedImageId;

  return (
    <div className="space-y-4 p-4">
      <div>
        <h2 className="text-base font-semibold">Frame Styling</h2>
        <p className="text-xs text-muted-foreground">
          {isDisabled ? 'Select an image to adjust' : 'Adjust selected image'}
        </p>
      </div>

      <div className="space-y-4">
        <div className="neu-card space-y-2 p-3 rounded-xl">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium">Padding</Label>
            <span className="neu-raised-sm text-xs font-semibold px-2 py-0.5 rounded-lg">{framePadding}px</span>
          </div>
          <div className="neu-inset rounded-full p-1">
            <Slider
              value={[framePadding]}
              onValueChange={(value) => setFramePadding(value[0])}
              min={0}
              max={100}
              step={1}
              disabled={isDisabled}
              className="w-full"
            />
          </div>
        </div>

        <div className="neu-card space-y-2 p-3 rounded-xl">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium">Corner Radius</Label>
            <span className="neu-raised-sm text-xs font-semibold px-2 py-0.5 rounded-lg">{frameRadius}px</span>
          </div>
          <div className="neu-inset rounded-full p-1">
            <Slider
              value={[frameRadius]}
              onValueChange={(value) => setFrameRadius(value[0])}
              min={0}
              max={50}
              step={1}
              disabled={isDisabled}
              className="w-full"
            />
          </div>
        </div>

        <div className="neu-card space-y-2 p-3 rounded-xl">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium">Shadow Intensity</Label>
            <span className="neu-raised-sm text-xs font-semibold px-2 py-0.5 rounded-lg">{frameShadow}%</span>
          </div>
          <div className="neu-inset rounded-full p-1">
            <Slider
              value={[frameShadow]}
              onValueChange={(value) => setFrameShadow(value[0])}
              min={0}
              max={100}
              step={1}
              disabled={isDisabled}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
