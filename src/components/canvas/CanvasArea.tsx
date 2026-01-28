import { useRef, useEffect, useCallback, useState } from 'react';
import { Stage, Layer } from 'react-konva';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import type Konva from 'konva';
import { GradientBackground } from './GradientBackground';
import { TextureOverlay } from './TextureOverlay';
import { ImageLayer } from './ImageLayer';
import { Rulers } from './Rulers';
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
            const padding = 0;
            
            // Calculate available space (leave some margin from edges)
            const margin = 40; // Minimum margin from canvas edges
            const availableWidth = canvasSize.width - (margin * 2);
            const availableHeight = canvasSize.height - (margin * 2);
            
            // Calculate scale to fit the image within 80% of available space
            // This ensures the image fits comfortably with room to spare
            const targetWidth = availableWidth * 0.8;
            const targetHeight = availableHeight * 0.8;
            
            const scaleToFitWidth = targetWidth / img.width;
            const scaleToFitHeight = targetHeight / img.height;
            const scale = Math.min(scaleToFitWidth, scaleToFitHeight, 1); // Don't scale up
            
            const width = img.width * scale;
            const height = img.height * scale;

            // Center the image perfectly in the canvas
            const x = (canvasSize.width - width) / 2;
            const y = (canvasSize.height - height) / 2;

            addImage({
              src: reader.result as string,
              x,
              y,
              width,
              height,
              rotation: 0,
              scaleX: 1,
              scaleY: 1,
              padding,
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
      
      // Account for the padding already applied to the container
      // px-8 = 32px on each side (64px total horizontal)
      // py-12 = 48px on each side (96px total vertical)
      const horizontalPadding = 64;
      const verticalPadding = 96;
      
      // Additional safety margin to ensure rulers and edges are always visible
      // Increase margins significantly for portrait orientations (height > width)
      const isPortrait = canvasSize.height > canvasSize.width;
      const aspectRatio = canvasSize.height / canvasSize.width;
      
      // More aggressive margins for very tall canvases (9:16 and similar)
      const isVeryTall = aspectRatio > 1.5;
      
      const horizontalMargin = 80; // More space for rulers
      const verticalMargin = isVeryTall ? 140 : (isPortrait ? 120 : 100);
      
      const availableWidth = container.clientWidth - horizontalPadding - horizontalMargin;
      const availableHeight = container.clientHeight - verticalPadding - verticalMargin;
      
      const scaleX = availableWidth / canvasSize.width;
      const scaleY = availableHeight / canvasSize.height;
      
      // Scale to fit comfortably with visible rulers
      // Even lower cap for very tall canvases
      const maxScale = isVeryTall ? 0.7 : (isPortrait ? 0.75 : 0.85);
      const newScale = Math.min(scaleX, scaleY, maxScale);
      
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
      className="relative h-full w-full overflow-hidden px-8 py-12"
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
        <div className="flex h-full items-center justify-center">
          {isDragActive && (
            <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-primary/10 backdrop-blur-sm">
              <div className="neu-raised-lg rounded-2xl p-8">
                <Upload className="mx-auto h-12 w-12 text-primary" />
                <p className="mt-3 text-lg font-semibold">Drop to add images</p>
              </div>
            </div>
          )}
          
          <div
            className="neu-raised-lg overflow-hidden"
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
              <Layer listening={false}>
                <Rulers />
              </Layer>
            </Stage>
          </div>
        </div>
      )}
    </div>
  );
}
