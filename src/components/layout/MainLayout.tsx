import type { ReactNode } from 'react';

interface MainLayoutProps {
  sidebar: ReactNode;
  canvas: ReactNode;
}

export function MainLayout({ sidebar, canvas }: MainLayoutProps) {
  return (
    <div className="flex h-[calc(100vh-73px)] overflow-hidden bg-background">
      <aside className="w-80 flex-shrink-0 overflow-y-auto scrollbar-hidden">
        {sidebar}
      </aside>
      <main className="flex-1 overflow-hidden">
        {canvas}
      </main>
    </div>
  );
}
