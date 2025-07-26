'use client';

import React from 'react';
import { ImportButton } from './ImportButton';
import { CodeButton } from './CodeButton';
import { ThemeData, ThemeExportFormat } from '../../types/theme.types';

interface ImportExportProps {
  theme: ThemeData;
  onImport: (theme: ThemeData) => void;
  onExport?: (format: ThemeExportFormat) => void;
  onImportError?: (error: string) => void;
  className?: string;
}

export function ImportExport({
  theme,
  onImport,
  onExport,
  onImportError,
  className = ""
}: ImportExportProps) {
  return (
    <div className={`flex gap-1 ${className}`}>
      <ImportButton 
        onImport={onImport}
        onError={onImportError}
      />
      <CodeButton 
        theme={theme}
        onExport={onExport}
      />
    </div>
  );
}