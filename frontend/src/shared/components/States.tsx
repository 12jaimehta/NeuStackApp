import { ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

export function LoadingSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-border overflow-hidden shadow-neu-xs">
          <div className="shimmer h-48" />
          <div className="p-4 space-y-2.5">
            <div className="shimmer h-3.5 rounded-full w-3/4" />
            <div className="shimmer h-3 rounded-full w-full" />
            <div className="shimmer h-3 rounded-full w-1/2" />
            <div className="shimmer h-6 rounded-full w-1/3 mt-1" />
            <div className="shimmer h-9 rounded-xl w-full mt-3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className="flex items-center justify-center py-20">
      <svg className={`animate-spin text-primary ${sizes[size]}`} viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
      </svg>
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="bg-white rounded-2xl border border-border shadow-neu-sm text-center py-14 flex flex-col items-center px-6">
      <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mb-4">
        <AlertTriangle className="text-destructive w-6 h-6" />
      </div>
      <p className="font-bold text-foreground tracking-tight mb-1">{message}</p>
      <p className="text-muted-foreground text-sm">Please check if the backend is running on port 3001.</p>
    </div>
  );
}

export function EmptyState({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white rounded-2xl border border-border shadow-neu-sm text-center py-16 flex flex-col items-center px-6">
      <div className="w-16 h-16 rounded-2xl bg-primary/7 border border-primary/10 flex items-center justify-center text-primary mb-5">
        {icon}
      </div>
      <h3 className="text-lg font-bold tracking-tight text-foreground mb-1.5">{title}</h3>
      <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">{description}</p>
    </div>
  );
}
