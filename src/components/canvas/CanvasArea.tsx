import { useRef, useEffect, useCallback, useState } from 'react';
import { Stage, Layer } from 'react-konva';
import { useDropzone } from 'react-dropzone';
import { Upload, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import type Konva from 'konva';
import { GradientBackground } from './GradientBackground';
import { TextureOverlay } from './TextureOverlay';
import { ImageLayer } from './ImageLayer';
import { Rulers } from './Rulers';
import { AlignmentGuides } from './AlignmentGuides';
import { useCanvasStore } from '@/store/useCanvasStore';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ShootingStars } from '@/components/ui/shooting-stars';
import { StarsBackground } from '@/components/ui/stars-background';

interface CanvasAreaProps {
  stageRef: React.RefObject<Konva.Stage | null>;
}

export function CanvasArea({ stageRef }: CanvasAreaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { canvasSize, images, addImage, selectImage, selectedImageId } = useCanvasStore();
  
  // Track alignment guide visibility
  const [showVerticalGuide, setShowVerticalGuide] = useState(false);
  const [showHorizontalGuide, setShowHorizontalGuide] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  // Function to check if an image is centered
  const checkAlignment = useCallback((imageId: string, x?: number, y?: number) => {
    const image = images.find(img => img.id === imageId);
    if (!image) return;

    const threshold = 3; // Pixel threshold for "centered"
    
    // Use provided x/y (during drag) or current position (static)
    const posX = x !== undefined ? x : image.x;
    const posY = y !== undefined ? y : image.y;
    
    // Calculate image center position
    const imageWidth = image.width * image.scaleX;
    const imageHeight = image.height * image.scaleY;
    const imageCenterX = posX + imageWidth / 2;
    const imageCenterY = posY + imageHeight / 2;
    
    // Canvas center
    const canvasCenterX = canvasSize.width / 2;
    const canvasCenterY = canvasSize.height / 2;
    
    // Check alignment
    const isHorizontallyCentered = Math.abs(imageCenterX - canvasCenterX) < threshold;
    const isVerticallyCentered = Math.abs(imageCenterY - canvasCenterY) < threshold;
    
    // Show vertical line when image is horizontally centered (horizontal centers coincide)
    // Show horizontal line when image is vertically centered (vertical centers coincide)
    setShowVerticalGuide(isHorizontallyCentered);
    setShowHorizontalGuide(isVerticallyCentered);
  }, [images, canvasSize]);
  
  // Handle drag move to show guides in real-time
  const handleImageDragMove = useCallback((imageId: string, x: number, y: number) => {
    setIsDragging(true);
    checkAlignment(imageId, x, y);
  }, [checkAlignment]);

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
  const [scale, setScale] = useState(0.55); // Start with reasonable scale
  const [isManualZoom, setIsManualZoom] = useState(false); // Track if user manually adjusted zoom

  // Zoom constraints
  const MIN_ZOOM = 0.1;
  const MAX_ZOOM = 2.0;
  const ZOOM_STEP = 0.1;

  const calculateFitScale = useCallback(() => {
    if (!containerRef.current) return 0.55;
    const container = containerRef.current;
    
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    if (containerWidth === 0 || containerHeight === 0) return 0.55;
    
    const targetWidthPercent = 0.72;
    const targetHeightPercent = 0.62;
    
    const maxAllowedWidth = containerWidth * targetWidthPercent;
    const maxAllowedHeight = containerHeight * targetHeightPercent;
    
    const scaleX = maxAllowedWidth / canvasSize.width;
    const scaleY = maxAllowedHeight / canvasSize.height;
    
    return Math.max(Math.min(scaleX, scaleY, 1.0), MIN_ZOOM);
  }, [canvasSize.width, canvasSize.height]);

  // Zoom handlers
  const handleZoomIn = useCallback(() => {
    setIsManualZoom(true);
    setScale(prev => Math.min(prev + ZOOM_STEP, MAX_ZOOM));
  }, []);

  const handleZoomOut = useCallback(() => {
    setIsManualZoom(true);
    setScale(prev => Math.max(prev - ZOOM_STEP, MIN_ZOOM));
  }, []);

  const handleFitToScreen = useCallback(() => {
    setIsManualZoom(false);
    const fitScale = calculateFitScale();
    setScale(fitScale);
  }, [calculateFitScale]);

  useEffect(() => {
    const updateScale = () => {
      const fitScale = calculateFitScale();
      
      // Only auto-update scale if not manually zoomed
      if (!isManualZoom) {
        setScale(fitScale);
      }
    };

    // Run immediately and also on resize
    updateScale();
    
    // Also run after a short delay to handle layout settling
    const timeoutId = setTimeout(updateScale, 100);
    
    window.addEventListener('resize', updateScale);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', updateScale);
    };
  }, [canvasSize.width, canvasSize.height, images.length, isManualZoom, calculateFitScale]);

  // Reset manual zoom when canvas size changes
  useEffect(() => {
    setIsManualZoom(false);
  }, [canvasSize.width, canvasSize.height]);

  // Check if selected image is centered (when not dragging)
  useEffect(() => {
    if (isDragging) return; // Don't override during drag
    
    if (!selectedImageId) {
      setShowVerticalGuide(false);
      setShowHorizontalGuide(false);
      return;
    }

    checkAlignment(selectedImageId);
  }, [selectedImageId, images, canvasSize, isDragging, checkAlignment]);
  
  // Reset dragging state when drag ends
  useEffect(() => {
    if (isDragging) {
      const timer = setTimeout(() => setIsDragging(false), 100);
      return () => clearTimeout(timer);
    }
  }, [images, isDragging]);

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
      className="relative h-full w-full overflow-hidden px-12 py-16"
    >
      <input {...getInputProps()} />

      {images.length === 0 ? (
        <div className="flex h-full items-center justify-center cursor-pointer">
          {/* Space background effect */}
          <StarsBackground 
            starDensity={0.0002} 
            allStarsTwinkle={true}
            twinkleProbability={0.8}
            minTwinkleSpeed={0.4}
            maxTwinkleSpeed={1.2}
          />
          <ShootingStars 
            minSpeed={15}
            maxSpeed={35}
            minDelay={2000}
            maxDelay={5000}
            starColor="#a78bfa"
            trailColor="#6366f1"
            starWidth={12}
            starHeight={1}
          />
          
          <div className="text-center group relative z-10">
            <div
              className={`mx-auto flex h-28 w-28 items-center justify-center rounded-full transition-all duration-150 ${
                isDragActive 
                  ? 'neu-inset-deep scale-95' 
                  : 'neu-raised-lg hover:scale-105 active:neu-inset-deep active:scale-95'
              }`}
            >
              <Upload className={`h-12 w-12 transition-colors ${isDragActive ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'}`} />
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

          {/* Zoom Controls */}
          <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2 rounded-xl neu-raised-sm p-1.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="neu-button flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50 disabled:pointer-events-none"
                  onClick={handleZoomOut}
                  disabled={scale <= MIN_ZOOM}
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">Zoom Out</TooltipContent>
            </Tooltip>
            
            <div className="neu-inset flex h-7 min-w-[3.5rem] items-center justify-center rounded-md px-2">
              <span className="text-xs font-medium text-muted-foreground">
                {Math.round(scale * 100)}%
              </span>
            </div>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="neu-button flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50 disabled:pointer-events-none"
                  onClick={handleZoomIn}
                  disabled={scale >= MAX_ZOOM}
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">Zoom In</TooltipContent>
            </Tooltip>
            
            <div className="mx-0.5 h-5 w-px bg-border/50" />
            
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="neu-button flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
                  onClick={handleFitToScreen}
                >
                  <Maximize2 className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">Fit to Screen</TooltipContent>
            </Tooltip>
          </div>
          
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
                    <ImageLayer 
                      key={image.id} 
                      image={image}
                      onDragMove={handleImageDragMove}
                    />
                  ))}
              </Layer>
              <Layer name="ui-guides" listening={false}>
                <AlignmentGuides 
                  showVertical={showVerticalGuide} 
                  showHorizontal={showHorizontalGuide} 
                />
                <Rulers />
              </Layer>
            </Stage>
          </div>
        </div>
      )}
    </div>
  );
}
