/**
 * Theme Builder - Expandable Section Component
 * Reusable collapsible section component
 * Part of Clean Architecture presentation layer
 */

'use client';

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Expandable section props
 */
export interface ExpandableSectionProps {
  // Content
  title: string;
  children: React.ReactNode;
  
  // State
  expanded?: boolean;
  defaultExpanded?: boolean;
  
  // Styling
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  
  // Configuration
  disabled?: boolean;
  variant?: 'default' | 'bordered' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  
  // Events
  onToggle?: (expanded: boolean) => void;
  
  // Header customization
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  subtitle?: string;
}

/**
 * Reusable expandable section component
 */
export function ExpandableSection({
  title,
  children,
  expanded: controlledExpanded,
  defaultExpanded = false,
  className,
  headerClassName,
  contentClassName,
  disabled = false,
  variant = 'default',
  size = 'md',
  onToggle,
  icon,
  badge,
  actions,
  subtitle
}: ExpandableSectionProps) {
  // State management
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  const isControlled = controlledExpanded !== undefined;
  const isExpanded = isControlled ? controlledExpanded : internalExpanded;

  /**
   * Handles toggle action
   */
  const handleToggle = useCallback(() => {
    if (disabled) return;
    
    const newExpanded = !isExpanded;
    
    if (!isControlled) {
      setInternalExpanded(newExpanded);
    }
    
    onToggle?.(newExpanded);
  }, [disabled, isExpanded, isControlled, onToggle]);

  // Variant styles
  const variantStyles = {
    default: {
      container: 'bg-card border border-border rounded-lg',
      header: 'p-4 border-b border-border',
      content: 'p-4'
    },
    bordered: {
      container: 'border border-border rounded-md',
      header: 'p-3 bg-muted/30 border-b border-border',
      content: 'p-3'
    },
    minimal: {
      container: '',
      header: 'py-2',
      content: 'pt-3'
    }
  };

  // Size styles
  const sizeStyles = {
    sm: {
      header: 'text-sm',
      spacing: 'space-y-2'
    },
    md: {
      header: 'text-base',
      spacing: 'space-y-3'
    },
    lg: {
      header: 'text-lg',
      spacing: 'space-y-4'
    }
  };

  const currentVariant = variantStyles[variant];
  const currentSize = sizeStyles[size];

  return (
    <div className={cn(
      'transition-all duration-200',
      currentVariant.container,
      disabled && 'opacity-50',
      className
    )}>
      {/* Header */}
      <div className={cn(
        'flex items-center justify-between cursor-pointer',
        currentVariant.header,
        disabled && 'cursor-not-allowed',
        headerClassName
      )}>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Icon */}
          {icon && (
            <div className="flex-shrink-0 text-muted-foreground">
              {icon}
            </div>
          )}
          
          {/* Title and subtitle */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className={cn(
                'font-medium truncate',
                currentSize.header,
                disabled && 'text-muted-foreground'
              )}>
                {title}
              </h3>
              
              {/* Badge */}
              {badge && (
                <div className="flex-shrink-0">
                  {badge}
                </div>
              )}
            </div>
            
            {/* Subtitle */}
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-1 truncate">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Actions and toggle */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Custom actions */}
          {actions && (
            <div onClick={(e) => e.stopPropagation()}>
              {actions}
            </div>
          )}
          
          {/* Toggle button */}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={handleToggle}
            disabled={disabled}
            aria-expanded={isExpanded}
            aria-label={isExpanded ? `Collapse ${title}` : `Expand ${title}`}
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className={cn(
          'transition-all duration-200',
          currentVariant.content,
          currentSize.spacing,
          contentClassName
        )}>
          {children}
        </div>
      )}
    </div>
  );
}

/**
 * Expandable section with custom hook for state management
 */
export function useExpandableSection(defaultExpanded = false) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  
  const toggle = useCallback(() => {
    setExpanded(prev => !prev);
  }, []);
  
  const expand = useCallback(() => {
    setExpanded(true);
  }, []);
  
  const collapse = useCallback(() => {
    setExpanded(false);
  }, []);
  
  return {
    expanded,
    toggle,
    expand,
    collapse,
    setExpanded
  };
}