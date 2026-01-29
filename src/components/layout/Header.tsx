import { Download, Moon, Sun, RotateCcw, Github } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useThemeStore } from '@/store/useThemeStore';
import { useCanvasStore } from '@/store/useCanvasStore';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface HeaderProps {
  onExport: (scale: 1 | 2) => void;
}

export function Header({ onExport }: HeaderProps) {
  const { isDark, toggleTheme } = useThemeStore();
  const resetCanvas = useCanvasStore((state) => state.resetCanvas);

  return (
    <header className="neu-raised px-3 py-2 md:px-6 md:py-4">
      <div className="flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center gap-2 md:gap-3">
          <div className="neu-raised-sm flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-lg md:rounded-xl bg-gradient-to-br from-primary to-primary/60">
            <span className="text-base md:text-xl font-bold text-white">G</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-sm md:text-lg font-semibold leading-tight">Add Gradient Background To Images</h1>
            <p className="text-[10px] md:text-xs text-muted-foreground">100% local • Your images never leave your device</p>
          </div>
          {/* Mobile Title - Short version */}
          <div className="sm:hidden">
            <h1 className="text-sm font-semibold">Gradient BG</h1>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-1.5 md:gap-3">
          {/* Built with Kombai */}
          <div className="neu-raised-sm flex items-center gap-2 rounded-lg md:rounded-xl px-2 md:px-4 py-1.5 md:py-2">
            <span className="text-[10px] md:text-xs font-medium text-muted-foreground">
              <span className="hidden xs:inline">Built with </span>❤️{' '}
              <a
                href="https://kombai.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary transition-colors hover:text-primary/80"
              >
                Kombai
              </a>
            </span>
          </div>

          {/* GitHub - hidden on smallest screens */}
          <Tooltip>
            <TooltipTrigger asChild>
              <a
                href="https://github.com/sourabhsss/gradientinimages"
                target="_blank"
                rel="noopener noreferrer"
                className="neu-button hidden xs:flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-lg md:rounded-xl text-muted-foreground transition-colors hover:text-foreground"
              >
                <Github className="h-4 w-4 md:h-5 md:w-5" />
              </a>
            </TooltipTrigger>
            <TooltipContent side="bottom">View on GitHub</TooltipContent>
          </Tooltip>

          {/* Reset Canvas */}
          <AlertDialog>
            <Tooltip>
              <TooltipTrigger asChild>
                <AlertDialogTrigger asChild>
                  <button
                    className="neu-button flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-lg md:rounded-xl text-muted-foreground transition-colors hover:text-destructive"
                  >
                    <RotateCcw className="h-4 w-4 md:h-5 md:w-5" />
                  </button>
                </AlertDialogTrigger>
              </TooltipTrigger>
              <TooltipContent side="bottom">Reset Canvas</TooltipContent>
            </Tooltip>
            <AlertDialogContent className="neu-raised rounded-2xl border-0 mx-4 max-w-[calc(100vw-2rem)] sm:max-w-lg">
              <AlertDialogHeader>
                <AlertDialogTitle>Reset Canvas?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will reset everything to the initial state. All your images, gradient settings, and customizations will be removed. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                <AlertDialogCancel className="neu-button rounded-xl border-0">Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={resetCanvas}
                  className="neu-button rounded-xl border-0 bg-destructive text-white hover:bg-destructive/90"
                >
                  Reset Everything
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Theme Toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={toggleTheme}
                className="neu-button flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-lg md:rounded-xl text-muted-foreground transition-colors hover:text-foreground"
              >
                {isDark ? <Sun className="h-4 w-4 md:h-5 md:w-5" /> : <Moon className="h-4 w-4 md:h-5 md:w-5" />}
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              {isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            </TooltipContent>
          </Tooltip>

          {/* Export Button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="neu-button flex items-center gap-1 md:gap-2 rounded-lg md:rounded-xl px-3 md:px-5 py-1.5 md:py-2.5 text-xs md:text-sm font-medium text-primary transition-colors hover:text-primary/80">
                <Download className="h-3.5 w-3.5 md:h-4 md:w-4" />
                <span className="hidden xs:inline">Export</span>
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
