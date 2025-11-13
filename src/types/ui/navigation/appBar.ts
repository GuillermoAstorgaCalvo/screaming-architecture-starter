import type { HTMLAttributes, ReactNode } from 'react';

/**
 * AppBar variant types
 */
export type AppBarVariant = 'default' | 'elevated' | 'outlined';

/**
 * AppBar component props
 */
export interface AppBarProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
	/** AppBar title */
	title?: ReactNode;
	/** Optional leading element (e.g., menu icon, back button) */
	leading?: ReactNode;
	/** Optional trailing elements (e.g., action buttons) */
	trailing?: ReactNode;
	/** Visual variant of the AppBar @default 'default' */
	variant?: AppBarVariant;
	/** Whether the AppBar is fixed at the top @default false */
	fixed?: boolean;
	/** Custom className for the AppBar */
	className?: string;
}
