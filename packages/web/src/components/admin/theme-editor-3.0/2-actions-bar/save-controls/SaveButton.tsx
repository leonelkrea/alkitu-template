'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Save, Heart, Check } from 'lucide-react';
import { ThemeData } from '../../types/theme.types';

interface SaveButtonProps {
  theme: ThemeData;
  onSave: (theme: ThemeData) => void;
  hasUnsavedChanges?: boolean;
  className?: string;
}

export function SaveButton({ 
  theme, 
  onSave, 
  hasUnsavedChanges = false,
  className = ""
}: SaveButtonProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Update theme timestamp
      const updatedTheme = {
        ...theme,
        updatedAt: new Date().toISOString()
      };
      
      await onSave(updatedTheme);
      
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2000);
    } catch (error) {
      console.error('Failed to save theme:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const getIcon = () => {
    if (justSaved) return <Check className="h-3 w-3" />;
    if (theme.isFavorite) return <Heart className="h-3 w-3 fill-current" />;
    return <Save className="h-3 w-3" />;
  };

  const getVariant = () => {
    if (justSaved) return 'default';
    if (hasUnsavedChanges) return 'default';
    return 'outline';
  };

  const getTitle = () => {
    if (justSaved) return 'Theme saved!';
    if (hasUnsavedChanges) return 'Save changes to theme';
    return 'Save theme';
  };

  return (
    <Button
      variant={getVariant()}
      size="sm"
      className={`h-8 w-8 p-0 ${className} ${justSaved ? 'bg-green-600 hover:bg-green-700' : ''}`}
      onClick={handleSave}
      disabled={isSaving}
      title={getTitle()}
    >
      {getIcon()}
    </Button>
  );
}