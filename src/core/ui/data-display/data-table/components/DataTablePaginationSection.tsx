import { useTranslation } from '@core/i18n/useTranslation';
import Pagination from '@core/ui/navigation/pagination/Pagination';
import type { StandardSize } from '@src-types/ui/base';

interface DataTablePaginationSectionProps {
	enablePagination: boolean;
	totalPages: number;
	currentPage: number;
	onPageChange: (page: number) => void;
	showPaginationInfo: boolean;
	startIndex: number;
	endIndex: number;
	totalItems: number;
	size: StandardSize;
}

/**
 * DataTablePaginationSection - Renders the pagination section with info and controls
 */
export function DataTablePaginationSection({
	enablePagination,
	totalPages,
	currentPage,
	onPageChange,
	showPaginationInfo,
	startIndex,
	endIndex,
	totalItems,
	size,
}: Readonly<DataTablePaginationSectionProps>) {
	const { t } = useTranslation('common');
	if (!enablePagination || totalPages <= 1) return null;

	return (
		<div className="flex items-center justify-between">
			{showPaginationInfo ? (
				<div className="text-sm text-text-secondary dark:text-text-secondary-dark">
					{t('pagination.showing', {
						startIndex: startIndex.toString(),
						endIndex: endIndex.toString(),
						totalItems: totalItems.toString(),
					})}
				</div>
			) : null}
			<Pagination
				currentPage={currentPage}
				totalPages={totalPages}
				onPageChange={onPageChange}
				size={size}
			/>
		</div>
	);
}
