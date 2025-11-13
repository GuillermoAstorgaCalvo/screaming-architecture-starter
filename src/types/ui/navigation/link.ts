import type { StandardSize } from '@src-types/ui/base';
import type { HTMLAttributes, ReactNode } from 'react';

/**
 * Link variant types
 */
export type LinkVariant = 'default' | 'subtle' | 'muted';

/**
 * Link component props
 */
export interface LinkProps extends Omit<HTMLAttributes<HTMLAnchorElement>, 'href'> {
	/** Visual variant of the link @default 'default' */
	variant?: LinkVariant;
	/** Size of the link @default 'md' */
	size?: StandardSize;
	/** Link content */
	children: ReactNode;
	/** Link destination (for react-router-dom) */
	to: string;
	/** Legacy href support (for external links) */
	href?: string;
	/** Whether to open in new tab @default false */
	target?: '_blank' | '_self' | '_parent' | '_top';
	/** Whether to show external link icon @default false */
	showExternalIcon?: boolean;
}

/**
 * Anchor component props
 *
 * Anchor is for smooth scrolling to page sections (hash navigation).
 * Different from Link which is for routing with react-router-dom.
 * Useful for table of contents and in-page navigation.
 */
export interface AnchorProps extends Omit<HTMLAttributes<HTMLAnchorElement>, 'href'> {
	/** Visual variant of the anchor @default 'default' */
	variant?: LinkVariant;
	/** Size of the anchor @default 'md' */
	size?: StandardSize;
	/** Anchor content */
	children: ReactNode;
	/** Hash target (e.g., '#section-1' or 'section-1') */
	href: string;
	/** Scroll offset in pixels (to account for fixed headers) @default 0 */
	scrollOffset?: number;
	/** Scroll behavior @default 'smooth' */
	scrollBehavior?: ScrollBehavior;
}
