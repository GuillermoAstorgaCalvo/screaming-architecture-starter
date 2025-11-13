import type { CSSProperties, HTMLAttributes, MouseEvent, ReactNode } from 'react';

/**
 * Resizable direction types
 */
export type ResizableDirection = 'horizontal' | 'vertical' | 'both';

/**
 * Resizable component props - creates resizable panels/containers
 */
export interface ResizableProps {
	children: ReactNode;
	/** @default 'horizontal' */
	direction?: ResizableDirection;
	/** @default '0' */
	minSize?: string | number;
	maxSize?: string | number;
	defaultSize?: string | number;
	size?: string | number;
	onResize?: (size: number) => void;
	/** @default false */
	disabled?: boolean;
	className?: string;
	handleClassName?: string;
	style?: CSSProperties;
}

/**
 * Backdrop variant types
 */
export type BackdropVariant = 'default' | 'blur' | 'solid';

/**
 * Backdrop opacity types
 */
export type BackdropOpacity = 'light' | 'medium' | 'dark' | 'default';

/**
 * Backdrop component props - standalone reusable backdrop/overlay
 */
export interface BackdropProps {
	isOpen: boolean;
	onClick?: (event: MouseEvent<HTMLDivElement>) => void;
	/** @default 'default' */
	variant?: BackdropVariant;
	/** @default 'default' */
	opacity?: BackdropOpacity;
	zIndex?: number;
	className?: string;
}

/**
 * Portal component props - reusable portal wrapper for rendering content outside the DOM hierarchy
 */
export interface PortalProps {
	children: ReactNode;
	container?: HTMLElement | null;
	/** If false, returns null. Useful for conditional rendering */
	enabled?: boolean;
}

/**
 * FocusTrap component props - standalone reusable focus trap wrapper
 */
export interface FocusTrapProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
	children: ReactNode;
	/** @default true */
	enabled?: boolean;
	className?: string;
}
