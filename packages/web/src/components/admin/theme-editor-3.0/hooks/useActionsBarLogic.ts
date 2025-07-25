'use client';

import { useThemeEditor } from '../context/ThemeEditorContext';
import { DEFAULT_THEMES } from '../constants/default-themes';
import { 
  ActionsBarLogic,
  HistoryState,
  ThemeImportHandler,
  ThemeImportErrorHandler,
  ThemeSaveHandler,
  UndoHandler,
  RedoHandler,
  ResetHandler
} from '../types';

/**
 * Custom hook para centralizar la lógica del Actions Bar
 * Elimina la redundancia de handlers y estados
 * Ahora con tipos específicos en lugar de 'any'
 */
export function useActionsBarLogic(): ActionsBarLogic {
  const { 
    state, 
    setViewport, 
    setThemeMode,
    setTheme,
    setError,
    markSaved
  } = useThemeEditor();

  // Get current theme or default (evita repetición del fallback)
  const currentTheme = state.currentTheme || DEFAULT_THEMES[0];

  // Mock history state (centralizamos el estado mock)
  const historyState: HistoryState = {
    canUndo: false,
    canRedo: false,
    undoCount: 0,
    redoCount: 0
  };

  // Handlers centralizados con tipos específicos
  const handleUndo: UndoHandler = () => {
    // TODO: Implement undo functionality
    console.log('Undo');
  };

  const handleRedo: RedoHandler = () => {
    // TODO: Implement redo functionality
    console.log('Redo');
  };

  const handleImport: ThemeImportHandler = (theme) => {
    setTheme(theme);
  };

  const handleImportError: ThemeImportErrorHandler = (error) => {
    setError(error);
  };

  const handleSave: ThemeSaveHandler = (theme) => {
    // TODO: Implement save to localStorage/API
    console.log('Saving theme:', theme.name);
    markSaved();
  };

  const handleReset: ResetHandler = () => {
    // Reset to default theme
    setTheme(DEFAULT_THEMES[0]);
    markSaved();
  };

  return {
    state,
    currentTheme,
    historyState,
    setViewport,
    setThemeMode,
    handleUndo,
    handleRedo,
    handleImport,
    handleImportError,
    handleSave,
    handleReset
  };
}