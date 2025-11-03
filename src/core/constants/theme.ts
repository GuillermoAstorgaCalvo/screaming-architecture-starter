/**
 * Theme constants
 * Central source of truth for theme values
 * Avoid hardcoding theme strings elsewhere
 */

export const THEMES = ['light', 'dark', 'system'] as const;

/**
 * Theme type derived from THEMES constant to ensure consistency
 */
export type Theme = (typeof THEMES)[number];
