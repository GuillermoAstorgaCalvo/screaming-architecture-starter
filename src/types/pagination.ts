/**
 * Pagination-related types
 *
 * Common types for paginated API responses and pagination controls.
 */

/**
 * Pagination metadata
 */
export interface PaginationMeta {
	/** Current page number (1-indexed) */
	page: number;
	/** Number of items per page */
	pageSize: number;
	/** Total number of items */
	total: number;
	/** Total number of pages */
	totalPages: number;
	/** Whether there is a next page */
	hasNext?: boolean;
	/** Whether there is a previous page */
	hasPrevious?: boolean;
}

/**
 * Paginated response structure
 */
export interface PaginatedResponse<T> {
	/** Array of items for the current page */
	data: T[];
	/** Pagination metadata */
	pagination: PaginationMeta;
}

/**
 * Pagination request parameters
 */
export interface PaginationParams {
	/** Page number (1-indexed, default: 1) */
	page?: number;
	/** Number of items per page (default: 10) */
	pageSize?: number;
	/** Sort field */
	sortBy?: string;
	/** Sort direction */
	sortOrder?: 'asc' | 'desc';
}

/**
 * Cursor-based pagination metadata
 */
export interface CursorPaginationMeta {
	/** Current cursor */
	cursor: string;
	/** Whether there is a next page */
	hasNext: boolean;
	/** Previous cursor (if available) */
	previousCursor?: string;
	/** Number of items per page */
	pageSize: number;
}

/**
 * Cursor-based paginated response
 */
export interface CursorPaginatedResponse<T> {
	/** Array of items */
	data: T[];
	/** Cursor pagination metadata */
	pagination: CursorPaginationMeta;
}

/**
 * Cursor-based pagination request parameters
 */
export interface CursorPaginationParams {
	/** Cursor for fetching next page */
	cursor?: string;
	/** Number of items per page */
	pageSize?: number;
}

/**
 * Calculate pagination metadata from raw values
 */
export function calculatePaginationMeta(
	page: number,
	pageSize: number,
	total: number
): PaginationMeta {
	const safePage = Math.max(1, Math.floor(page));
	const safePageSize = Math.max(1, Math.floor(pageSize));
	const safeTotal = Math.max(0, Math.floor(total));
	const totalPages = safeTotal > 0 ? Math.ceil(safeTotal / safePageSize) : 0;

	return {
		page: safePage,
		pageSize: safePageSize,
		total: safeTotal,
		totalPages,
		hasNext: safePage < totalPages,
		hasPrevious: safePage > 1,
	};
}

/**
 * Calculate offset from page and page size
 */
export function calculateOffset(page: number, pageSize: number): number {
	return (Math.max(1, page) - 1) * Math.max(1, pageSize);
}
