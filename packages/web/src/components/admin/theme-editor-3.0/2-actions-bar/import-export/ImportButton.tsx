'use client';

import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { ThemeData } from '../../types/theme.types';

interface ImportButtonProps {
  onImport: (theme: ThemeData) => void;
  onError?: (error: string) => void;
  className?: string;
}

export function ImportButton({ onImport, onError, className = "" }: ImportButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const theme = JSON.parse(content) as ThemeData;
        
        // Basic validation
        if (!theme.id || !theme.name || !theme.colors) {
          throw new Error('Invalid theme file format');
        }
        
        onImport(theme);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to import theme';
        onError?.(message);
      }
    };
    
    reader.readAsText(file);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className={`h-8 w-8 p-0 ${className}`}
        onClick={handleClick}
        title="Import theme from JSON file"
      >
        <Upload className="h-3 w-3" />
      </Button>
      
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </>
  );
}