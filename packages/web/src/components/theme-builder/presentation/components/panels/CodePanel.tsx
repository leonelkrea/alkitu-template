/**
 * Theme Builder - Code Panel Component
 * Panel showing generated CSS/SCSS code from theme
 * Part of Clean Architecture presentation layer
 */

'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { 
  Copy,
  Download,
  Code2,
  FileCode,
  Palette,
  Type,
  Settings,
  Check,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Local imports
import { useThemeBuilder } from '../../contexts/ThemeBuilderContext';
import { CssConverter } from '../../../infrastructure/converters/css-converter';
import { ThemeConverter } from '../../../infrastructure/converters/theme-converter';
import type { ThemeData } from '../../../shared/types/theme.types';

/**
 * Code panel props
 */
export interface CodePanelProps {
  className?: string;
  defaultFormat?: 'css' | 'scss' | 'json';
}

/**
 * Code output formats
 */
const CODE_FORMATS = [
  { id: 'css', label: 'CSS Variables', icon: FileCode, description: 'CSS custom properties' },
  { id: 'scss', label: 'SCSS Variables', icon: FileCode, description: 'Sass variables' },
  { id: 'json', label: 'JSON Config', icon: Code2, description: 'JSON configuration' },
] as const;

/**
 * Code sections for different parts of the theme
 */
const CODE_SECTIONS = [
  { id: 'all', label: 'Complete Theme', icon: Settings },
  { id: 'colors', label: 'Colors Only', icon: Palette },
  { id: 'typography', label: 'Typography Only', icon: Type },
] as const;

/**
 * Code preview component
 */
interface CodePreviewProps {
  code: string;
  language: string;
  title: string;
}

function CodePreview({ code, language, title }: CodePreviewProps) {
  const [copied, setCopied] = useState(false);
  const [showLineNumbers, setShowLineNumbers] = useState(true);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success('Code copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy code');
    }
  }, [code]);

  const handleDownload = useCallback(() => {
    const extension = language === 'json' ? 'json' : language === 'scss' ? 'scss' : 'css';
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `theme.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded as theme.${extension}`);
  }, [code, language]);

  const formattedCode = useMemo(() => {
    if (!showLineNumbers) return code;
    
    return code.split('\n').map((line, index) => {
      const lineNumber = (index + 1).toString().padStart(3, ' ');
      return `${lineNumber} │ ${line}`;
    }).join('\n');
  }, [code, showLineNumbers]);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium">{title}</h3>
          <Badge variant="outline" className="text-xs">
            {code.split('\n').length} lines
          </Badge>
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowLineNumbers(!showLineNumbers)}
            className="h-7 w-7 p-0"
          >
            {showLineNumbers ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-7 w-7 p-0"
          >
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            className="h-7 w-7 p-0"
          >
            <Download className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Code content */}
      <ScrollArea className="flex-1">
        <pre className="p-4 text-xs font-mono leading-relaxed overflow-x-auto">
          <code className={`language-${language}`}>
            {formattedCode}
          </code>
        </pre>
      </ScrollArea>
    </div>
  );
}

/**
 * Code panel component
 */
export function CodePanel({ className, defaultFormat = 'css' }: CodePanelProps) {
  const { currentTheme, lightColors, darkColors, typography } = useThemeBuilder();
  const [format, setFormat] = useState<'css' | 'scss' | 'json'>(defaultFormat);
  const [section, setSection] = useState<'all' | 'colors' | 'typography'>('all');
  const [key, setKey] = useState(0);

  /**
   * Generate code based on current settings
   */
  const generatedCode = useMemo(() => {
    if (!currentTheme) return '/* No theme data available */';

    const cssConverter = new CssConverter();
    const themeConverter = new ThemeConverter();

    try {
      switch (format) {
        case 'json':
          if (section === 'colors') {
            return JSON.stringify({ lightColors, darkColors }, null, 2);
          } else if (section === 'typography') {
            return JSON.stringify(typography, null, 2);
          } else {
            return JSON.stringify(currentTheme, null, 2);
          }
          
        case 'scss':
          if (section === 'colors') {
            return cssConverter.generateScssVariables({ lightColors, darkColors });
          } else if (section === 'typography') {
            return cssConverter.generateScssTypography(typography || {});
          } else {
            return cssConverter.generateScssVariables(currentTheme);
          }
          
        case 'css':
        default:
          if (section === 'colors') {
            return cssConverter.generateCssVariables({ lightColors, darkColors });
          } else if (section === 'typography') {
            return cssConverter.generateCssTypography(typography || {});
          } else {
            return cssConverter.generateCssVariables(currentTheme);
          }
      }
    } catch (error) {
      console.error('Code generation error:', error);
      return `/* Error generating ${format.toUpperCase()} code */\n/* ${error instanceof Error ? error.message : 'Unknown error'} */`;
    }
  }, [currentTheme, lightColors, darkColors, typography, format, section]);

  // Ensure generatedCode is always a string
  const safeGeneratedCode = generatedCode || '/* No code generated */';

  /**
   * Handle refresh
   */
  const handleRefresh = useCallback(() => {
    setKey(prev => prev + 1);
    toast.success('Code refreshed');
  }, []);

  /**
   * Get current format info
   */
  const currentFormatInfo = CODE_FORMATS.find(f => f.id === format);
  const currentSectionInfo = CODE_SECTIONS.find(s => s.id === section);

  if (!currentTheme) {
    return (
      <div className={cn('flex items-center justify-center h-full', className)}>
        <div className="text-center text-muted-foreground">
          <Code2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No theme data available</p>
          <p className="text-sm">Configure your theme to see generated code</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('h-full flex flex-col', className)}>
      {/* Controls */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Code2 className="h-4 w-4" />
            <h2 className="font-semibold">Generated Code</h2>
          </div>
          
          <div className="flex items-center gap-2">
            <Select value={format} onValueChange={(value: any) => setFormat(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CODE_FORMATS.map((fmt) => {
                  const Icon = fmt.icon;
                  return (
                    <SelectItem key={fmt.id} value={fmt.id}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-3 w-3" />
                        {fmt.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            
            <Select value={section} onValueChange={(value: any) => setSection(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CODE_SECTIONS.map((sec) => {
                  const Icon = sec.icon;
                  return (
                    <SelectItem key={sec.id} value={sec.id}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-3 w-3" />
                        {sec.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          className="h-8"
        >
          <RefreshCw className="h-3 w-3" />
        </Button>
      </div>

      {/* Code preview */}
      <div className="flex-1" key={key}>
        <CodePreview
          code={safeGeneratedCode}
          language={format}
          title={`${currentSectionInfo?.label} - ${currentFormatInfo?.label}`}
        />
      </div>

      {/* Footer with info */}
      <div className="p-3 border-t bg-muted/30">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>Format: {currentFormatInfo?.description}</span>
            <span>Section: {currentSectionInfo?.label}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>{safeGeneratedCode.split('\n').length} lines</span>
            <span>•</span>
            <span>{new Blob([safeGeneratedCode]).size} bytes</span>
          </div>
        </div>
      </div>
    </div>
  );
}