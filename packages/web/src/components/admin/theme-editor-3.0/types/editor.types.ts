// Theme Editor 3.0 - Editor Types
export type EditorSection = 'colors' | 'typography' | 'brand' | 'borders' | 'spacing' | 'shadows' | 'scroll';

export interface EditorState {
  activeSection: EditorSection;
  isEditing: boolean;
  hasUnsavedChanges: boolean;
}

export interface EditorAction {
  type: string;
  payload: any;
  timestamp: number;
  description: string;
}

export interface EditorHistory {
  past: EditorAction[];
  present: EditorAction;
  future: EditorAction[];
  maxSize: number;
}

export interface EditorConfig {
  autosave: boolean;
  autosaveInterval: number; // ms
  maxHistorySize: number;
  enableShortcuts: boolean;
}