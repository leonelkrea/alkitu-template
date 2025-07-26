'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Settings, Sun, Moon, RotateCcw, RefreshCw, Share, Heart, Code, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCompanyTheme } from '@/components/providers/DynamicThemeProvider';

// Right section actions bar (70% width)
export function ThemeTopbar() {
  const { isDarkMode, toggleThemeMode } = useCompanyTheme();

  return (
    <div className="h-14 border-b bg-background flex items-center justify-end px-6 w-full">
      {/* Action buttons */}
      <div className="flex items-center gap-1">
        {/* Menu dots */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Share className="h-4 w-4 mr-2" />
              Share Theme
            </DropdownMenuItem>
            <DropdownMenuItem>
              Export as JSON
            </DropdownMenuItem>
            <DropdownMenuItem>
              Export as CSS
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              Theme Documentation
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Vertical separator */}
        <div className="h-6 w-px bg-border mx-2"></div>
        
        {/* Dark/Light mode toggle - Using toggle style like in the image */}
        <div className="flex items-center gap-2">
          <Sun className="h-4 w-4 text-muted-foreground" />
          <div 
            className={`w-11 h-6 rounded-full p-1 cursor-pointer transition-colors ${
              isDarkMode 
                ? 'bg-orange-500' 
                : 'bg-gray-300'
            }`}
            onClick={toggleThemeMode}
          >
            <div 
              className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                isDarkMode ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </div>
          <Moon className="h-4 w-4 text-muted-foreground" />
        </div>
        
        {/* Vertical separator */}
        <div className="h-6 w-px bg-border mx-2"></div>
        
        {/* Undo/Redo group */}
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Undo">
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Redo">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Vertical separator */}
        <div className="h-6 w-px bg-border mx-2"></div>
        
        {/* Action buttons group */}
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="px-3 h-8" title="Reset">
            <RotateCcw className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Reset</span>
          </Button>
          
          <Button variant="ghost" size="sm" className="px-3 h-8" title="Import">
            <Settings className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Import</span>
          </Button>
          
          <Button variant="ghost" size="sm" className="px-3 h-8" title="Share">
            <Share className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Share</span>
          </Button>
          
          <Button variant="ghost" size="sm" className="px-3 h-8" title="Save">
            <Heart className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Save</span>
          </Button>
          
          <Button variant="ghost" size="sm" className="px-3 h-8" title="View Code">
            <Code className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Code</span>
          </Button>
        </div>
      </div>
    </div>
  );
}