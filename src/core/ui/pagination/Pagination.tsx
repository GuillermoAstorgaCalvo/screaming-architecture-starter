import { ARIA_LABELS } from '@core/constants/aria';
import type { PaginationProps } from '@src-types/ui/data';

import { PaginationButtons } from './PaginationButtons';
import { getPaginationClasses } from './PaginationHelpers';
import { usePaginationButtonProps, usePaginationSetup } from './usePagination';

interface UsePaginationContentOptions {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	showFirstLast: boolean;
	showPrevNext: boolean;
	maxVisiblePages: number;
	size: 'sm' | 'md' | 'lg';
	paginationId: string | undefined;
}

function usePaginationContent(options: UsePaginationContentOptions) {
	const { id, visiblePages } = usePaginationSetup({
		currentPage: options.currentPage,
		totalPages: options.totalPages,
		maxVisiblePages: options.maxVisiblePages,
		paginationId: options.paginationId,
	});
	const buttonProps = usePaginationButtonProps({
		currentPage: options.currentPage,
		totalPages: options.totalPages,
		visiblePages,
		size: options.size,
		showFirstLast: options.showFirstLast,
		showPrevNext: options.showPrevNext,
		onPageChange: options.onPageChange,
	});
	return { id, buttonProps };
}

interface RenderPaginationNavOptions {
	id: string;
	className: string | undefined;
	buttonProps: ReturnType<typeof usePaginationButtonProps>;
	props: Omit<Readonly<PaginationProps>, keyof UsePaginationContentOptions | 'className'>;
}

function renderPaginationNav(options: RenderPaginationNavOptions) {
	return (
		<nav
			id={options.id}
			aria-label={ARIA_LABELS.PAGINATION}
			className={getPaginationClasses(options.className)}
			{...options.props}
		>
			<PaginationButtons {...options.buttonProps} />
		</nav>
	);
}

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
	...props
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
	if (totalPages <= 1) return null;
	return renderPaginationNav({ id, className, buttonProps, props });
}
