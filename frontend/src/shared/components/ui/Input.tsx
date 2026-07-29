import * as React from 'react';
import { cn } from '../../utils/helpers';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-muted-foreground">
            {label}
          </label>
        )}
        <input
          id={inputId}
          className={cn(
            'flex h-10 w-full rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'transition-all duration-200',
            error && 'border-destructive focus-visible:ring-destructive',
            className,
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    );
  },
);
Input.displayName = 'Input';

export { Input };
