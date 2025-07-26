'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Code, Download, Copy, Check } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { ThemeData, ThemeExportFormat } from '../../types/theme.types';

interface CodeButtonProps {
  theme: ThemeData;
  onExport?: (format: ThemeExportFormat) => void;
  className?: string;
}

export function CodeButton({ theme, onExport, className = "" }: CodeButtonProps) {
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  const generateCSS = (theme: ThemeData): string => {
    const cssVars = Object.entries(theme.colors).map(([key, colorToken]) => {
      const varName = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      return `    --${varName}: ${colorToken.value};`;
    }).join('\n');

    return `:root {\n${cssVars}\n}`;
  };

  const generateJSON = (theme: ThemeData): string => {
    return JSON.stringify(theme, null, 2);
  };

  const generateTailwind = (theme: ThemeData): string => {
    const colors = Object.entries(theme.colors).reduce((acc, [key, colorToken]) => {
      const colorName = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      acc[colorName] = colorToken.value;
      return acc;
    }, {} as Record<string, string>);

    return `module.exports = {\n  theme: {\n    extend: {\n      colors: ${JSON.stringify(colors, null, 8)}\n    }\n  }\n}`;
  };

  const handleExport = (format: 'css' | 'json' | 'tailwind') => {
    let content = '';
    let filename = '';

    switch (format) {
      case 'css':
        content = generateCSS(theme);
        filename = `${theme.name.toLowerCase().replace(/\s+/g, '-')}.css`;
        break;
      case 'json':
        content = generateJSON(theme);
        filename = `${theme.name.toLowerCase().replace(/\s+/g, '-')}.json`;
        break;
      case 'tailwind':
        content = generateTailwind(theme);
        filename = `tailwind.config.js`;
        break;
    }

    // Download file
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);

    // Callback
    onExport?.({
      format,
      content,
      filename
    });
  };

  const handleCopy = async (format: 'css' | 'json' | 'tailwind') => {
    let content = '';

    switch (format) {
      case 'css':
        content = generateCSS(theme);
        break;
      case 'json':
        content = generateJSON(theme);
        break;
      case 'tailwind':
        content = generateTailwind(theme);
        break;
    }

    try {
      await navigator.clipboard.writeText(content);
      setCopiedFormat(format);
      setTimeout(() => setCopiedFormat(null), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`h-8 w-8 p-0 ${className}`}
          title="Export theme code"
        >
          <Code className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end">
        {/* CSS Export */}
        <DropdownMenuItem onClick={() => handleExport('css')}>
          <Download className="h-4 w-4 mr-2" />
          Download CSS
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleCopy('css')}>
          {copiedFormat === 'css' ? (
            <Check className="h-4 w-4 mr-2" />
          ) : (
            <Copy className="h-4 w-4 mr-2" />
          )}
          Copy CSS
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        {/* JSON Export */}
        <DropdownMenuItem onClick={() => handleExport('json')}>
          <Download className="h-4 w-4 mr-2" />
          Download JSON
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleCopy('json')}>
          {copiedFormat === 'json' ? (
            <Check className="h-4 w-4 mr-2" />
          ) : (
            <Copy className="h-4 w-4 mr-2" />
          )}
          Copy JSON
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        {/* Tailwind Export */}
        <DropdownMenuItem onClick={() => handleExport('tailwind')}>
          <Download className="h-4 w-4 mr-2" />
          Tailwind Config
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleCopy('tailwind')}>
          {copiedFormat === 'tailwind' ? (
            <Check className="h-4 w-4 mr-2" />
          ) : (
            <Copy className="h-4 w-4 mr-2" />
          )}
          Copy Tailwind
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}