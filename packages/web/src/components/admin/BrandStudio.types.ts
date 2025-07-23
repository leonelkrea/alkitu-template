import type { BrandVariant, BrandSize, MonochromeMode } from '@/components/atomic-design/atoms/brands/Brand.types';

export type Breakpoint = 'sm' | 'md' | 'lg';

export interface SpacingValue {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export type AnimationCategory = 
  | 'none'
  | 'attention-seekers'
  | 'back-entrances'
  | 'back-exits'
  | 'bouncing-entrances'
  | 'bouncing-exits'
  | 'fading-entrances'
  | 'fading-exits'
  | 'flippers'
  | 'lightspeed'
  | 'rotating-entrances'
  | 'rotating-exits'
  | 'specials'
  | 'zooming-entrances'
  | 'zooming-exits'
  | 'sliding-entrances'
  | 'sliding-exits';

export interface AnimationOption {
  name: string;
  className: string;
  description: string;
}

export const ANIMATION_CATEGORIES: Record<AnimationCategory, AnimationOption[]> = {
  'none': [
    { name: 'None', className: '', description: 'No animation' }
  ],
  'attention-seekers': [
    { name: 'Bounce', className: 'animate__bounce', description: 'Bouncing effect' },
    { name: 'Flash', className: 'animate__flash', description: 'Flashing effect' },
    { name: 'Pulse', className: 'animate__pulse', description: 'Pulsing effect' },
    { name: 'Rubber Band', className: 'animate__rubberBand', description: 'Rubber band stretch' },
    { name: 'Shake X', className: 'animate__shakeX', description: 'Horizontal shake' },
    { name: 'Shake Y', className: 'animate__shakeY', description: 'Vertical shake' },
    { name: 'Head Shake', className: 'animate__headShake', description: 'Head shaking motion' },
    { name: 'Swing', className: 'animate__swing', description: 'Swinging motion' },
    { name: 'Tada', className: 'animate__tada', description: 'Celebration effect' },
    { name: 'Wobble', className: 'animate__wobble', description: 'Wobbling motion' },
    { name: 'Jello', className: 'animate__jello', description: 'Jello-like effect' },
    { name: 'Heart Beat', className: 'animate__heartBeat', description: 'Heartbeat rhythm' }
  ],
  'back-entrances': [
    { name: 'Back In Down', className: 'animate__backInDown', description: 'Enter from above with back motion' },
    { name: 'Back In Left', className: 'animate__backInLeft', description: 'Enter from left with back motion' },
    { name: 'Back In Right', className: 'animate__backInRight', description: 'Enter from right with back motion' },
    { name: 'Back In Up', className: 'animate__backInUp', description: 'Enter from below with back motion' }
  ],
  'back-exits': [
    { name: 'Back Out Down', className: 'animate__backOutDown', description: 'Exit downward with back motion' },
    { name: 'Back Out Left', className: 'animate__backOutLeft', description: 'Exit left with back motion' },
    { name: 'Back Out Right', className: 'animate__backOutRight', description: 'Exit right with back motion' },
    { name: 'Back Out Up', className: 'animate__backOutUp', description: 'Exit upward with back motion' }
  ],
  'bouncing-entrances': [
    { name: 'Bounce In', className: 'animate__bounceIn', description: 'Bounce entrance' },
    { name: 'Bounce In Down', className: 'animate__bounceInDown', description: 'Bounce in from above' },
    { name: 'Bounce In Left', className: 'animate__bounceInLeft', description: 'Bounce in from left' },
    { name: 'Bounce In Right', className: 'animate__bounceInRight', description: 'Bounce in from right' },
    { name: 'Bounce In Up', className: 'animate__bounceInUp', description: 'Bounce in from below' }
  ],
  'bouncing-exits': [
    { name: 'Bounce Out', className: 'animate__bounceOut', description: 'Bounce exit' },
    { name: 'Bounce Out Down', className: 'animate__bounceOutDown', description: 'Bounce out downward' },
    { name: 'Bounce Out Left', className: 'animate__bounceOutLeft', description: 'Bounce out left' },
    { name: 'Bounce Out Right', className: 'animate__bounceOutRight', description: 'Bounce out right' },
    { name: 'Bounce Out Up', className: 'animate__bounceOutUp', description: 'Bounce out upward' }
  ],
  'fading-entrances': [
    { name: 'Fade In', className: 'animate__fadeIn', description: 'Simple fade in' },
    { name: 'Fade In Down', className: 'animate__fadeInDown', description: 'Fade in from above' },
    { name: 'Fade In Down Big', className: 'animate__fadeInDownBig', description: 'Fade in from far above' },
    { name: 'Fade In Left', className: 'animate__fadeInLeft', description: 'Fade in from left' },
    { name: 'Fade In Left Big', className: 'animate__fadeInLeftBig', description: 'Fade in from far left' },
    { name: 'Fade In Right', className: 'animate__fadeInRight', description: 'Fade in from right' },
    { name: 'Fade In Right Big', className: 'animate__fadeInRightBig', description: 'Fade in from far right' },
    { name: 'Fade In Up', className: 'animate__fadeInUp', description: 'Fade in from below' },
    { name: 'Fade In Up Big', className: 'animate__fadeInUpBig', description: 'Fade in from far below' },
    { name: 'Fade In Top Left', className: 'animate__fadeInTopLeft', description: 'Fade in from top-left' },
    { name: 'Fade In Top Right', className: 'animate__fadeInTopRight', description: 'Fade in from top-right' },
    { name: 'Fade In Bottom Left', className: 'animate__fadeInBottomLeft', description: 'Fade in from bottom-left' },
    { name: 'Fade In Bottom Right', className: 'animate__fadeInBottomRight', description: 'Fade in from bottom-right' }
  ],
  'fading-exits': [
    { name: 'Fade Out', className: 'animate__fadeOut', description: 'Simple fade out' },
    { name: 'Fade Out Down', className: 'animate__fadeOutDown', description: 'Fade out downward' },
    { name: 'Fade Out Down Big', className: 'animate__fadeOutDownBig', description: 'Fade out far downward' },
    { name: 'Fade Out Left', className: 'animate__fadeOutLeft', description: 'Fade out to left' },
    { name: 'Fade Out Left Big', className: 'animate__fadeOutLeftBig', description: 'Fade out far left' },
    { name: 'Fade Out Right', className: 'animate__fadeOutRight', description: 'Fade out to right' },
    { name: 'Fade Out Right Big', className: 'animate__fadeOutRightBig', description: 'Fade out far right' },
    { name: 'Fade Out Up', className: 'animate__fadeOutUp', description: 'Fade out upward' },
    { name: 'Fade Out Up Big', className: 'animate__fadeOutUpBig', description: 'Fade out far upward' },
    { name: 'Fade Out Top Left', className: 'animate__fadeOutTopLeft', description: 'Fade out to top-left' },
    { name: 'Fade Out Top Right', className: 'animate__fadeOutTopRight', description: 'Fade out to top-right' },
    { name: 'Fade Out Bottom Right', className: 'animate__fadeOutBottomRight', description: 'Fade out to bottom-right' },
    { name: 'Fade Out Bottom Left', className: 'animate__fadeOutBottomLeft', description: 'Fade out to bottom-left' }
  ],
  'flippers': [
    { name: 'Flip', className: 'animate__flip', description: 'Simple flip' },
    { name: 'Flip In X', className: 'animate__flipInX', description: 'Flip in horizontally' },
    { name: 'Flip In Y', className: 'animate__flipInY', description: 'Flip in vertically' },
    { name: 'Flip Out X', className: 'animate__flipOutX', description: 'Flip out horizontally' },
    { name: 'Flip Out Y', className: 'animate__flipOutY', description: 'Flip out vertically' }
  ],
  'lightspeed': [
    { name: 'Light Speed In Right', className: 'animate__lightSpeedInRight', description: 'Fast entry from right' },
    { name: 'Light Speed In Left', className: 'animate__lightSpeedInLeft', description: 'Fast entry from left' },
    { name: 'Light Speed Out Right', className: 'animate__lightSpeedOutRight', description: 'Fast exit to right' },
    { name: 'Light Speed Out Left', className: 'animate__lightSpeedOutLeft', description: 'Fast exit to left' }
  ],
  'rotating-entrances': [
    { name: 'Rotate In', className: 'animate__rotateIn', description: 'Rotate entrance' },
    { name: 'Rotate In Down Left', className: 'animate__rotateInDownLeft', description: 'Rotate in from down-left' },
    { name: 'Rotate In Down Right', className: 'animate__rotateInDownRight', description: 'Rotate in from down-right' },
    { name: 'Rotate In Up Left', className: 'animate__rotateInUpLeft', description: 'Rotate in from up-left' },
    { name: 'Rotate In Up Right', className: 'animate__rotateInUpRight', description: 'Rotate in from up-right' }
  ],
  'rotating-exits': [
    { name: 'Rotate Out', className: 'animate__rotateOut', description: 'Rotate exit' },
    { name: 'Rotate Out Down Left', className: 'animate__rotateOutDownLeft', description: 'Rotate out to down-left' },
    { name: 'Rotate Out Down Right', className: 'animate__rotateOutDownRight', description: 'Rotate out to down-right' },
    { name: 'Rotate Out Up Left', className: 'animate__rotateOutUpLeft', description: 'Rotate out to up-left' },
    { name: 'Rotate Out Up Right', className: 'animate__rotateOutUpRight', description: 'Rotate out to up-right' }
  ],
  'specials': [
    { name: 'Hinge', className: 'animate__hinge', description: 'Hinge door effect' },
    { name: 'Jack In The Box', className: 'animate__jackInTheBox', description: 'Jack-in-the-box effect' },
    { name: 'Roll In', className: 'animate__rollIn', description: 'Roll in entrance' },
    { name: 'Roll Out', className: 'animate__rollOut', description: 'Roll out exit' }
  ],
  'zooming-entrances': [
    { name: 'Zoom In', className: 'animate__zoomIn', description: 'Zoom in entrance' },
    { name: 'Zoom In Down', className: 'animate__zoomInDown', description: 'Zoom in from above' },
    { name: 'Zoom In Left', className: 'animate__zoomInLeft', description: 'Zoom in from left' },
    { name: 'Zoom In Right', className: 'animate__zoomInRight', description: 'Zoom in from right' },
    { name: 'Zoom In Up', className: 'animate__zoomInUp', description: 'Zoom in from below' }
  ],
  'zooming-exits': [
    { name: 'Zoom Out', className: 'animate__zoomOut', description: 'Zoom out exit' },
    { name: 'Zoom Out Down', className: 'animate__zoomOutDown', description: 'Zoom out downward' },
    { name: 'Zoom Out Left', className: 'animate__zoomOutLeft', description: 'Zoom out to left' },
    { name: 'Zoom Out Right', className: 'animate__zoomOutRight', description: 'Zoom out to right' },
    { name: 'Zoom Out Up', className: 'animate__zoomOutUp', description: 'Zoom out upward' }
  ],
  'sliding-entrances': [
    { name: 'Slide In Down', className: 'animate__slideInDown', description: 'Slide in from above' },
    { name: 'Slide In Left', className: 'animate__slideInLeft', description: 'Slide in from left' },
    { name: 'Slide In Right', className: 'animate__slideInRight', description: 'Slide in from right' },
    { name: 'Slide In Up', className: 'animate__slideInUp', description: 'Slide in from below' }
  ],
  'sliding-exits': [
    { name: 'Slide Out Down', className: 'animate__slideOutDown', description: 'Slide out downward' },
    { name: 'Slide Out Left', className: 'animate__slideOutLeft', description: 'Slide out to left' },
    { name: 'Slide Out Right', className: 'animate__slideOutRight', description: 'Slide out to right' },
    { name: 'Slide Out Up', className: 'animate__slideOutUp', description: 'Slide out upward' }
  ]
};

export interface AnimationConfig {
  enabled: boolean;
  duration: number;
  timingFunction: string;
  animationType: string; // animate.css class name
  animationCategory: AnimationCategory;
}

export interface BrandLayoutConfig {
  // Inheritance indicators for each property
  _inherited?: {
    variant?: boolean;
    size?: boolean;
    showTagline?: boolean;
    clickable?: boolean;
    monochromeMode?: boolean;
    useSystemColors?: boolean;
    alignment?: boolean;
    verticalAlignment?: boolean;
    containerWidth?: boolean;
    minWidth?: boolean;
    maxWidth?: boolean;
    iconSize?: boolean;
    customIconSize?: boolean;
    overflow?: boolean;
    animationEnabled?: boolean;
    animationDuration?: boolean;
    animationTimingFunction?: boolean;
    animationType?: boolean;
    animationCategory?: boolean;
    gap?: boolean;
    textGap?: boolean;
    margin?: boolean;
    padding?: boolean;
  };
  
