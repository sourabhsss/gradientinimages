import { Heart } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useCanvasStore } from '@/store/useCanvasStore';
import { gradientPresets } from '@/data/gradients';
import type { GradientConfig } from '@/types/canvas';

export function GradientPresets() {
  const { gradient, setGradient, favoriteGradients, toggleFavorite } = useCanvasStore();
  
  const categories = [
    { id: 'warm', label: 'Warm' },
    { id: 'cool', label: 'Cool' },
    { id: 'vibrant', label: 'Vibrant' },
    { id: 'subtle', label: 'Subtle' },
    { id: 'dark', label: 'Dark' },
    { id: 'special', label: 'Special' },
  ] as const;

  const renderGradientCard = (grad: GradientConfig) => {
    const isFavorite = favoriteGradients.some((g) => g.id === grad.id);
    const isSelected = gradient.id === grad.id;
    
    return (
      <button
        key={grad.id}
        onClick={() => setGradient(grad)}
        className={`group relative h-16 w-full rounded-xl transition-all p-1.5 ${
          isSelected ? 'neu-inset scale-95' : 'neu-raised-sm hover:neu-raised'
        }`}
      >
        <div
          className="h-full w-full rounded-lg overflow-hidden relative"
          style={{
            background: `linear-gradient(${grad.angle}deg, ${grad.colors.join(', ')})`,
          }}
        >
          <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/5" />
          <span
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(grad);
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.stopPropagation();
                toggleFavorite(grad);
              }
            }}
            className="absolute right-1 top-1 cursor-pointer rounded-full bg-white/20 p-1 opacity-0 backdrop-blur-sm transition-opacity hover:bg-white/30 group-hover:opacity-100"
          >
            <Heart
              className={`h-3 w-3 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`}
            />
          </span>
          <div className="absolute bottom-1 left-1 right-1">
            <p className="truncate rounded bg-black/30 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
              {grad.name}
            </p>
          </div>
        </div>
      </button>
    );
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="text-base font-semibold">Gradient Presets</h2>
        <p className="text-xs text-muted-foreground">Select a gradient background</p>
      </div>

      <ScrollArea className="h-[calc(100vh-500px)] scrollbar-hidden">
        <div className="px-4" style={{ background: 'var(--neu-surface)' }}>
          {favoriteGradients.length > 0 && (
            <>
              <div className="mb-3">
                <Badge variant="secondary" className="mb-2">
                  Favorites
                </Badge>
                <div className="grid grid-cols-2 gap-2">
                  {favoriteGradients.map(renderGradientCard)}
                </div>
              </div>
              <Separator className="my-4" />
            </>
          )}

          {categories.map((category) => (
            <div key={category.id} className="mb-4">
              <Badge variant="outline" className="mb-2">
                {category.label}
              </Badge>
              <div className="grid grid-cols-2 gap-2">
                {gradientPresets
                  .filter((g) => g.category === category.id)
                  .map(renderGradientCard)}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
