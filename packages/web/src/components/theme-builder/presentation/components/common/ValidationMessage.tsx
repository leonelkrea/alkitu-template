/**
 * Theme Builder - Validation Message Component
 * Reusable component for displaying validation errors and warnings
 * Part of Clean Architecture presentation layer
 */

'use client';

import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertCircle, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Validation message types
 */
export type ValidationMessageType = 'error' | 'warning' | 'success' | 'info';

/**
 * Validation item interface
 */
export interface ValidationItem {
  id?: string;
  type: ValidationMessageType;
  message: string;
  field?: string;
  details?: string;
  suggestion?: string;
}

/**
 * Validation message props
 */
export interface ValidationMessageProps {
  // Content
  items?: ValidationItem[];
  type?: ValidationMessageType;
  message?: string;
  title?: string;
  
  // Configuration
  variant?: 'default' | 'destructive' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  showCounts?: boolean;
  maxItems?: number;
  
  // Styling
  className?: string;
  
  // Actions
  onDismiss?: () => void;
  onItemClick?: (item: ValidationItem) => void;
  
  // Display options
  showIcons?: boolean;
  showFields?: boolean;
  groupByType?: boolean;
}

/**
 * Reusable validation message component
 */
export function ValidationMessage({
  items = [],
  type = 'error',
  message,
  title,
  variant = 'default',
  size = 'md',
  collapsible = false,
  defaultCollapsed = false,
  showCounts = true,
  maxItems,
  className,
  onDismiss,
  onItemClick,
  showIcons = true,
  showFields = true,
  groupByType = false
}: ValidationMessageProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);

  // If single message provided, convert to item
  const validationItems = React.useMemo(() => {
    if (message) {
      return [{ id: 'single', type, message }];
    }
    return items;
  }, [items, message, type]);

  // Group items by type if requested
  const groupedItems = React.useMemo(() => {
    if (!groupByType) {
      return { [type]: validationItems };
    }
    
    const groups: Record<string, ValidationItem[]> = {};
    
    validationItems.forEach(item => {
      if (!groups[item.type]) {
        groups[item.type] = [];
      }
      groups[item.type].push(item);
    });
    
    return groups;
  }, [validationItems, groupByType, type]);

  // Calculate counts
  const counts = React.useMemo(() => {
    const errorCount = validationItems.filter(item => item.type === 'error').length;
    const warningCount = validationItems.filter(item => item.type === 'warning').length;
    const successCount = validationItems.filter(item => item.type === 'success').length;
    const infoCount = validationItems.filter(item => item.type === 'info').length;
    
    return { errorCount, warningCount, successCount, infoCount, total: validationItems.length };
  }, [validationItems]);

  // Get icon for type
  const getIcon = (itemType: ValidationMessageType) => {
    switch (itemType) {
      case 'error':
        return <AlertCircle className="h-4 w-4" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      case 'success':
        return <CheckCircle className="h-4 w-4" />;
      case 'info':
        return <Info className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  // Get variant for type
  const getVariant = (itemType: ValidationMessageType) => {
    switch (itemType) {
      case 'error':
        return 'destructive';
      case 'warning':
        return 'default';
      case 'success':
        return 'default';
      case 'info':
        return 'default';
      default:
        return variant;
    }
  };

  // Size classes
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  // Don't render if no items
  if (validationItems.length === 0) {
    return null;
  }

  return (
    <div className={cn('space-y-2', className)}>
      {/* Summary header */}
      {(title || showCounts || collapsible) && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {title && (
              <h4 className={cn('font-medium', sizeClasses[size])}>
                {title}
              </h4>
            )}
            
            {showCounts && (
              <div className="flex items-center gap-1">
                {counts.errorCount > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {counts.errorCount} error{counts.errorCount !== 1 ? 's' : ''}
                  </Badge>
                )}
                {counts.warningCount > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {counts.warningCount} warning{counts.warningCount !== 1 ? 's' : ''}
                  </Badge>
                )}
                {counts.successCount > 0 && (
                  <Badge variant="outline" className="text-xs border-green-200 text-green-700">
                    {counts.successCount} success
                  </Badge>
                )}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            {collapsible && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="h-6 w-6 p-0"
              >
                {isCollapsed ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronUp className="h-3 w-3" />
                )}
              </Button>
            )}
            
            {onDismiss && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onDismiss}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Messages */}
      {(!collapsible || !isCollapsed) && (
        <div className="space-y-2">
          {Object.entries(groupedItems).map(([groupType, groupItems]) => {
            const displayItems = maxItems ? groupItems.slice(0, maxItems) : groupItems;
            const hasMore = maxItems && groupItems.length > maxItems;
            
            return (
              <div key={groupType} className="space-y-1">
                {displayItems.map((item, index) => (
                  <Alert
                    key={item.id || index}
                    variant={getVariant(item.type)}
                    className={cn(
                      'cursor-pointer transition-colors hover:bg-muted/50',
                      sizeClasses[size],
                      onItemClick && 'hover:bg-accent/10'
                    )}
                    onClick={() => onItemClick?.(item)}
                  >
                    <div className="flex items-start gap-2">
                      {showIcons && (
                        <div className="flex-shrink-0 mt-0.5">
                          {getIcon(item.type)}
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <AlertDescription className="flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              {/* Field name */}
                              {showFields && item.field && (
                                <Badge variant="outline" className="text-xs mb-1 mr-2">
                                  {item.field}
                                </Badge>
                              )}
                              
                              {/* Main message */}
                              <div className="font-medium">
                                {item.message}
                              </div>
                              
                              {/* Details */}
                              {item.details && (
                                <div className="text-sm text-muted-foreground mt-1">
                                  {item.details}
                                </div>
                              )}
                              
                              {/* Suggestion */}
                              {item.suggestion && (
                                <div className="text-sm text-blue-600 mt-1">
                                  💡 {item.suggestion}
                                </div>
                              )}
                            </div>
                          </div>
                        </AlertDescription>
                      </div>
                    </div>
                  </Alert>
                ))}
                
                {/* Show more indicator */}
                {hasMore && (
                  <div className="text-sm text-muted-foreground text-center py-2">
                    ... and {groupItems.length - maxItems} more {groupType}s
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/**
 * Specialized error message component
 */
export function ErrorMessage(props: Omit<ValidationMessageProps, 'type'>) {
  return <ValidationMessage {...props} type="error" />;
}

/**
 * Specialized warning message component
 */
export function WarningMessage(props: Omit<ValidationMessageProps, 'type'>) {
  return <ValidationMessage {...props} type="warning" />;
}

/**
 * Specialized success message component
 */
export function SuccessMessage(props: Omit<ValidationMessageProps, 'type'>) {
  return <ValidationMessage {...props} type="success" />;
}

/**
 * Specialized info message component
 */
export function InfoMessage(props: Omit<ValidationMessageProps, 'type'>) {
  return <ValidationMessage {...props} type="info" />;
}