  visible: boolean;
  variant: BrandVariant;
  size: BrandSize;
  showTagline: boolean;
  clickable: boolean;
  monochromeMode: MonochromeMode;
  useSystemColors: boolean;
  // Layout
  alignment: 'left' | 'center' | 'right';
  verticalAlignment: 'top' | 'center' | 'bottom';
  // Container Width
  containerWidth: 'fit-content' | 'full' | 'custom';
  minWidth?: number;
  maxWidth?: number;
  // Icon
  iconSize: 'default' | 'custom';
  customIconSize?: number; // percentage relative to default size
  // Layout Control
  overflow: 'visible' | 'hidden';
  // Animation
  animationEnabled: boolean;
  animationDuration: number; // in milliseconds
  animationTimingFunction: string; // CSS timing function
  animationType: string; // animate.css class name
  animationCategory: AnimationCategory;
  // Spacing
  gap: number; // Gap between icon and text
  textGap: number; // Gap between primary and secondary text
  margin: SpacingValue;
  padding: SpacingValue;
}

export type ResponsiveConfig<T> = {
  sm: T;
  md: T;
  lg: T;
};

export interface BreakpointInfo {
  key: Breakpoint;
  label: string;
  width: string;
  icon: React.ReactNode;
}

// Default configurations for each breakpoint
export const defaultBreakpointConfig: BrandLayoutConfig = {
  visible: true,
  variant: 'horizontal',
  size: 'md',
  showTagline: true,
  clickable: false,
  monochromeMode: 'none',
  useSystemColors: false,
  alignment: 'left',
  verticalAlignment: 'center',
  containerWidth: 'fit-content',
  minWidth: undefined,
  maxWidth: undefined,
  iconSize: 'default',
  customIconSize: 100,
  overflow: 'visible',
  animationEnabled: false,
  animationDuration: 1000,
  animationTimingFunction: 'cubic-bezier(0.25, 0.1, 0.25, 1.0)', // ease
  animationType: '',
  animationCategory: 'none',
  gap: 8,
  textGap: 4,
  margin: { top: 0, right: 0, bottom: 0, left: 0 },
  padding: { top: 0, right: 0, bottom: 0, left: 0 }
};

export const defaultResponsiveConfig: ResponsiveConfig<BrandLayoutConfig> = {
  sm: {
    ...defaultBreakpointConfig,
    size: 'sm',
    showTagline: false,
    variant: 'compact'
  },
  md: {
    ...defaultBreakpointConfig,
    size: 'md',
    variant: 'horizontal'
  },
  lg: {
    ...defaultBreakpointConfig,
    size: 'lg',
    variant: 'horizontal'
  }
};