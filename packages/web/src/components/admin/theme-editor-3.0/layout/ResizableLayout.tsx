'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface ResizableLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function ResizableLayout({ children, className }: ResizableLayoutProps) {
  const [leftWidth, setLeftWidth] = useState(40); // 40% initial width
  const [isResizing, setIsResizing] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true);
    e.preventDefault();
  };

  const handleMouseMove = React.useCallback((e: MouseEvent) => {
    if (!isResizing) return;

    const container = document.getElementById('theme-editor-container');
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
    
    // Constrain between 20% and 80%
    const constrainedWidth = Math.min(Math.max(newLeftWidth, 20), 80);
    setLeftWidth(constrainedWidth);
  }, [isResizing]);

  const handleMouseUp = React.useCallback(() => {
    setIsResizing(false);
  }, []);

  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  return (
    <div 
      id="theme-editor-container"
      className={cn("h-full flex", className)}
    >
      {/* Left Column */}
      <div 
        style={{ width: `${leftWidth}%` }}
        className="flex flex-col min-w-0"
      >
        {React.Children.toArray(children)[0]}
      </div>

      {/* Resizer */}
      <div
        className={cn(
          "w-px bg-border hover:bg-border cursor-col-resize transition-colors",
          isResizing && "bg-border"
        )}
        onMouseDown={handleMouseDown}
      />

      {/* Right Column */}
      <div 
        style={{ width: `${100 - leftWidth}%` }}
        className="flex flex-col min-w-0"
      >
        {React.Children.toArray(children)[1]}
      </div>
    </div>
  );
}