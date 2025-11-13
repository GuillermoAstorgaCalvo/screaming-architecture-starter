import type { StandardSize } from '@src-types/ui/base';
import type { HTMLAttributes, ReactNode } from 'react';

/**
 * DescriptionList orientation types
 */
export type DescriptionListOrientation = 'horizontal' | 'vertical';

/**
 * DescriptionList component props
 */
export interface DescriptionListProps extends HTMLAttributes<HTMLDListElement> {
	/** Orientation of the list @default 'horizontal' */
	orientation?: DescriptionListOrientation;
	/** Size of the list @default 'md' */
	size?: StandardSize;
	/** Whether to show dividers between items @default false */
	divided?: boolean;
	/** DescriptionList content (DescriptionTerm and DescriptionDetails components) */
	children: ReactNode;
}

/**
 * DescriptionTerm component props
 */
export interface DescriptionTermProps extends HTMLAttributes<HTMLElement> {
	/** Term content */
	children: ReactNode;
}

/**
 * DescriptionDetails component props
 */
export interface DescriptionDetailsProps extends HTMLAttributes<HTMLElement> {
	/** Details content */
	children: ReactNode;
}
