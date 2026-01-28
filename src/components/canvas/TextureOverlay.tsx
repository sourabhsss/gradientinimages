import { useEffect, useRef } from 'react';
import { Image as KonvaImage } from 'react-konva';
import { useCanvasStore } from '@/store/useCanvasStore';

export function TextureOverlay() {
  const { canvasSize, texture } = useCanvasStore();
  const imageRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (texture.type === 'none') return;

    // Create a canvas to generate texture
    const canvas = document.createElement('canvas');
    const size = 200; // Texture tile size
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Generate texture based on type
    switch (texture.type) {
      case 'noise':
        generateNoise(ctx, size);
        break;
      case 'grain':
        generateGrain(ctx, size);
        break;
      case 'dots':
        generateDots(ctx, size);
        break;
      case 'lines':
        generateLines(ctx, size);
        break;
      case 'grid':
        generateGrid(ctx, size);
        break;
      case 'paper':
        generatePaper(ctx, size);
        break;
      case 'canvas':
        generateCanvas(ctx, size);
        break;
    }

    canvasRef.current = canvas;

    // Update Konva image
    if (imageRef.current) {
      imageRef.current.getLayer()?.batchDraw();
    }
  }, [texture.type]);

  if (texture.type === 'none' || texture.opacity === 0 || !canvasRef.current) return null;

  return (
    <KonvaImage
      ref={imageRef}
      x={0}
      y={0}
      width={canvasSize.width}
      height={canvasSize.height}
      image={canvasRef.current}
      opacity={texture.opacity}
      listening={false}
      fillPatternRepeat="repeat"
    />
  );
}

// Texture generation functions
function generateNoise(ctx: CanvasRenderingContext2D, size: number) {
  const imageData = ctx.createImageData(size, size);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const value = Math.random() * 255;
    data[i] = value;     // R
    data[i + 1] = value; // G
    data[i + 2] = value; // B
    data[i + 3] = 50;    // A
  }

  ctx.putImageData(imageData, 0, 0);
}

function generateGrain(ctx: CanvasRenderingContext2D, size: number) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  
  for (let i = 0; i < 1000; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const radius = Math.random() * 1.5;
    
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

function generateDots(ctx: CanvasRenderingContext2D, size: number) {
  const spacing = 15;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';

  for (let x = 0; x < size; x += spacing) {
    for (let y = 0; y < size; y += spacing) {
      ctx.beginPath();
      ctx.arc(x + spacing / 2, y + spacing / 2, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function generateLines(ctx: CanvasRenderingContext2D, size: number) {
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.lineWidth = 1;

  for (let x = 0; x < size; x += 3) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, size);
    ctx.stroke();
  }
}

function generateGrid(ctx: CanvasRenderingContext2D, size: number) {
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
  ctx.lineWidth = 1;
  const spacing = 10;

  // Vertical lines
  for (let x = 0; x < size; x += spacing) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, size);
    ctx.stroke();
  }

  // Horizontal lines
  for (let y = 0; y < size; y += spacing) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(size, y);
    ctx.stroke();
  }
}

function generatePaper(ctx: CanvasRenderingContext2D, size: number) {
  // Base paper texture
  ctx.fillStyle = 'rgba(0, 0, 0, 0.02)';
  
  // Random fibers
  for (let i = 0; i < 500; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const length = Math.random() * 3 + 1;
    const angle = Math.random() * Math.PI * 2;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
    ctx.strokeStyle = `rgba(0, 0, 0, ${Math.random() * 0.05})`;
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }
}

function generateCanvas(ctx: CanvasRenderingContext2D, size: number) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
  
  // Vertical threads
  for (let x = 0; x < size; x += 2) {
    ctx.fillRect(x, 0, 1, size);
  }
  
  // Horizontal threads
  for (let y = 0; y < size; y += 2) {
    ctx.fillRect(0, y, size, 1);
  }
}
