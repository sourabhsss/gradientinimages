import { Eye, EyeOff, Trash2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCanvasStore } from '@/store/useCanvasStore';

export function LayersList() {
  const { images, selectedImageId, selectImage, updateImage, deleteImage } = useCanvasStore();

  if (images.length === 0) {
    return (
      <div className="p-4">
        <div>
          <h2 className="text-sm font-semibold">Layers</h2>
          <p className="text-xs text-muted-foreground">No images added yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-3">
        <h2 className="text-base font-semibold">Layers</h2>
        <p className="text-xs text-muted-foreground">{images.length} image(s)</p>
      </div>

      <ScrollArea className="h-40 scrollbar-hidden">
        <div className="space-y-2">
          {[...images].reverse().map((image, index) => {
            const isSelected = selectedImageId === image.id;
            const displayIndex = images.length - index;

            return (
              <button
                key={image.id}
                onClick={() => selectImage(image.id)}
                className={`group flex w-full items-center gap-2 rounded-xl p-2 transition-all ${
                  isSelected ? 'neu-inset scale-98' : 'neu-raised-sm hover:neu-raised'
                }`}
              >
                <div className="neu-inset h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg">
                  <img
                    src={image.src}
                    alt={`Layer ${displayIndex}`}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="flex-1 text-left">
                  <p className="text-xs font-medium">Layer {displayIndex}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {Math.round(image.width)} × {Math.round(image.height)}px
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateImage(image.id, { visible: !image.visible });
                    }}
                    className="neu-button h-8 w-8 p-0 rounded-lg flex items-center justify-center"
                  >
                    {image.visible ? (
                      <Eye className="h-3.5 w-3.5" />
                    ) : (
                      <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteImage(image.id);
                    }}
                    className="neu-button h-8 w-8 p-0 rounded-lg flex items-center justify-center hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
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
