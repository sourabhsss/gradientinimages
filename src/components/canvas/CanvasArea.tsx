import { useRef, useEffect, useCallback, useState } from 'react';
import { Stage, Layer } from 'react-konva';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import type Konva from 'konva';
import { GradientBackground } from './GradientBackground';
import { TextureOverlay } from './TextureOverlay';
import { ImageLayer } from './ImageLayer';
import { useCanvasStore } from '@/store/useCanvasStore';

interface CanvasAreaProps {
  stageRef: React.RefObject<Konva.Stage | null>;
}

export function CanvasArea({ stageRef }: CanvasAreaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { canvasSize, images, addImage, selectImage } = useCanvasStore();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          const img = new window.Image();
          img.onload = () => {
            // Calculate size to fit on canvas
            const maxSize = Math.min(canvasSize.width, canvasSize.height) * 0.6;
            const scale = Math.min(maxSize / img.width, maxSize / img.height);
            const width = img.width * scale;
            const height = img.height * scale;

            addImage({
              src: reader.result as string,
              x: (canvasSize.width - width) / 2,
              y: (canvasSize.height - height) / 2,
              width,
              height,
              rotation: 0,
              scaleX: 1,
              scaleY: 1,
              padding: 40,
              radius: 12,
              shadow: 30,
              visible: true,
            });
          };
          img.src = reader.result as string;
        };
        reader.readAsDataURL(file);
      });
    },
    [canvasSize, addImage]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    },
    noClick: images.length > 0,
  });

  // Calculate scale to fit canvas in viewport - ensure it stays within visible screen
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;
      const container = containerRef.current;
      
      // Conservative padding to ensure canvas always fits in viewport without scrolling
      const horizontalPadding = 100; // 50px padding on each side
      const verticalPadding = 120; // Extra vertical padding for comfortable viewing
      
      const availableWidth = container.clientWidth - horizontalPadding;
      const availableHeight = container.clientHeight - verticalPadding;
      
      const scaleX = availableWidth / canvasSize.width;
      const scaleY = availableHeight / canvasSize.height;
      
      // Always scale down to fit, cap at 0.85 to ensure visibility
      const newScale = Math.min(scaleX, scaleY, 0.85);
      
      setScale(newScale);
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [canvasSize]);

  const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
    // Deselect when clicking on empty area
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      selectImage(null);
    }
  };

  return (
    <div
      ref={containerRef}
      {...getRootProps()}
      className="relative h-full w-full overflow-hidden"
    >
      <input {...getInputProps()} />

      {images.length === 0 ? (
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <div
              className={`mx-auto flex h-28 w-28 items-center justify-center rounded-full transition-all ${
                isDragActive ? 'neu-inset-deep scale-95' : 'neu-raised-lg'
              }`}
            >
              <Upload className={`h-12 w-12 transition-colors ${isDragActive ? 'text-primary' : 'text-muted-foreground'}`} />
            </div>
            <h3 className="mt-6 text-xl font-semibold">
              {isDragActive ? 'Drop images here' : 'Upload Images'}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Drag and drop images or click to browse
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Supports PNG, JPG, GIF, WebP
            </p>
          </div>
        </div>
      ) : (
        <div className="flex h-full items-center justify-center p-6">
          {isDragActive && (
            <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-primary/10 backdrop-blur-sm">
              <div className="neu-raised-lg rounded-2xl p-8">
                <Upload className="mx-auto h-12 w-12 text-primary" />
                <p className="mt-3 text-lg font-semibold">Drop to add images</p>
              </div>
            </div>
          )}
          
          <div
            className="neu-raised-lg rounded-2xl overflow-hidden"
            style={{
              width: canvasSize.width * scale,
              height: canvasSize.height * scale,
            }}
          >
            <Stage
              ref={stageRef}
              width={canvasSize.width}
              height={canvasSize.height}
              scaleX={scale}
              scaleY={scale}
              onClick={handleStageClick}
              onTap={handleStageClick}
            >
              <Layer>
                <GradientBackground />
                <TextureOverlay />
              </Layer>
              <Layer>
                {images
                  .sort((a, b) => a.zIndex - b.zIndex)
                  .map((image) => (
                    <ImageLayer key={image.id} image={image} />
                  ))}
              </Layer>
            </Stage>
          </div>
        </div>
      )}
    </div>
  );
}
