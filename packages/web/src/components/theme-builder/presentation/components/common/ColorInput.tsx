/**
 * Theme Builder - Color Input Component
 * Reusable color input component with validation and format support
 * Part of Clean Architecture presentation layer
 */

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Palette, Link, Unlink, AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useColorLinking } from '../../hooks/useColorLinking';
import { colorValidator } from '../../../infrastructure/validators/color.validator';
import type { ColorFormat } from '../../../shared/types/color.types';

/**
 * Color input component props
 */
export interface ColorInputProps {
  // Basic props
  label?: string;
  value: string;
  onChange: (value: string) => void;
  
  // Input configuration
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
  
  // Validation
  validate?: boolean;
  required?: boolean;
  
  // Color linking
  colorName?: string;
  availableColors?: string[];
  onLink?: (colorName: string, linkedTo: string) => void;
  onUnlink?: (colorName: string) => void;
  isLinked?: boolean;
  linkedTo?: string;
  
  // Format detection
  showFormat?: boolean;
  preferredFormat?: ColorFormat;
  
  // Visual options
  showColorPreview?: boolean;
  showColorPicker?: boolean;
  size?: 'sm' | 'md' | 'lg';
  
  // Events
  onFocus?: () => void;
  onBlur?: () => void;
  onValidationChange?: (isValid: boolean, errors: string[]) => void;
}

/**
 * Reusable color input component
 */
export function ColorInput({
  label,
  value,
  onChange,
  placeholder = 'Enter color value...',
  disabled = false,
  readOnly = false,
  className,
  validate = true,
  required = false,
  colorName,
  availableColors = [],
  onLink,
  onUnlink,
  isLinked = false,
  linkedTo,
  showFormat = true,
  preferredFormat,
  showColorPreview = true,
  showColorPicker = false,
  size = 'md',
  onFocus,
  onBlur,
  onValidationChange
}: ColorInputProps) {
  const [internalValue, setInternalValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const [showLinkOptions, setShowLinkOptions] = useState(false);

  // Validation
  const validation = useMemo(() => {
    if (!validate || !internalValue) {
      return { isValid: true, format: undefined, error: undefined };
    }
    
    const result = colorValidator.validateColor(internalValue);
    return {
      isValid: result.isValid,
      format: result.format,
      error: result.error
    };
  }, [internalValue, validate]);

  // Notify parent of validation changes
  React.useEffect(() => {
    if (onValidationChange) {
      onValidationChange(validation.isValid, validation.error ? [validation.error] : []);
    }
  }, [validation.isValid, validation.error, onValidationChange]);

  // Handle value changes
  const handleChange = useCallback((newValue: string) => {
    setInternalValue(newValue);
    
    // Only call onChange if validation passes or validation is disabled
    if (!validate || colorValidator.validateColor(newValue).isValid) {
      onChange(newValue);
    }
  }, [onChange, validate]);

  // Handle focus
  const handleFocus = useCallback(() => {
    setIsFocused(true);
    onFocus?.();
  }, [onFocus]);

  // Handle blur
  const handleBlur = useCallback(() => {
    setIsFocused(false);
    
    // Update parent with current value on blur
    if (internalValue !== value) {
      onChange(internalValue);
    }
    
    onBlur?.();
  }, [internalValue, value, onChange, onBlur]);

  // Handle color linking
  const handleLink = useCallback((targetColor: string) => {
    if (colorName && onLink) {
      onLink(colorName, targetColor);
      setShowLinkOptions(false);
    }
  }, [colorName, onLink]);

  // Handle color unlinking
  const handleUnlink = useCallback(() => {
    if (colorName && onUnlink) {
      onUnlink(colorName);
    }
  }, [colorName, onUnlink]);

  // Get input size classes
  const sizeClasses = {
    sm: 'h-8 text-sm',
    md: 'h-10',
    lg: 'h-12 text-lg'
  };

  // Color preview style
  const colorPreviewStyle = useMemo(() => {
    if (!showColorPreview || !value || !validation.isValid) {
      return undefined;
    }
    
    return {
      backgroundColor: value.startsWith('hsl') ? value : 
                     value.startsWith('rgb') ? value :
                     value.startsWith('#') ? value :
                     `hsl(${value})`
    };
  }, [showColorPreview, value, validation.isValid]);

  return (
    <div className={cn('space-y-2', className)}>
      {/* Label and linking controls */}
      {(label || colorName) && (
        <div className="flex items-center justify-between">
          {label && (
            <Label className={cn(
              'text-sm font-medium',
              required && 'after:content-["*"] after:text-destructive after:ml-1',
              disabled && 'text-muted-foreground'
            )}>
              {label}
            </Label>
          )}
          
          {/* Color linking controls */}
          {colorName && availableColors.length > 0 && (
            <div className="flex items-center gap-1">
              {isLinked && linkedTo && (
                <Badge variant="secondary" className="text-xs">
                  <Link className="w-3 h-3 mr-1" />
                  {linkedTo}
                </Badge>
              )}
              
              <Popover open={showLinkOptions} onOpenChange={setShowLinkOptions}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    disabled={disabled}
                  >
                    {isLinked ? (
                      <Unlink className="w-3 h-3" />
                    ) : (
                      <Link className="w-3 h-3" />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2" align="end">
                  <div className="space-y-1">
                    <div className="text-xs font-medium mb-2">Link to color:</div>
                    {availableColors
                      .filter(color => color !== colorName)
                      .map(color => (
                        <Button
                          key={color}
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start text-xs"
                          onClick={() => handleLink(color)}
                        >
                          {color}
                        </Button>
                      ))
                    }
                    {isLinked && (
                      <>
                        <div className="border-t my-1" />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start text-xs text-destructive"
                          onClick={handleUnlink}
                        >
                          <Unlink className="w-3 h-3 mr-1" />
                          Unlink
                        </Button>
                      </>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>
      )}

      {/* Input with color preview */}
      <div className="relative">
        <Input
          value={internalValue}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          className={cn(
            sizeClasses[size],
            showColorPreview && 'pl-12',
            validation.error && !isFocused && 'border-destructive',
            validation.isValid && internalValue && !isFocused && 'border-success',
            isLinked && 'bg-muted/30'
          )}
        />
        
        {/* Color preview */}
        {showColorPreview && (
          <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
            <div
              className={cn(
                'w-6 h-6 rounded border border-border',
                !validation.isValid && 'bg-muted'
              )}
              style={colorPreviewStyle}
            />
          </div>
        )}
        
        {/* Validation icon */}
        {validate && internalValue && !isFocused && (
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
            {validation.isValid ? (
              <CheckCircle className="w-4 h-4 text-success" />
            ) : (
              <AlertCircle className="w-4 h-4 text-destructive" />
            )}
          </div>
        )}
      </div>

      {/* Format and validation info */}
      <div className="flex items-center justify-between text-xs">
        {/* Format badge */}
        {showFormat && validation.format && validation.isValid && (
          <Badge variant="outline" className="text-xs">
            {validation.format.toUpperCase()}
          </Badge>
        )}
        
        {/* Error message */}
        {validation.error && !isFocused && (
          <span className="text-destructive">{validation.error}</span>
        )}
        
        {/* Required indicator */}
        {required && !internalValue && (
          <span className="text-muted-foreground">Required</span>
        )}
      </div>
    </div>
  );
}