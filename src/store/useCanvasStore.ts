import { create } from 'zustand';
import type { CanvasImage, CanvasSize, GradientConfig, TextureConfig, ExportScale } from '@/types/canvas';

interface CanvasState {
  // Canvas configuration
  canvasSize: CanvasSize;
  scale: ExportScale;
  
  // Background gradient
  gradient: GradientConfig;
  
  // Texture overlay
  texture: TextureConfig;
  
  // Images on canvas
  images: CanvasImage[];
  selectedImageId: string | null;
  
  // Frame settings (for selected image)
  framePadding: number;
  frameRadius: number;
  frameShadow: number;
  
  // Favorites
  favoriteGradients: GradientConfig[];
  
  // Actions
  setCanvasSize: (size: CanvasSize) => void;
  setGradient: (gradient: GradientConfig) => void;
  setTexture: (texture: TextureConfig) => void;
  setTextureOpacity: (opacity: number) => void;
  addImage: (image: Omit<CanvasImage, 'id' | 'zIndex'>) => void;
  updateImage: (id: string, updates: Partial<CanvasImage>) => void;
  deleteImage: (id: string) => void;
  selectImage: (id: string | null) => void;
  reorderLayers: (fromIndex: number, toIndex: number) => void;
  setFramePadding: (padding: number) => void;
  setFrameRadius: (radius: number) => void;
  setFrameShadow: (shadow: number) => void;
  toggleFavorite: (gradient: GradientConfig) => void;
  loadFavorites: () => void;
}

const DEFAULT_GRADIENT: GradientConfig = {
  id: 'vibrant-1',
  name: 'Neon Pink',
  colors: ['#F857A6', '#FF5858'],
  angle: 135,
  type: 'linear',
  category: 'vibrant',
};

const DEFAULT_TEXTURE: TextureConfig = {
  id: 'none',
  name: 'None',
  type: 'none',
  opacity: 0.3,
};

export const useCanvasStore = create<CanvasState>((set, get) => ({
  // Initial state
  canvasSize: { width: 1080, height: 1080, ratio: '1:1' },
  scale: 1,
  gradient: DEFAULT_GRADIENT,
  texture: DEFAULT_TEXTURE,
  images: [],
  selectedImageId: null,
  framePadding: 40,
  frameRadius: 12,
  frameShadow: 30,
  favoriteGradients: [],

  // Actions
  setCanvasSize: (size) => {
    const currentSize = get().canvasSize;
    const images = get().images;
    
    // Calculate center points
    const oldCenterX = currentSize.width / 2;
    const oldCenterY = currentSize.height / 2;
    const newCenterX = size.width / 2;
    const newCenterY = size.height / 2;
    
    // Calculate scale factors
    const scaleX = size.width / currentSize.width;
    const scaleY = size.height / currentSize.height;
    
    // Reposition all images relative to center to maintain visual position
    const updatedImages = images.map((img) => {
      // Calculate distance from old center
      const offsetX = img.x + (img.width / 2) - oldCenterX;
      const offsetY = img.y + (img.height / 2) - oldCenterY;
      
      // Scale the offset
      const newOffsetX = offsetX * scaleX;
      const newOffsetY = offsetY * scaleY;
      
      // Calculate new position from new center
      const newX = newCenterX + newOffsetX - (img.width / 2);
      const newY = newCenterY + newOffsetY - (img.height / 2);
      
      return {
        ...img,
        x: newX,
        y: newY,
      };
    });
    
    set({ canvasSize: size, images: updatedImages });
  },

  setGradient: (gradient) => set({ gradient }),

  setTexture: (texture) => set({ texture }),

  setTextureOpacity: (opacity) => {
    set((state) => ({
      texture: { ...state.texture, opacity },
    }));
  },

  addImage: (image) => {
    const images = get().images;
    const newImage: CanvasImage = {
      ...image,
      id: `img-${Date.now()}-${Math.random()}`,
      zIndex: images.length,
    };
    set({ images: [...images, newImage], selectedImageId: newImage.id });
  },

  updateImage: (id, updates) => {
    set((state) => ({
      images: state.images.map((img) =>
        img.id === id ? { ...img, ...updates } : img
      ),
    }));
  },

  deleteImage: (id) => {
    set((state) => {
      const newImages = state.images.filter((img) => img.id !== id);
      return {
        images: newImages,
        selectedImageId: state.selectedImageId === id ? null : state.selectedImageId,
      };
    });
  },

  selectImage: (id) => set({ selectedImageId: id }),

  reorderLayers: (fromIndex, toIndex) => {
    set((state) => {
      const newImages = [...state.images];
      const [removed] = newImages.splice(fromIndex, 1);
      newImages.splice(toIndex, 0, removed);
      // Update zIndex based on new order
      return {
        images: newImages.map((img, idx) => ({ ...img, zIndex: idx })),
      };
    });
  },

  setFramePadding: (padding) => {
    set({ framePadding: padding });
    const selectedId = get().selectedImageId;
    if (selectedId) {
      get().updateImage(selectedId, { padding });
    }
  },

  setFrameRadius: (radius) => {
    set({ frameRadius: radius });
    const selectedId = get().selectedImageId;
    if (selectedId) {
      get().updateImage(selectedId, { radius });
    }
  },

  setFrameShadow: (shadow) => {
    set({ frameShadow: shadow });
    const selectedId = get().selectedImageId;
    if (selectedId) {
      get().updateImage(selectedId, { shadow });
    }
  },

  toggleFavorite: (gradient) => {
    set((state) => {
      const isFavorite = state.favoriteGradients.some((g) => g.id === gradient.id);
      const newFavorites = isFavorite
        ? state.favoriteGradients.filter((g) => g.id !== gradient.id)
        : [...state.favoriteGradients, gradient];
      
      // Save to localStorage
      localStorage.setItem('gradient-favorites', JSON.stringify(newFavorites));
      
      return { favoriteGradients: newFavorites };
    });
  },

  loadFavorites: () => {
    try {
      const stored = localStorage.getItem('gradient-favorites');
      if (stored) {
        set({ favoriteGradients: JSON.parse(stored) });
      }
    } catch (error) {
      console.error('Failed to load favorites:', error);
    }
  },
}));
