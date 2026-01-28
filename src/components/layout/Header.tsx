import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  onExport: (scale: 1 | 2) => void;
}

export function Header({ onExport }: HeaderProps) {
  return (
    <header className="neu-raised px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="neu-raised-sm flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/60">
            <span className="text-xl font-bold text-white">G</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold">Gradient Backgrounds</h1>
            <p className="text-xs text-muted-foreground">Create beautiful image backgrounds</p>
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onExport(1)}>
              Export 1x (Standard)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onExport(2)}>
              Export 2x (High Quality)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
