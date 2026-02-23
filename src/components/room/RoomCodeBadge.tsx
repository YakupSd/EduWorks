import React from 'react';
import { Copy } from 'lucide-react';
import { cn } from '../../utils/cn';

interface RoomCodeBadgeProps {
  code: string;
  className?: string;
  showCopy?: boolean;
}

export default function RoomCodeBadge({ code, className, showCopy = true }: RoomCodeBadgeProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className={cn(
      "inline-flex items-center gap-3 bg-background px-4 py-2 rounded-2xl border border-black/5 group",
      className
    )}>
      <span className="text-xs font-black text-text-dark/40 uppercase tracking-widest">ODA:</span>
      <span className="text-lg font-black text-primary tracking-widest">{code}</span>
      {showCopy && (
        <button 
          onClick={handleCopy}
          className="text-text-dark/20 hover:text-primary transition-colors"
        >
          <Copy size={14} />
        </button>
      )}
    </div>
  );
}
