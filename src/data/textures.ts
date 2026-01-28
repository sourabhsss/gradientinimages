import type { TextureConfig } from '@/types/canvas';

export const texturePresets: TextureConfig[] = [
  {
    id: 'none',
    name: 'None',
    type: 'none',
    opacity: 0,
  },
  {
    id: 'noise-1',
    name: 'Fine Noise',
    type: 'noise',
    opacity: 0.15,
  },
  {
    id: 'grain-1',
    name: 'Film Grain',
    type: 'grain',
    opacity: 0.25,
  },
  {
    id: 'dots-1',
    name: 'Halftone Dots',
    type: 'dots',
    opacity: 0.2,
  },
  {
    id: 'lines-1',
    name: 'Vertical Lines',
    type: 'lines',
    opacity: 0.15,
  },
  {
    id: 'grid-1',
    name: 'Grid Pattern',
    type: 'grid',
    opacity: 0.1,
  },
  {
    id: 'paper-1',
    name: 'Paper Texture',
    type: 'paper',
    opacity: 0.3,
  },
  {
    id: 'canvas-1',
    name: 'Canvas',
    type: 'canvas',
    opacity: 0.2,
  },
];
