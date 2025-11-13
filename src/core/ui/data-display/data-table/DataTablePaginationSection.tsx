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
	if (!enablePagination || totalPages <= 1) return null;

	return (
		<div className="flex items-center justify-between">
			{showPaginationInfo ? (
				<div className="text-sm text-gray-600 dark:text-gray-400">
					Showing {startIndex} to {endIndex} of {totalItems} results
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
