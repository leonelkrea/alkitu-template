import React, { useState, useRef } from 'react';

export interface TooltipProps {
  content: string | React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  position = 'top',
  delay = 500,
  disabled = false,
  className = '',
  children,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const positionClasses = {
    'top': 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    'bottom': 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    'left': 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    'right': 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  }[position];

  const arrowClasses = {
    'top': 'top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-neutral-800',
    'bottom': 'bottom-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-neutral-800',
    'left': 'right-full top-1/2 transform -translate-y-1/2 border-t-4 border-b-4 border-l-4 border-t-transparent border-b-transparent border-l-neutral-800',
    'right': 'left-full top-1/2 transform -translate-y-1/2 border-t-4 border-b-4 border-r-4 border-t-transparent border-b-transparent border-r-neutral-800'
  }[position];

  const handleMouseEnter = () => {
    if (disabled) return;
    
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const tooltipClasses = [
    'absolute z-50 px-2 py-1 text-xs text-white bg-neutral-800 rounded shadow-lg whitespace-nowrap',
    'transition-opacity duration-200',
    isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none',
    positionClasses,
    className
  ].filter(Boolean).join(' ');

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
      
      {!disabled && (
        <div className={tooltipClasses} style={{ maxWidth: '320px' }}>
          {content}
          <div className={`absolute w-0 h-0 ${arrowClasses}`} />
        </div>
      )}
    </div>
  );
};

export default Tooltip;