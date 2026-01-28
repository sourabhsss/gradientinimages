import { useState, useRef } from 'react';
import { Heart } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useCanvasStore } from '@/store/useCanvasStore';
import { gradientPresets } from '@/data/gradients';
import type { GradientConfig } from '@/types/canvas';

export function GradientPresets() {
  const { gradient, setGradient, favoriteGradients, toggleFavorite } = useCanvasStore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  
  const categories = [
    { id: 'warm', label: 'Warm' },
    { id: 'cool', label: 'Cool' },
    { id: 'vibrant', label: 'Vibrant' },
    { id: 'subtle', label: 'Subtle' },
    { id: 'dark', label: 'Dark' },
    { id: 'special', label: 'Special' },
  ] as const;

  const scrollToCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    const categoryElement = categoryRefs.current[categoryId];
    const viewport = scrollAreaRef.current?.querySelector('[data-slot="scroll-area-viewport"]');
    
    if (categoryElement && viewport) {
      const offsetTop = categoryElement.offsetTop - 8; // 8px offset for better visual alignment
      viewport.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  };

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
            <p 
              className="truncate rounded-lg px-1.5 py-0.5 text-[10px] font-semibold text-foreground backdrop-blur-md"
              style={{ 
                background: 'color-mix(in srgb, var(--neu-surface) 85%, transparent)',
                boxShadow: '0 1px 2px var(--neu-shadow-dark), inset 0 1px 0 var(--neu-shadow-light)'
              }}
            >
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

      {/* Category Selector */}
      <div className="mb-3 flex flex-wrap gap-1.5">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => scrollToCategory(category.id)}
            className={`neu-button px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all ${
              selectedCategory === category.id
                ? 'neu-inset scale-95 text-primary'
                : 'text-foreground hover:text-primary'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      <ScrollArea ref={scrollAreaRef} className="h-[calc(100vh-550px)] scrollbar-hidden">
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
            <div 
              key={category.id} 
              ref={(el) => { categoryRefs.current[category.id] = el; }}
              className="mb-4"
            >
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
