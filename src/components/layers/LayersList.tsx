import { Eye, EyeOff, Trash2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCanvasStore } from '@/store/useCanvasStore';

export function LayersList() {
  const { images, selectedImageId, selectImage, updateImage, deleteImage } = useCanvasStore();

  if (images.length === 0) {
    return (
      <div className="p-3 md:p-4">
        <div>
          <h2 className="text-xs md:text-sm font-semibold">Layers</h2>
          <p className="text-[10px] md:text-xs text-muted-foreground">No images added yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 md:p-4">
      <div className="mb-2.5 md:mb-3">
        <h2 className="text-sm md:text-base font-semibold">Layers</h2>
        <p className="text-[10px] md:text-xs text-muted-foreground">{images.length} image(s)</p>
      </div>

      <ScrollArea className="h-32 md:h-40 scrollbar-hidden">
        <div className="space-y-1.5 md:space-y-2">
          {[...images].reverse().map((image, index) => {
            const isSelected = selectedImageId === image.id;
            const displayIndex = images.length - index;

            return (
              <button
                key={image.id}
                onClick={() => selectImage(image.id)}
                className={`group flex w-full items-center gap-2 rounded-xl p-1.5 md:p-2 transition-all ${
                  isSelected ? 'neu-inset scale-98' : 'neu-raised-sm hover:neu-raised'
                }`}
              >
                <div className="neu-inset h-9 w-9 md:h-10 md:w-10 flex-shrink-0 overflow-hidden rounded-lg">
                  <img
                    src={image.src}
                    alt={`Layer ${displayIndex}`}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="flex-1 text-left min-w-0">
                  <p className="text-[10px] md:text-xs font-medium">Layer {displayIndex}</p>
                  <p className="text-[9px] md:text-[10px] text-muted-foreground truncate">
                    {Math.round(image.width)} × {Math.round(image.height)}px
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateImage(image.id, { visible: !image.visible });
                    }}
                    className="neu-button h-7 w-7 md:h-8 md:w-8 p-0 rounded-lg flex items-center justify-center"
                  >
                    {image.visible ? (
                      <Eye className="h-3 w-3 md:h-3.5 md:w-3.5" />
                    ) : (
                      <EyeOff className="h-3 w-3 md:h-3.5 md:w-3.5 text-muted-foreground" />
                    )}
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteImage(image.id);
                    }}
                    className="neu-button h-7 w-7 md:h-8 md:w-8 p-0 rounded-lg flex items-center justify-center hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3 md:h-3.5 md:w-3.5" />
                  </button>
                </div>
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
