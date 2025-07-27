'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { ThemeData, ThemeWithCurrentColors, ThemeMode, EditorState, EditorSection, ViewportState, ViewportSize, PreviewState, PreviewSection } from '../types';
import { DEFAULT_THEME, DEFAULT_THEMES } from '../constants/default-themes';
import { applyThemeToRoot, applyThemeMode, applyModeSpecificColors } from '../utils/css-variables';
import { applyScrollbarStyles } from '../utils/scrollbar-styles';

// State interface
interface ThemeEditorState {
  // Theme data
  baseTheme: ThemeData;              // Base theme with dual configs
  currentTheme: ThemeWithCurrentColors; // Theme with current colors based on mode
  availableThemes: ThemeData[];      // List of available themes
  themeMode: ThemeMode;
  
  // Editor state
  editor: EditorState;
  
  // Viewport state
  viewport: ViewportState;
  
  // Preview state
  preview: PreviewState;
  
  // UI state
  isLoading: boolean;
  error: string | null;
}

// Helper function to compute current theme with mode-specific colors
function computeCurrentTheme(baseTheme: ThemeData, mode: ThemeMode): ThemeWithCurrentColors {
  const colors = mode === 'dark' ? baseTheme.darkColors : baseTheme.lightColors;
  
  return {
    ...baseTheme,
    colors,
    lightColors: baseTheme.lightColors,
    darkColors: baseTheme.darkColors
  };
}

// Action types
type ThemeEditorAction =
  | { type: 'SET_THEME'; payload: ThemeData }
  | { type: 'SET_THEME_MODE'; payload: ThemeMode }
  | { type: 'UPDATE_CURRENT_COLORS'; payload: { mode: ThemeMode; colors: import('../types/theme.types').ThemeColors } }
  | { type: 'SET_EDITOR_SECTION'; payload: EditorSection }
  | { type: 'SET_VIEWPORT'; payload: ViewportSize }
  | { type: 'SET_PREVIEW_SECTION'; payload: PreviewSection }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'TOGGLE_UNSAVED_CHANGES'; payload: boolean }
  | { type: 'ADD_THEME'; payload: ThemeData };

// Initial state
const initialState: ThemeEditorState = {
  baseTheme: DEFAULT_THEME,
  currentTheme: computeCurrentTheme(DEFAULT_THEME, 'light'),
  availableThemes: DEFAULT_THEMES,
  themeMode: 'light',
  editor: {
    activeSection: 'colors',
    isEditing: false,
    hasUnsavedChanges: false
  },
  viewport: {
    current: 'desktop',
    isResponsive: true
  },
  preview: {
    activeSection: 'colors',
    isFullscreen: false,
    showGrid: false,
    showRuler: false
  },
  isLoading: false,
  error: null
};

