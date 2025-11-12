import { useCallback, useMemo, useState } from 'react';

export interface UseDataTablePaginationOptions {
	initialPage?: number;
	pageSize?: number;
	totalItems: number;
	onPageChange?: (page: number) => void;
}

export interface UseDataTablePaginationReturn {
	currentPage: number;
	pageSize: number;
	totalPages: number;
	setPage: (page: number) => void;
	nextPage: () => void;
	previousPage: () => void;
	firstPage: () => void;
	lastPage: () => void;
	paginatedData: <T>(data: T[]) => T[];
	startIndex: number;
	endIndex: number;
	totalItems: number;
}

function createPaginatedData<T>(data: T[], currentPage: number, pageSize: number): T[] {
	const start = (currentPage - 1) * pageSize;
	return data.slice(start, start + pageSize);
}

function clampPage(page: number, totalPages: number): number {
	return Math.max(1, Math.min(page, totalPages));
}

function calculateTotalPages(totalItems: number, pageSize: number): number {
	return Math.max(1, Math.ceil(totalItems / pageSize));
}

function calculatePaginationIndices(currentPage: number, pageSize: number, totalItems: number) {
	return {
		startIndex: (currentPage - 1) * pageSize + 1,
		endIndex: Math.min(currentPage * pageSize, totalItems),
	};
}

function createNavigationHandlers(
	currentPage: number,
	totalPages: number,
	setPage: (page: number) => void
) {
	return {
		nextPage: () => currentPage < totalPages && setPage(currentPage + 1),
		previousPage: () => currentPage > 1 && setPage(currentPage - 1),
		firstPage: () => setPage(1),
		lastPage: () => setPage(totalPages),
	};
}

function usePageState(
	initialPage: number,
	totalPages: number,
	onPageChange?: (page: number) => void
) {
	const [currentPage, setCurrentPage] = useState(initialPage);
	const setPage = useCallback(
		(page: number) => {
			const clampedPage = clampPage(page, totalPages);
			setCurrentPage(clampedPage);
			onPageChange?.(clampedPage);
		},
		[totalPages, onPageChange]
	);
	return { currentPage, setPage };
}

function usePaginationIndices(currentPage: number, pageSize: number, totalItems: number) {
	return useMemo(
		() => calculatePaginationIndices(currentPage, pageSize, totalItems),
		[currentPage, pageSize, totalItems]
	);
}

function usePaginationData(currentPage: number, pageSize: number) {
	return useCallback(
		<T>(data: T[]) => createPaginatedData(data, currentPage, pageSize),
		[currentPage, pageSize]
	);
}

/**
 * Hook for managing DataTable pagination state
 */
export function useDataTablePagination({
	initialPage = 1,
	pageSize = 10,
	totalItems,
	onPageChange,
}: UseDataTablePaginationOptions): UseDataTablePaginationReturn {
	const totalPages = useMemo(
		() => calculateTotalPages(totalItems, pageSize),
		[totalItems, pageSize]
	);
	const { currentPage, setPage } = usePageState(initialPage, totalPages, onPageChange);
	const { nextPage, previousPage, firstPage, lastPage } = useMemo(
		() => createNavigationHandlers(currentPage, totalPages, setPage),
		[currentPage, totalPages, setPage]
	);
	const paginatedData = usePaginationData(currentPage, pageSize);
	const { startIndex, endIndex } = usePaginationIndices(currentPage, pageSize, totalItems);
	return {
		currentPage,
		pageSize,
		totalPages,
		setPage,
		nextPage,
		previousPage,
		firstPage,
		lastPage,
		paginatedData,
		startIndex,
		endIndex,
		totalItems,
	};
}
