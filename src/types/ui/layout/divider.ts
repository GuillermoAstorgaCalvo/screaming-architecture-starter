import type { HTMLAttributes } from 'react';

/**
 * Divider orientation types
 */
export type DividerOrientation = 'horizontal' | 'vertical';

/**
 * Divider component props
 */
export interface DividerProps extends HTMLAttributes<HTMLHRElement> {
	/** Orientation of the divider @default 'horizontal' */
	orientation?: DividerOrientation;
	/** Additional CSS classes */
	className?: string;
}

/**
 * Separator orientation types (same as Divider)
 */
export type SeparatorOrientation = 'horizontal' | 'vertical';

/**
 * Separator component props
 * Lighter visual separator component, often used for subtle divisions
 */
export interface SeparatorProps extends HTMLAttributes<HTMLHRElement> {
	/** Orientation of the separator @default 'horizontal' */
	orientation?: SeparatorOrientation;
	/** Additional CSS classes */
	className?: string;
}
