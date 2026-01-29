import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useCanvasStore } from '@/store/useCanvasStore';
import { ZoomIn } from 'lucide-react';

export function FrameControls() {
  const {
    framePadding,
    frameRadius,
    frameShadow,
    setFramePadding,
    setFrameRadius,
    setFrameShadow,
    selectedImageId,
    images,
    updateImage,
  } = useCanvasStore();

  const isDisabled = !selectedImageId;
  
  // Get current zoom level (scale) of selected image
  const selectedImage = images.find(img => img.id === selectedImageId);
  const currentZoom = selectedImage ? Math.round(selectedImage.scaleX * 100) : 100;
  
  const handleZoomChange = (value: number) => {
    if (!selectedImageId) return;
    const scale = value / 100;
    updateImage(selectedImageId, {
      scaleX: scale,
      scaleY: scale,
    });
  };

  return (
    <div className="space-y-3 md:space-y-4 p-3 md:p-4">
      <div>
        <h2 className="text-sm md:text-base font-semibold">Frame Styling</h2>
        <p className="text-[10px] md:text-xs text-muted-foreground">
          {isDisabled ? 'Select an image to adjust' : 'Adjust selected image'}
        </p>
      </div>

      <div className="space-y-3 md:space-y-4">
        <div className="neu-card space-y-2 p-2.5 md:p-3 rounded-xl">
          <div className="flex items-center justify-between">
            <Label className="text-[10px] md:text-xs font-medium flex items-center gap-1">
              <ZoomIn className="h-3 w-3" />
              Image Zoom
            </Label>
            <span className="neu-raised-sm text-[10px] md:text-xs font-semibold px-1.5 md:px-2 py-0.5 rounded-lg">{currentZoom}%</span>
          </div>
          <div className="neu-inset rounded-full p-1">
            <Slider
              value={[currentZoom]}
              onValueChange={(value) => handleZoomChange(value[0])}
              min={10}
              max={200}
              step={5}
              disabled={isDisabled}
              className="w-full"
            />
          </div>
          <p className="text-[9px] md:text-[10px] text-muted-foreground">
            Tip: Drag corner handles to resize
          </p>
        </div>

        <div className="neu-card space-y-2 p-2.5 md:p-3 rounded-xl">
          <div className="flex items-center justify-between">
            <Label className="text-[10px] md:text-xs font-medium">Padding</Label>
            <span className="neu-raised-sm text-[10px] md:text-xs font-semibold px-1.5 md:px-2 py-0.5 rounded-lg">{framePadding}px</span>
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

        <div className="neu-card space-y-2 p-2.5 md:p-3 rounded-xl">
          <div className="flex items-center justify-between">
            <Label className="text-[10px] md:text-xs font-medium">Corner Radius</Label>
            <span className="neu-raised-sm text-[10px] md:text-xs font-semibold px-1.5 md:px-2 py-0.5 rounded-lg">{frameRadius}px</span>
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

        <div className="neu-card space-y-2 p-2.5 md:p-3 rounded-xl">
          <div className="flex items-center justify-between">
            <Label className="text-[10px] md:text-xs font-medium">Shadow Intensity</Label>
            <span className="neu-raised-sm text-[10px] md:text-xs font-semibold px-1.5 md:px-2 py-0.5 rounded-lg">{frameShadow}%</span>
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
