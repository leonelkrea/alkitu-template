// Theme Editor 3.0 - Preview Types
export type PreviewSection = 'colors' | 'typography' | 'brand' | 'atomos' | 'moleculas' | 'organismos';

export interface PreviewState {
  activeSection: PreviewSection;
  isFullscreen: boolean;
  showGrid: boolean;
  showRuler: boolean;
}

export interface ComponentShowcase {
  id: string;
  name: string;
  category: 'atomos' | 'moleculas' | 'organismos';
  component: React.ComponentType<any>;
  props?: Record<string, any>;
  variants?: ComponentVariant[];
}

export interface ComponentVariant {
  name: string;
  props: Record<string, any>;
  description?: string;
}