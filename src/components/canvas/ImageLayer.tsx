import { useEffect, useRef, useState } from 'react';
import { Image as KonvaImage, Transformer, Group, Rect } from 'react-konva';
import type Konva from 'konva';
import { useCanvasStore } from '@/store/useCanvasStore';
import type { CanvasImage } from '@/types/canvas';

interface ImageLayerProps {
  image: CanvasImage;
}

export function ImageLayer({ image }: ImageLayerProps) {
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
    if (isSelected && transformerRef.current && imageRef.current) {
      transformerRef.current.nodes([imageRef.current]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  if (!htmlImage || !image.visible) return null;

  const shadowBlur = (image.shadow / 100) * 50;
  const shadowOpacity = (image.shadow / 100) * 0.5;

  return (
    <>
      <Group
        x={image.x}
        y={image.y}
        rotation={image.rotation}
        scaleX={image.scaleX}
        scaleY={image.scaleY}
        draggable
        onClick={() => selectImage(image.id)}
        onTap={() => selectImage(image.id)}
        onDragEnd={(e) => {
          updateImage(image.id, {
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={() => {
          if (!imageRef.current) return;
          const node = imageRef.current;
          
          updateImage(image.id, {
            x: node.x(),
            y: node.y(),
            scaleX: node.scaleX(),
            scaleY: node.scaleY(),
            rotation: node.rotation(),
          });
        }}
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
          boundBoxFunc={(oldBox, newBox) => {
            // Limit resize
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
