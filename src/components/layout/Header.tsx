import { Download, Moon, Sun } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useThemeStore } from '@/store/useThemeStore';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface HeaderProps {
  onExport: (scale: 1 | 2) => void;
}

export function Header({ onExport }: HeaderProps) {
  const { isDark, toggleTheme } = useThemeStore();

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
        
        <div className="flex items-center gap-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={toggleTheme}
                className="neu-button flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:text-foreground"
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              {isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            </TooltipContent>
          </Tooltip>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="neu-button flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-primary transition-colors hover:text-primary/80">
                <Download className="h-4 w-4" />
                Export
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="neu-raised-sm rounded-xl border-0 p-1">
              <DropdownMenuItem 
                onClick={() => onExport(1)}
                className="rounded-lg px-3 py-2 text-sm cursor-pointer hover:bg-primary/10 focus:bg-primary/10"
              >
                Export 1x (Standard)
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onExport(2)}
                className="rounded-lg px-3 py-2 text-sm cursor-pointer hover:bg-primary/10 focus:bg-primary/10"
              >
                Export 2x (High Quality)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
