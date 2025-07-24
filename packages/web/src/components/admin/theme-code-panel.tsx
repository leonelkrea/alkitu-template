'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

interface ThemeCodePanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lightColors: Record<string, string>;
  darkColors: Record<string, string>;
  themeName?: string;
}

export function ThemeCodePanel({
  open,
  onOpenChange,
  lightColors,
  darkColors,
  themeName = 'Custom Theme',
}: ThemeCodePanelProps) {
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

  const generateCSSVariables = (
    colors: Record<string, string>,
    mode: 'light' | 'dark',
  ) => {
    const selector = mode === 'dark' ? '.dark' : ':root';
    const cssVars = Object.entries(colors)
      .map(([key, value]) => `  --${key}: ${value};`)
      .join('\n');

    return `${selector} {\n${cssVars}\n}`;
  };

  const generateTailwindConfig = () => {
    return `// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
    },
  },
}`;
  };

  const generateJSONTheme = () => {
    return JSON.stringify(
      {
        name: themeName,
        lightModeConfig: lightColors,
        darkModeConfig: darkColors,
      },
      null,
      2,
    );
  };

  const copyToClipboard = async (text: string, tabName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedTab(tabName);
      toast.success('Code copied to clipboard!');
      setTimeout(() => setCopiedTab(null), 2000);
    } catch (error) {
      toast.error('Failed to copy code');
    }
  };

  const lightCSS = generateCSSVariables(lightColors, 'light');
  const darkCSS = generateCSSVariables(darkColors, 'dark');
  const combinedCSS = `/* ${themeName} Theme */\n\n${lightCSS}\n\n${darkCSS}`;
  const tailwindConfig = generateTailwindConfig();
  const jsonTheme = generateJSONTheme();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Theme Code</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="css" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="css">CSS Variables</TabsTrigger>
            <TabsTrigger value="tailwind">Tailwind Config</TabsTrigger>
            <TabsTrigger value="json">JSON Export</TabsTrigger>
          </TabsList>

          <TabsContent value="css" className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">CSS Custom Properties</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(combinedCSS, 'css')}
              >
                {copiedTab === 'css' ? (
                  <Check className="size-4 mr-2" />
                ) : (
                  <Copy className="size-4 mr-2" />
                )}
                Copy CSS
              </Button>
            </div>
            <ScrollArea className="h-[400px] w-full border rounded-md p-4">
              <pre className="text-sm">
                <code>{combinedCSS}</code>
              </pre>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="tailwind" className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">
                Tailwind CSS Configuration
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(tailwindConfig, 'tailwind')}
              >
                {copiedTab === 'tailwind' ? (
                  <Check className="size-4 mr-2" />
                ) : (
                  <Copy className="size-4 mr-2" />
                )}
                Copy Config
              </Button>
            </div>
            <ScrollArea className="h-[400px] w-full border rounded-md p-4">
              <pre className="text-sm">
                <code>{tailwindConfig}</code>
              </pre>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="json" className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">JSON Theme Export</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(jsonTheme, 'json')}
              >
                {copiedTab === 'json' ? (
                  <Check className="size-4 mr-2" />
                ) : (
                  <Copy className="size-4 mr-2" />
                )}
                Copy JSON
              </Button>
            </div>
            <ScrollArea className="h-[400px] w-full border rounded-md p-4">
              <pre className="text-sm">
                <code>{jsonTheme}</code>
              </pre>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
