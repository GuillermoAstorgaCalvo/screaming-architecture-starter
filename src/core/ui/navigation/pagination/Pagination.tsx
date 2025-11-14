import { renderPaginationNav } from '@core/ui/navigation/pagination/helpers/PaginationHelpers';
import { usePaginationContent } from '@core/ui/navigation/pagination/hooks/usePagination';
import type { PaginationProps } from '@src-types/ui/data/pagination';

/**
 * Pagination - Pagination controls component with accessible navigation, size variants, and configurable page buttons.
 * @example
 * ```tsx
 * <Pagination currentPage={1} totalPages={10} onPageChange={(page) => setCurrentPage(page)} maxVisiblePages={5} />
 * ```
 */
export default function Pagination({
	currentPage,
	totalPages,
	onPageChange,
	showFirstLast = true,
	showPrevNext = true,
	maxVisiblePages = 5,
	size = 'md',
	paginationId,
	className,
	...restProps
}: Readonly<PaginationProps>) {
	const { id, buttonProps } = usePaginationContent({
		currentPage,
		totalPages,
		onPageChange,
		showFirstLast,
		showPrevNext,
		maxVisiblePages,
		size,
		paginationId,
	});

	if (totalPages <= 1) {
		return null;
	}

	return renderPaginationNav({
		id,
		className,
		buttonProps,
		restProps,
	});
}
