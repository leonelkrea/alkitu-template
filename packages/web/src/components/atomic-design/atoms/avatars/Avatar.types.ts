export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';
export type AvatarVariant = 'circular' | 'rounded' | 'square';

export interface AvatarProps {
  /**
   * Image source URL
   */
  src?: string;

  /**
   * Alternative text for the image
   */
  alt: string;

  /**
   * Size of the avatar
   * @default 'md'
   */
  size?: AvatarSize;

  /**
   * Shape variant of the avatar
   * @default 'circular'
   */
  variant?: AvatarVariant;

  /**
   * Fallback initials when image fails to load
   */
  fallback?: string;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Theme variable overrides for custom styling
   */
  themeOverride?: Record<string, string>;

  /**
   * Whether to use system colors (for special cases)
   * @default true
   */
  useSystemColors?: boolean;
}