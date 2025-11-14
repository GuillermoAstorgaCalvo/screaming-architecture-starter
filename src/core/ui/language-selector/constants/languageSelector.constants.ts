/**
 * Size variant classes for language selector components
 */
export const SIZE_CLASSES = {
	sm: 'h-8 px-2 text-xs',
	md: 'h-10 px-3 text-sm',
	lg: 'h-12 px-4 text-base',
} as const;

/**
 * Size variant classes with gap for flag-based selectors
 */
export const SIZE_CLASSES_WITH_GAP = {
	sm: 'h-8 px-2 text-xs gap-1.5',
	md: 'h-10 px-3 text-sm gap-2',
	lg: 'h-12 px-4 text-base gap-2.5',
} as const;

/**
 * Flag size classes for language selector flag components
 */
export const FLAG_SIZE_CLASSES = {
	sm: 'text-sm',
	md: 'text-base',
	lg: 'text-lg',
} as const;

/**
 * Language selector size variants
 */
export type LanguageSelectorSize = keyof typeof SIZE_CLASSES;

