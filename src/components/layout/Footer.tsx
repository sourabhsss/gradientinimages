import { Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <div className="p-4">
      <div className="neu-inset flex items-center justify-center gap-2 rounded-xl py-3">
        <Sparkles className="h-3.5 w-3.5 text-primary" />
        <span className="text-xs font-medium text-muted-foreground">
          Built with{' '}
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
    </div>
  );
}
