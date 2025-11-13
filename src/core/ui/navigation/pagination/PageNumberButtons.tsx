import type { StandardSize } from '@src-types/ui/base';

import { PaginationButton } from './PaginationButton';
import { createPageChangeHandler } from './PaginationHandlers';

// ============================================================================
// Page Number Button Components
// ============================================================================

export interface PageNumberButtonsProps {
	visiblePages: number[];
	currentPage: number;
	size: StandardSize;
	onPageChange: (page: number) => void;
}

export function PageNumberButtons({
	visiblePages,
	currentPage,
	size,
	onPageChange,
}: Readonly<PageNumberButtonsProps>) {
	return (
		<>
			{visiblePages.map(page => (
				<PaginationButton
					key={page}
					ariaLabel={`Go to page ${page}`}
					onClick={createPageChangeHandler(onPageChange, page)}
					isActive={page === currentPage}
					size={size}
				>
					{page}
				</PaginationButton>
			))}
		</>
	);
}
