import type { StandardSize } from '@src-types/ui/base';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

/**
 * Floating Action Button position types
 */
export type FloatingActionButtonPosition =
	| 'bottom-right'
	| 'bottom-left'
	| 'top-right'
	| 'top-left';

/**
 * Floating Action Button component props
 */
export interface FloatingActionButtonProps
	extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
	/** Icon to display in the FAB */
	icon: ReactNode;
	/** Accessible label for the button (required for accessibility) */
	'aria-label': string;
	/** Optional tooltip text */
	tooltip?: string;
	/** Position of the FAB @default 'bottom-right' */
	position?: FloatingActionButtonPosition;
	/** Size of the FAB @default 'md' */
	size?: StandardSize;
	/** Visual variant @default 'primary' */
	variant?: 'primary' | 'secondary';
	/** Whether the FAB is extended (shows label) @default false */
	extended?: boolean;
	/** Label text for extended FAB */
	label?: ReactNode;
	/** Custom className for the FAB */
	className?: string;
}
