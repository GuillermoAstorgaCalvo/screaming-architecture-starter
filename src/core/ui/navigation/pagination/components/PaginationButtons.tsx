import { FirstLastButtons } from '@core/ui/navigation/pagination/components/FirstLastButtons';
import { PageNumberButtons } from '@core/ui/navigation/pagination/components/PageNumberButtons';
import { PrevNextButtons } from '@core/ui/navigation/pagination/components/PrevNextButtons';
import {
	useCommonPaginationProps,
	usePaginationHandlers,
} from '@core/ui/navigation/pagination/hooks/usePagination';
import type { StandardSize } from '@src-types/ui/base';

// ============================================================================
// Composite Button Components
// ============================================================================

export interface PaginationButtonsProps {
	currentPage: number;
	totalPages: number;
	visiblePages: number[];
	size: StandardSize;
	showFirstLast: boolean;
	showPrevNext: boolean;
	onPageChange: (page: number) => void;
}

export function PaginationButtons({
	currentPage,
	totalPages,
	visiblePages,
	size,
	showFirstLast,
	showPrevNext,
	onPageChange,
}: Readonly<PaginationButtonsProps>) {
	const handlePageChange = usePaginationHandlers({ currentPage, totalPages, onPageChange });
	const commonProps = useCommonPaginationProps({ currentPage, totalPages, size, handlePageChange });
	return (
		<>
			<FirstLastButtons {...commonProps} showFirstLast={showFirstLast} />
			<PrevNextButtons {...commonProps} showPrevNext={showPrevNext} />
			<PageNumberButtons
				visiblePages={visiblePages}
				currentPage={currentPage}
				size={size}
				onPageChange={handlePageChange}
			/>
		</>
	);
}
