import type { HTMLAttributes, ReactNode } from 'react';

/**
 * Breadcrumb item data
 */
export interface BreadcrumbItem {
	/** Item label */
	label: ReactNode;
	/** Optional link destination */
	to?: string;
	/** Whether this is the current page @default false */
	isCurrentPage?: boolean;
}

/**
 * Breadcrumbs component props
 */
export interface BreadcrumbsProps extends HTMLAttributes<HTMLElement> {
	/** Array of breadcrumb items */
	items: readonly BreadcrumbItem[];
	/** Separator between items @default '/' */
	separator?: ReactNode;
}
