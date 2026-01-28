export interface GradientConfig {
  id: string;
  name: string;
  colors: string[];
  angle: number;
  type: 'linear' | 'radial';
  category: 'warm' | 'cool' | 'vibrant' | 'subtle' | 'dark' | 'special';
}

export interface TextureConfig {
  id: string;
  name: string;
  type: 'noise' | 'grain' | 'dots' | 'lines' | 'grid' | 'paper' | 'canvas' | 'none';
  opacity: number;
}

export interface CanvasImage {
  id: string;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  padding: number;
  radius: number;
  shadow: number;
  visible: boolean;
  zIndex: number;
}

export interface CanvasSize {
  width: number;
  height: number;
  ratio: string;
}

export type ExportScale = 1 | 2;
export type FitMode = 'fit' | 'fill';
