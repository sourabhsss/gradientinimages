import { useEffect, useRef } from 'react';
import type Konva from 'konva';
import { Header } from '@/components/layout/Header';
import { MainLayout } from '@/components/layout/MainLayout';
import { Sidebar } from '@/components/layout/Sidebar';
import { CanvasArea } from '@/components/canvas/CanvasArea';
import { useCanvasStore } from '@/store/useCanvasStore';
import { useThemeStore } from '@/store/useThemeStore';
import { exportCanvas, generateFilename } from '@/utils/export';
import { TooltipProvider } from '@/components/ui/tooltip';

export default function App() {
  const stageRef = useRef<Konva.Stage | null>(null);
  const loadFavorites = useCanvasStore((state) => state.loadFavorites);
  const isDark = useThemeStore((state) => state.isDark);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  // Apply dark class to document
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleExport = async (scale: 1 | 2) => {
    if (!stageRef.current) return;
    
    try {
      const filename = generateFilename(scale);
      await exportCanvas(stageRef.current, scale, filename);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <TooltipProvider>
      <div className="h-screen overflow-hidden bg-background">
        <Header onExport={handleExport} />
        <MainLayout
          sidebar={<Sidebar />}
          canvas={<CanvasArea stageRef={stageRef} />}
        />
      </div>
    </TooltipProvider>
  );
}
