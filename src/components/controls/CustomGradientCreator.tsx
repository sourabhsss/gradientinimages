import { useState } from 'react';
import { Plus, Trash2, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useCanvasStore } from '@/store/useCanvasStore';
import type { GradientConfig } from '@/types/canvas';

export function CustomGradientCreator() {
  const { setGradient, toggleFavorite } = useCanvasStore();
  const [colors, setColors] = useState<string[]>(['#FF6B6B', '#4ECDC4']);
  const [angle, setAngle] = useState(135);
  const [gradientName, setGradientName] = useState('');

  const addColor = () => {
    if (colors.length < 4) {
      setColors([...colors, '#000000']);
    }
  };

  const removeColor = (index: number) => {
    if (colors.length > 2) {
      setColors(colors.filter((_, i) => i !== index));
    }
  };

  const updateColor = (index: number, color: string) => {
    const newColors = [...colors];
    newColors[index] = color;
    setColors(newColors);
  };

  const applyGradient = () => {
    const customGradient: GradientConfig = {
      id: `custom-${Date.now()}`,
      name: gradientName || 'Custom Gradient',
      colors,
      angle,
      type: 'linear',
      category: 'special',
    };
    setGradient(customGradient);
  };

  const saveToFavorites = () => {
    const customGradient: GradientConfig = {
      id: `custom-${Date.now()}`,
      name: gradientName || 'Custom Gradient',
      colors,
      angle,
      type: 'linear',
      category: 'special',
    };
    toggleFavorite(customGradient);
    setGradient(customGradient);
  };

  const gradientPreview = `linear-gradient(${angle}deg, ${colors.join(', ')})`;

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center gap-2">
        <Palette className="h-5 w-5 text-primary" />
        <h2 className="text-base font-semibold">Custom Gradient</h2>
      </div>

      {/* Gradient Preview */}
      <div className="neu-inset h-24 w-full rounded-xl p-2">
        <div
          className="h-full w-full rounded-lg"
          style={{ background: gradientPreview }}
        />
      </div>

      {/* Colors */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs">Colors</Label>
          <Button
            variant="ghost"
            size="sm"
            onClick={addColor}
            disabled={colors.length >= 4}
            className="h-6 px-2 text-xs"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>

        <div className="space-y-2">
          {colors.map((color, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="neu-inset h-10 w-14 rounded-xl p-1 flex items-center justify-center">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => updateColor(index, e.target.value)}
                  className="h-full w-full cursor-pointer rounded-lg border-0 bg-transparent"
                  style={{ background: color }}
                />
              </div>
              <Input
                type="text"
                value={color}
                onChange={(e) => updateColor(index, e.target.value)}
                className="neu-inset h-9 flex-1 text-xs border-0"
                placeholder="#000000"
              />
              {colors.length > 2 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeColor(index)}
                  className="neu-button h-9 w-9 p-0 hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Angle */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs">Angle</Label>
          <span className="text-xs text-muted-foreground">{angle}°</span>
        </div>
        <Slider
          value={[angle]}
          onValueChange={(value) => setAngle(value[0])}
          min={0}
          max={360}
          step={1}
          className="w-full"
        />
      </div>

      {/* Name */}
      <div className="space-y-2">
        <Label className="text-xs">Gradient Name (Optional)</Label>
        <Input
          type="text"
          value={gradientName}
          onChange={(e) => setGradientName(e.target.value)}
          placeholder="My Custom Gradient"
          className="h-8 text-xs"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button onClick={applyGradient} className="neu-button flex-1 py-2 rounded-xl text-sm font-medium bg-primary text-white">
          Apply
        </button>
        <button onClick={saveToFavorites} className="neu-button flex-1 py-2 rounded-xl text-sm font-medium">
          Save to Favorites
        </button>
      </div>
    </div>
  );
}
