import { useTranslation } from '@core/i18n/useTranslation';
import { PaginationButton } from '@core/ui/navigation/pagination/components/PaginationButton';
import { createPageChangeHandler } from '@core/ui/navigation/pagination/helpers/PaginationHandlers';
import type { StandardSize } from '@src-types/ui/base';

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
	const { t } = useTranslation('common');
	return (
		<>
			{visiblePages.map(page => (
				<PaginationButton
					key={page}
					ariaLabel={t('pagination.goToPage', { page: page.toString() })}
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
