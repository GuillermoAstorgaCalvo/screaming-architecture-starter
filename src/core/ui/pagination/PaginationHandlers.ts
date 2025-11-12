// ============================================================================
// Pagination Handler Functions
// ============================================================================

/**
 * Creates a page change handler for a specific target page
 */
export function createPageChangeHandler(onPageChange: (page: number) => void, targetPage: number) {
	return () => onPageChange(targetPage);
}

/**
 * Creates a handler for navigating to the previous page
 */
export function createPreviousPageHandler(
	onPageChange: (page: number) => void,
	currentPage: number
) {
	return () => onPageChange(currentPage - 1);
}

/**
 * Creates a handler for navigating to the next page
 */
export function createNextPageHandler(onPageChange: (page: number) => void, currentPage: number) {
	return () => onPageChange(currentPage + 1);
}
