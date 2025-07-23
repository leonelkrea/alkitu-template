'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { GoogleFont } from '@/types/typography';

// Popular fonts to show first
const POPULAR_FONTS = [
  'Inter',
  'Roboto',
  'Open Sans',
  'Lato',
  'Montserrat',
  'Poppins',
  'Raleway',
  'Playfair Display',
  'Merriweather',
  'Nunito',
];

interface GoogleFontPickerProps {
  value: string;
  onChange: (fontFamily: string) => void;
  className?: string;
}

export function GoogleFontPicker({ value, onChange, className }: GoogleFontPickerProps) {
  const [open, setOpen] = useState(false);
  const [fonts, setFonts] = useState<GoogleFont[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Load Google Fonts list
  useEffect(() => {
    const loadFonts = async () => {
      try {
        // For now, we'll use a static list of popular fonts
        // In production, you'd fetch from Google Fonts API
        const fontList: GoogleFont[] = [
          { family: 'Inter', variants: ['100', '200', '300', '400', '500', '600', '700', '800', '900'], category: 'sans-serif', subsets: ['latin'] },
          { family: 'Roboto', variants: ['100', '300', '400', '500', '700', '900'], category: 'sans-serif', subsets: ['latin'] },
          { family: 'Open Sans', variants: ['300', '400', '500', '600', '700', '800'], category: 'sans-serif', subsets: ['latin'] },
          { family: 'Lato', variants: ['100', '300', '400', '700', '900'], category: 'sans-serif', subsets: ['latin'] },
          { family: 'Montserrat', variants: ['100', '200', '300', '400', '500', '600', '700', '800', '900'], category: 'sans-serif', subsets: ['latin'] },
          { family: 'Poppins', variants: ['100', '200', '300', '400', '500', '600', '700', '800', '900'], category: 'sans-serif', subsets: ['latin'] },
          { family: 'Raleway', variants: ['100', '200', '300', '400', '500', '600', '700', '800', '900'], category: 'sans-serif', subsets: ['latin'] },
          { family: 'Playfair Display', variants: ['400', '500', '600', '700', '800', '900'], category: 'serif', subsets: ['latin'] },
          { family: 'Merriweather', variants: ['300', '400', '700', '900'], category: 'serif', subsets: ['latin'] },
          { family: 'Nunito', variants: ['200', '300', '400', '500', '600', '700', '800', '900'], category: 'sans-serif', subsets: ['latin'] },
          { family: 'Ubuntu', variants: ['300', '400', '500', '700'], category: 'sans-serif', subsets: ['latin'] },
          { family: 'Oswald', variants: ['200', '300', '400', '500', '600', '700'], category: 'sans-serif', subsets: ['latin'] },
          { family: 'Noto Sans', variants: ['100', '200', '300', '400', '500', '600', '700', '800', '900'], category: 'sans-serif', subsets: ['latin'] },
          { family: 'PT Sans', variants: ['400', '700'], category: 'sans-serif', subsets: ['latin'] },
          { family: 'Source Sans Pro', variants: ['200', '300', '400', '600', '700', '900'], category: 'sans-serif', subsets: ['latin'] },
          { family: 'Bebas Neue', variants: ['400'], category: 'display', subsets: ['latin'] },
          { family: 'Georgia', variants: ['400', '700'], category: 'serif', subsets: ['latin'] },
          { family: 'Times New Roman', variants: ['400', '700'], category: 'serif', subsets: ['latin'] },
          { family: 'Arial', variants: ['400', '700'], category: 'sans-serif', subsets: ['latin'] },
          { family: 'Helvetica', variants: ['400', '700'], category: 'sans-serif', subsets: ['latin'] },
        ];
        
        setFonts(fontList);
        setLoading(false);
      } catch (error) {
        console.error('Error loading fonts:', error);
        setLoading(false);
      }
    };

    loadFonts();
  }, []);

  // Filter and sort fonts
  const filteredFonts = useMemo(() => {
    const filtered = fonts.filter(font =>
      font.family.toLowerCase().includes(search.toLowerCase())
    );

    // Sort with popular fonts first
    return filtered.sort((a, b) => {
      const aIsPopular = POPULAR_FONTS.includes(a.family);
      const bIsPopular = POPULAR_FONTS.includes(b.family);
      
      if (aIsPopular && !bIsPopular) return -1;
      if (!aIsPopular && bIsPopular) return 1;
      
      // If both are popular or both are not, maintain original order
      if (aIsPopular && bIsPopular) {
        return POPULAR_FONTS.indexOf(a.family) - POPULAR_FONTS.indexOf(b.family);
      }
      
      return a.family.localeCompare(b.family);
    });
  }, [fonts, search]);

  // Load font preview when dropdown opens
  useEffect(() => {
    if (open && filteredFonts.length > 0) {
      // Load font previews for visible fonts
      const fontsToLoad = filteredFonts.slice(0, 20).map(f => f.family);
      loadFontPreviews(fontsToLoad);
    }
  }, [open, filteredFonts]);

  const loadFontPreviews = (fontFamilies: string[]) => {
    // Create link elements for Google Fonts
    fontFamilies.forEach(family => {
      const id = `font-preview-${family.replace(/\s+/g, '-')}`;
      if (!document.getElementById(id)) {
        const link = document.createElement('link');
        link.id = id;
        link.rel = 'stylesheet';
        link.href = `https://fonts.googleapis.com/css2?family=${family.replace(/\s+/g, '+')}:wght@400;700&display=swap`;
        document.head.appendChild(link);
      }
    });
  };

  const currentFont = fonts.find(f => f.family === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between font-normal",
            !value && "text-muted-foreground",
            className
          )}
        >
          <span style={{ fontFamily: value || 'inherit' }}>
            {value || "Seleccionar fuente..."}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <input
              className="flex h-11 w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Buscar fuente..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <ScrollArea className="h-[300px]">
            {loading ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                Cargando fuentes...
              </div>
            ) : filteredFonts.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No se encontraron fuentes.
              </div>
            ) : (
              <div className="p-1">
                {filteredFonts.map((font) => (
                  <CommandItem
                    key={font.family}
                    value={font.family}
                    onSelect={() => {
                      onChange(font.family);
                      setOpen(false);
                      setSearch('');
                    }}
                    className="flex items-center justify-between py-2"
                  >
                    <span
                      style={{ fontFamily: font.family }}
                      className="flex-1"
                    >
                      {font.family}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {font.category}
                      </span>
                      <Check
                        className={cn(
                          "h-4 w-4",
                          value === font.family ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </div>
                  </CommandItem>
                ))}
              </div>
            )}
          </ScrollArea>
        </Command>
      </PopoverContent>
    </Popover>
  );
}