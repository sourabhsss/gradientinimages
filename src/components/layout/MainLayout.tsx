import { useState } from 'react';
import type { ReactNode } from 'react';
import { Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

interface MainLayoutProps {
  sidebar: ReactNode;
  canvas: ReactNode;
}

export function MainLayout({ sidebar, canvas }: MainLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-[calc(100vh-64px)] md:h-[calc(100vh-80px)] overflow-hidden bg-background">
      {/* Mobile Sidebar Toggle */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetTrigger asChild>
          <button 
            className="fixed bottom-4 left-4 z-50 flex h-12 w-12 items-center justify-center rounded-full neu-raised-lg text-foreground md:hidden"
            aria-label="Toggle sidebar menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </SheetTrigger>
        <SheetContent 
          side="left" 
          className="w-[85vw] max-w-[320px] p-0 bg-background border-r-0"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Controls</SheetTitle>
          </SheetHeader>
          <div className="h-full overflow-y-auto scrollbar-hidden">
            {sidebar}
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-80 flex-shrink-0 overflow-y-auto scrollbar-hidden">
        {sidebar}
      </aside>

      {/* Canvas Area */}
      <main className="flex-1 overflow-hidden">
        {canvas}
      </main>
    </div>
  );
}
