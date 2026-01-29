import { Sparkles } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useCanvasStore } from '@/store/useCanvasStore';
import { texturePresets } from '@/data/textures';

export function TextureSelector() {
  const { texture, setTexture, setTextureOpacity } = useCanvasStore();

  const renderTexturePreview = (textureType: string) => {
    const patterns: Record<string, string> = {
      none: 'transparent',
      noise: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.03) 0px, transparent 1px, transparent 2px, rgba(0,0,0,0.03) 3px)',
      grain: 'radial-gradient(circle at 20% 50%, transparent 20%, rgba(0,0,0,0.05) 21%, rgba(0,0,0,0.05) 34%, transparent 35%), radial-gradient(circle at 80% 50%, transparent 20%, rgba(0,0,0,0.05) 21%, rgba(0,0,0,0.05) 34%, transparent 35%)',
      dots: 'radial-gradient(circle, rgba(0,0,0,0.15) 1px, transparent 1px)',
      lines: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 3px)',
      grid: 'repeating-linear-gradient(0deg, transparent, transparent 9px, rgba(0,0,0,0.08) 9px, rgba(0,0,0,0.08) 10px), repeating-linear-gradient(90deg, transparent, transparent 9px, rgba(0,0,0,0.08) 9px, rgba(0,0,0,0.08) 10px)',
      paper: 'repeating-linear-gradient(45deg, rgba(0,0,0,0.02) 0px, rgba(0,0,0,0.02) 1px, transparent 1px, transparent 3px), repeating-linear-gradient(-45deg, rgba(0,0,0,0.02) 0px, rgba(0,0,0,0.02) 1px, transparent 1px, transparent 3px)',
      canvas: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.04) 0px, transparent 1px, transparent 2px), repeating-linear-gradient(90deg, rgba(0,0,0,0.04) 0px, transparent 1px, transparent 2px)',
    };

    const backgroundSize: Record<string, string> = {
      noise: '3px 3px',
      grain: '100px 100px',
      dots: '15px 15px',
      lines: '3px 3px',
      grid: '10px 10px',
      paper: '4px 4px',
      canvas: '2px 2px',
    };

    return {
      background: patterns[textureType] || 'transparent',
      backgroundSize: backgroundSize[textureType] || 'auto',
    };
  };

  return (
    <div className="space-y-3 md:space-y-4 p-3 md:p-4">
      <div className="flex items-center gap-2">
        <div className="neu-raised-sm flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-lg">
          <Sparkles className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary" />
        </div>
        <h2 className="text-sm md:text-base font-semibold">Texture Overlay</h2>
      </div>

      {/* Texture Presets */}
      <div className="space-y-2">
        <Label className="text-[10px] md:text-xs">Texture Type</Label>
        <div className="grid grid-cols-2 gap-1.5 md:gap-2">
          {texturePresets.map((preset) => {
            const isSelected = texture.id === preset.id;
            const previewStyle = renderTexturePreview(preset.type);

            return (
              <button
                key={preset.id}
                onClick={() => setTexture(preset)}
                className={`group relative h-14 md:h-16 w-full rounded-xl transition-all p-1.5 ${
                  isSelected ? 'neu-inset scale-95' : 'neu-raised-sm hover:neu-raised'
                }`}
              >
                <div
                  className="h-full w-full rounded-lg overflow-hidden relative bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400"
                  style={{
                    backgroundImage: `${previewStyle.background}, linear-gradient(135deg, #a78bfa 0%, #f472b6 50%, #fb923c 100%)`,
                    backgroundSize: previewStyle.backgroundSize,
                  }}
                >
                  <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/5" />
                  <div className="absolute bottom-1 left-1 right-1">
                    <p 
                      className="truncate rounded-lg px-1.5 py-0.5 text-[10px] font-semibold text-foreground backdrop-blur-md"
                      style={{ 
                        background: 'color-mix(in srgb, var(--neu-surface) 85%, transparent)',
                        boxShadow: '0 1px 2px var(--neu-shadow-dark), inset 0 1px 0 var(--neu-shadow-light)'
                      }}
                    >
                      {preset.name}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Opacity Slider */}
      {texture.type !== 'none' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-[10px] md:text-xs">Opacity</Label>
            <span className="text-[10px] md:text-xs text-muted-foreground">
              {Math.round(texture.opacity * 100)}%
            </span>
          </div>
          <Slider
            value={[texture.opacity]}
            onValueChange={(value) => setTextureOpacity(value[0])}
            min={0}
            max={1}
            step={0.01}
            className="w-full"
          />
        </div>
      )}
    </div>
  );
}
