import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useCanvasStore } from '@/store/useCanvasStore';

const presetSizes = [
  { ratio: '1:1', width: 800, height: 800, label: 'Square' },
  { ratio: '4:5', width: 640, height: 800, label: 'Portrait' },
  { ratio: '16:9', width: 1280, height: 720, label: 'Landscape' },
  { ratio: '9:16', width: 450, height: 800, label: 'Story' },
];

export function SizeSelector() {
  const { canvasSize, setCanvasSize } = useCanvasStore();

  const handlePreset = (preset: typeof presetSizes[0]) => {
    setCanvasSize({
      width: preset.width,
      height: preset.height,
      ratio: preset.ratio,
    });
  };

  const handleCustomSize = (dimension: 'width' | 'height', value: number) => {
    if (value > 0 && value <= 4096) {
      setCanvasSize({
        ...canvasSize,
        [dimension]: value,
        ratio: 'custom',
      });
    }
  };

  return (
    <div className="space-y-3 p-4">
      <div>
        <h2 className="text-base font-semibold">Canvas Size</h2>
        <p className="text-xs text-muted-foreground">Choose dimensions</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {presetSizes.map((preset) => (
          <button
            key={preset.ratio}
            onClick={() => handlePreset(preset)}
            className={`flex flex-col items-start gap-0.5 h-auto py-3 px-3 rounded-xl transition-all ${
              canvasSize.ratio === preset.ratio ? 'neu-inset' : 'neu-button'
            }`}
          >
            <span className="text-sm font-semibold">{preset.ratio}</span>
            <span className="text-[10px] text-muted-foreground">
              {preset.label}
            </span>
          </button>
        ))}
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-medium">Custom Size</Label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Input
              type="number"
              value={canvasSize.width}
              onChange={(e) => handleCustomSize('width', parseInt(e.target.value) || 0)}
              placeholder="Width"
              className="neu-inset h-9 text-xs border-0"
            />
          </div>
          <div>
            <Input
              type="number"
              value={canvasSize.height}
              onChange={(e) => handleCustomSize('height', parseInt(e.target.value) || 0)}
              placeholder="Height"
              className="neu-inset h-9 text-xs border-0"
            />
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground">
          Current: {canvasSize.width} × {canvasSize.height}px
        </p>
      </div>
    </div>
  );
}
