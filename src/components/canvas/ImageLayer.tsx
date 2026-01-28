import { useEffect, useRef, useState } from 'react';
import { Image as KonvaImage, Transformer, Group, Rect } from 'react-konva';
import type Konva from 'konva';
import { useCanvasStore } from '@/store/useCanvasStore';
import type { CanvasImage } from '@/types/canvas';

interface ImageLayerProps {
  image: CanvasImage;
}

export function ImageLayer({ image }: ImageLayerProps) {
  const groupRef = useRef<Konva.Group>(null);
  const imageRef = useRef<Konva.Image>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const [htmlImage, setHtmlImage] = useState<HTMLImageElement | null>(null);
  
  const { selectedImageId, selectImage, updateImage } = useCanvasStore();
  const isSelected = selectedImageId === image.id;

  // Load image
  useEffect(() => {
    const img = new window.Image();
    img.src = image.src;
    img.onload = () => {
      setHtmlImage(img);
    };
  }, [image.src]);

  // Attach transformer when selected
  useEffect(() => {
    if (isSelected && transformerRef.current && groupRef.current) {
      transformerRef.current.nodes([groupRef.current]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  if (!htmlImage || !image.visible) return null;

  const shadowBlur = (image.shadow / 100) * 50;
  const shadowOpacity = (image.shadow / 100) * 0.5;

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    const group = e.target;
    const canvasStore = useCanvasStore.getState();
    const canvasSize = canvasStore.canvasSize;
    
    // Calculate bounds including padding
    const totalWidth = (image.width + image.padding * 2) * image.scaleX;
    const totalHeight = (image.height + image.padding * 2) * image.scaleY;
    
    // Constrain position to keep image within canvas
    let newX = group.x();
    let newY = group.y();
    
    // Left and top boundaries (accounting for padding offset)
    const minX = image.padding * image.scaleX;
    const minY = image.padding * image.scaleY;
    
    // Right and bottom boundaries
    const maxX = canvasSize.width - totalWidth + image.padding * image.scaleX;
    const maxY = canvasSize.height - totalHeight + image.padding * image.scaleY;
    
    newX = Math.max(minX, Math.min(maxX, newX));
    newY = Math.max(minY, Math.min(maxY, newY));
    
    group.position({ x: newX, y: newY });
    
    updateImage(image.id, {
      x: newX,
      y: newY,
    });
  };

  const handleTransformEnd = () => {
    if (!groupRef.current) return;
    const group = groupRef.current;
    const canvasStore = useCanvasStore.getState();
    const canvasSize = canvasStore.canvasSize;
    
    const newScaleX = group.scaleX();
    const newScaleY = group.scaleY();
    
    // Calculate bounds with new scale
    const totalWidth = (image.width + image.padding * 2) * newScaleX;
    const totalHeight = (image.height + image.padding * 2) * newScaleY;
    
    // Constrain position after transform
    let newX = group.x();
    let newY = group.y();
    
    const minX = image.padding * newScaleX;
    const minY = image.padding * newScaleY;
    const maxX = canvasSize.width - totalWidth + image.padding * newScaleX;
    const maxY = canvasSize.height - totalHeight + image.padding * newScaleY;
    
    newX = Math.max(minX, Math.min(maxX, newX));
    newY = Math.max(minY, Math.min(maxY, newY));
    
    group.position({ x: newX, y: newY });
    
    updateImage(image.id, {
      x: newX,
      y: newY,
      scaleX: newScaleX,
      scaleY: newScaleY,
      rotation: group.rotation(),
    });
  };

  return (
    <>
      <Group
        ref={groupRef}
        x={image.x}
        y={image.y}
        rotation={image.rotation}
        scaleX={image.scaleX}
        scaleY={image.scaleY}
        draggable
        onClick={() => selectImage(image.id)}
        onTap={() => selectImage(image.id)}
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
      >
        {/* Shadow layer */}
        {image.shadow > 0 && (
          <Rect
            x={-image.padding}
            y={-image.padding}
            width={image.width + image.padding * 2}
            height={image.height + image.padding * 2}
            cornerRadius={image.radius}
            shadowColor="black"
            shadowBlur={shadowBlur}
            shadowOpacity={shadowOpacity}
            shadowOffsetX={0}
            shadowOffsetY={shadowBlur / 4}
          />
        )}
        
        {/* Padding background */}
        {image.padding > 0 && (
          <Rect
            x={-image.padding}
            y={-image.padding}
            width={image.width + image.padding * 2}
            height={image.height + image.padding * 2}
            fill="white"
            cornerRadius={image.radius}
          />
        )}
        
        {/* Image */}
        <KonvaImage
          ref={imageRef}
          image={htmlImage}
          width={image.width}
          height={image.height}
          cornerRadius={image.radius}
        />
      </Group>

      {isSelected && (
        <Transformer
          ref={transformerRef}
          keepRatio={true}
          enabledAnchors={[
            'top-left',
            'top-right',
            'bottom-left',
            'bottom-right',
          ]}
          rotateEnabled={true}
          borderStroke="#3b82f6"
          borderStrokeWidth={2}
          anchorFill="#3b82f6"
          anchorStroke="#ffffff"
          anchorStrokeWidth={2}
          anchorSize={12}
          anchorCornerRadius={6}
          boundBoxFunc={(oldBox, newBox) => {
            // Minimum size constraint
            if (newBox.width < 50 || newBox.height < 50) {
              return oldBox;
            }
            
            return newBox;
          }}
        />
      )}
    </>
  );
}