// Reducer
function themeEditorReducer(state: ThemeEditorState, action: ThemeEditorAction): ThemeEditorState {
  switch (action.type) {
    case 'SET_THEME':
      const newCurrentTheme = computeCurrentTheme(action.payload, state.themeMode);
      return {
        ...state,
        baseTheme: action.payload,
        currentTheme: newCurrentTheme,
        editor: { ...state.editor, hasUnsavedChanges: false }
      };
    
    case 'SET_THEME_MODE':
      const updatedCurrentTheme = computeCurrentTheme(state.baseTheme, action.payload);
      return {
        ...state,
        themeMode: action.payload,
        currentTheme: updatedCurrentTheme
      };
    
    case 'UPDATE_CURRENT_COLORS':
      // Update colors for the current mode in the base theme
      const { mode, colors } = action.payload;
      const updatedBaseTheme = {
        ...state.baseTheme,
        [mode === 'dark' ? 'darkColors' : 'lightColors']: colors
      };
      
      // Recompute current theme if we're updating colors for the active mode
      const shouldUpdateCurrent = mode === state.themeMode;
      const newCurrentForColorUpdate = shouldUpdateCurrent 
        ? { 
            ...state.currentTheme, 
            colors,
            [mode === 'dark' ? 'darkColors' : 'lightColors']: colors
          }
        : {
            ...state.currentTheme,
            [mode === 'dark' ? 'darkColors' : 'lightColors']: colors
          };
      
      return {
        ...state,
        baseTheme: updatedBaseTheme,
        currentTheme: newCurrentForColorUpdate,
        editor: { ...state.editor, hasUnsavedChanges: true }
      };
    
    case 'SET_EDITOR_SECTION':
      return {
        ...state,
        editor: { ...state.editor, activeSection: action.payload }
      };
    
    case 'SET_VIEWPORT':
      return {
        ...state,
        viewport: { ...state.viewport, current: action.payload }
      };
    
    case 'SET_PREVIEW_SECTION':
      return {
        ...state,
        preview: { ...state.preview, activeSection: action.payload }
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
    
    case 'TOGGLE_UNSAVED_CHANGES':
      return {
        ...state,
        editor: { ...state.editor, hasUnsavedChanges: action.payload }
      };
    
    case 'ADD_THEME':
      return {
        ...state,
        availableThemes: [...state.availableThemes, action.payload],
        currentTheme: computeCurrentTheme(action.payload, state.themeMode),
        baseTheme: action.payload,
        editor: { ...state.editor, hasUnsavedChanges: false }
      };
    
    default:
      return state;
  }
}

// Context
interface ThemeEditorContextType {
  state: ThemeEditorState;
  dispatch: React.Dispatch<ThemeEditorAction>;
  
  // Helper actions
  setTheme: (theme: ThemeData) => void;
  updateTheme: (theme: ThemeData) => void;
  setThemeMode: (mode: ThemeMode) => void;
  updateCurrentModeColors: (colors: import('../types/theme.types').ThemeColors) => void;
  setEditorSection: (section: EditorSection) => void;
  setViewport: (viewport: ViewportSize) => void;
  setPreviewSection: (section: PreviewSection) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  markUnsaved: () => void;
  markSaved: () => void;
  addTheme: (theme: ThemeData) => void;
}

const ThemeEditorContext = createContext<ThemeEditorContextType | undefined>(undefined);

// Provider
interface ThemeEditorProviderProps {
  children: ReactNode;
}

export function ThemeEditorProvider({ children }: ThemeEditorProviderProps) {
  const [state, dispatch] = useReducer(themeEditorReducer, initialState);
  
  // Apply initial theme and mode on load
  useEffect(() => {
    const initialColors = state.themeMode === 'dark' ? DEFAULT_THEME.darkColors : DEFAULT_THEME.lightColors;
    applyModeSpecificColors(initialColors);
    applyThemeMode(state.themeMode);
    applyScrollbarStyles();
  }, []);
  
  // Apply colors and mode when theme mode changes
  useEffect(() => {
    const currentColors = state.themeMode === 'dark' ? state.baseTheme.darkColors : state.baseTheme.lightColors;
    applyModeSpecificColors(currentColors);
    applyThemeMode(state.themeMode);
    applyScrollbarStyles();
  }, [state.themeMode, state.baseTheme]);
  
  // Helper actions
  const setTheme = (theme: ThemeData) => {
    dispatch({ type: 'SET_THEME', payload: theme });
  };
  
  const setThemeMode = (mode: ThemeMode) => {
    dispatch({ type: 'SET_THEME_MODE', payload: mode });
  };
  
  const updateCurrentModeColors = (colors: import('../types/theme.types').ThemeColors) => {
    dispatch({ 
      type: 'UPDATE_CURRENT_COLORS', 
      payload: { mode: state.themeMode, colors }
    });
    // Apply colors immediately for live preview
    applyModeSpecificColors(colors);
    applyScrollbarStyles();
  };
  
  const setEditorSection = (section: EditorSection) => dispatch({ type: 'SET_EDITOR_SECTION', payload: section });
  const setViewport = (viewport: ViewportSize) => dispatch({ type: 'SET_VIEWPORT', payload: viewport });
  const setPreviewSection = (section: PreviewSection) => dispatch({ type: 'SET_PREVIEW_SECTION', payload: section });
  const setLoading = (loading: boolean) => dispatch({ type: 'SET_LOADING', payload: loading });
  const setError = (error: string | null) => dispatch({ type: 'SET_ERROR', payload: error });
  const markUnsaved = () => dispatch({ type: 'TOGGLE_UNSAVED_CHANGES', payload: true });
  const markSaved = () => dispatch({ type: 'TOGGLE_UNSAVED_CHANGES', payload: false });
  
  const updateTheme = (theme: ThemeData) => {
    dispatch({ type: 'SET_THEME', payload: theme });
    markUnsaved();
  };
  
  const addTheme = (theme: ThemeData) => {
    dispatch({ type: 'ADD_THEME', payload: theme });
  };
  
  const value: ThemeEditorContextType = {
    state,
    dispatch,
    setTheme,
    updateTheme,
    setThemeMode,
    updateCurrentModeColors,
    setEditorSection,
    setViewport,
    setPreviewSection,
    setLoading,
    setError,
    markUnsaved,
    markSaved,
    addTheme
  };
  
  return (
    <ThemeEditorContext.Provider value={value}>
      {children}
    </ThemeEditorContext.Provider>
  );
}

// Hook
export function useThemeEditor() {
  const context = useContext(ThemeEditorContext);
  if (context === undefined) {
    throw new Error('useThemeEditor must be used within a ThemeEditorProvider');
  }
  return context;
}