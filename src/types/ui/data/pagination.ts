import type { StandardSize } from '@src-types/ui/base';
import type { HTMLAttributes } from 'react';

/**
 * Pagination component props
 */
export interface PaginationProps extends HTMLAttributes<HTMLDivElement> {
	/** Current page number (1-indexed) */
	currentPage: number;
	/** Total number of pages */
	totalPages: number;
	/** Function called when page changes */
	onPageChange: (page: number) => void;
	/** Whether to show first/last page buttons @default true */
	showFirstLast?: boolean;
	/** Whether to show previous/next page buttons @default true */
	showPrevNext?: boolean;
	/** Maximum number of page buttons to show @default 5 */
	maxVisiblePages?: number;
	/** Size of the pagination controls @default 'md' */
	size?: StandardSize;
	/** Optional ID for the pagination container */
	paginationId?: string;
}
