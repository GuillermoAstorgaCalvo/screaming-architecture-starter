import type { ReactNode } from 'react';

export type EmptyStateSize = 'sm' | 'md' | 'lg';

export interface EmptyStateProps {
	/** Title text for the empty state */
	readonly title: string;
	/** Optional description text */
	readonly description?: string;
	/** Optional action button label */
	readonly actionLabel?: string;
	/** Optional action button click handler */
	readonly onAction?: () => void;
	/** Optional icon or image to display above the title */
	readonly icon?: ReactNode;
	/** Optional custom className */
	readonly className?: string;
	/** Size variant for the empty state @default 'md' */
	readonly size?: EmptyStateSize;
}

export interface EmptyStateIconProps {
	readonly icon: ReactNode;
	readonly size: EmptyStateSize;
}

export interface EmptyStateContentProps {
	readonly title: string;
	readonly description?: string | undefined;
	readonly variantSize: EmptyStateSize;
}

export interface EmptyStateActionProps {
	readonly actionLabel?: string | undefined;
	readonly onAction?: (() => void) | undefined;
	readonly variantSize: EmptyStateSize;
	readonly size: EmptyStateSize;
}
