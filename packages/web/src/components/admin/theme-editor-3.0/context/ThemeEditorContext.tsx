'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { ThemeData, ThemeMode, EditorState, EditorSection, ViewportState, ViewportSize, PreviewState, PreviewSection } from '../types';
import { DEFAULT_THEME } from '../constants/default-themes';

// State interface
interface ThemeEditorState {
  // Theme data
  currentTheme: ThemeData;
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

// Action types
type ThemeEditorAction =
  | { type: 'SET_THEME'; payload: ThemeData }
  | { type: 'SET_THEME_MODE'; payload: ThemeMode }
  | { type: 'SET_EDITOR_SECTION'; payload: EditorSection }
  | { type: 'SET_VIEWPORT'; payload: ViewportSize }
  | { type: 'SET_PREVIEW_SECTION'; payload: PreviewSection }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'TOGGLE_UNSAVED_CHANGES'; payload: boolean };

// Initial state
const initialState: ThemeEditorState = {
  currentTheme: DEFAULT_THEME,
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
      return {
        ...state,
        currentTheme: action.payload,
        editor: { ...state.editor, hasUnsavedChanges: false }
      };
    
    case 'SET_THEME_MODE':
      return {
        ...state,
        themeMode: action.payload,
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
  setEditorSection: (section: EditorSection) => void;
  setViewport: (viewport: ViewportSize) => void;
  setPreviewSection: (section: PreviewSection) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  markUnsaved: () => void;
  markSaved: () => void;
}

const ThemeEditorContext = createContext<ThemeEditorContextType | undefined>(undefined);

// Provider
interface ThemeEditorProviderProps {
  children: ReactNode;
}

export function ThemeEditorProvider({ children }: ThemeEditorProviderProps) {
  const [state, dispatch] = useReducer(themeEditorReducer, initialState);
  
  // Helper actions
  const setTheme = (theme: ThemeData) => dispatch({ type: 'SET_THEME', payload: theme });
  const updateTheme = (theme: ThemeData) => {
    dispatch({ type: 'SET_THEME', payload: theme });
    dispatch({ type: 'TOGGLE_UNSAVED_CHANGES', payload: true });
  };
  const setThemeMode = (mode: ThemeMode) => dispatch({ type: 'SET_THEME_MODE', payload: mode });
  const setEditorSection = (section: EditorSection) => dispatch({ type: 'SET_EDITOR_SECTION', payload: section });
  const setViewport = (viewport: ViewportSize) => dispatch({ type: 'SET_VIEWPORT', payload: viewport });
  const setPreviewSection = (section: PreviewSection) => dispatch({ type: 'SET_PREVIEW_SECTION', payload: section });
  const setLoading = (loading: boolean) => dispatch({ type: 'SET_LOADING', payload: loading });
  const setError = (error: string | null) => dispatch({ type: 'SET_ERROR', payload: error });
  const markUnsaved = () => dispatch({ type: 'TOGGLE_UNSAVED_CHANGES', payload: true });
  const markSaved = () => dispatch({ type: 'TOGGLE_UNSAVED_CHANGES', payload: false });
  
  const value: ThemeEditorContextType = {
    state,
    dispatch,
    setTheme,
    updateTheme,
    setThemeMode,
    setEditorSection,
    setViewport,
    setPreviewSection,
    setLoading,
    setError,
    markUnsaved,
    markSaved
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