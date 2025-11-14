import {
	getVisiblePages,
	usePaginationId,
} from '@core/ui/navigation/pagination/helpers/PaginationHelpers';
import type { StandardSize } from '@src-types/ui/base';
import { useCallback, useMemo } from 'react';

export interface UsePaginationHandlersOptions {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

export function usePaginationHandlers(options: UsePaginationHandlersOptions) {
	const { currentPage, totalPages, onPageChange } = options;
	return useCallback(
		(page: number) => {
			if (page >= 1 && page <= totalPages && page !== currentPage) onPageChange(page);
		},
		[currentPage, totalPages, onPageChange]
	);
}

export interface UseCommonPaginationPropsOptions {
	currentPage: number;
	totalPages: number;
	size: StandardSize;
	handlePageChange: (page: number) => void;
}

export function useCommonPaginationProps(options: UseCommonPaginationPropsOptions) {
	const { currentPage, totalPages, size, handlePageChange } = options;
	return useMemo(
		() => ({ currentPage, totalPages, size, onPageChange: handlePageChange }),
		[currentPage, totalPages, size, handlePageChange]
	);
}

export interface UsePaginationSetupOptions {
	currentPage: number;
	totalPages: number;
	maxVisiblePages: number;
	paginationId: string | undefined;
}

export function usePaginationSetup(options: UsePaginationSetupOptions) {
	const { currentPage, totalPages, maxVisiblePages, paginationId } = options;
	const id = usePaginationId(paginationId);
	const visiblePages = useMemo(
		() => getVisiblePages(currentPage, totalPages, maxVisiblePages),
		[currentPage, totalPages, maxVisiblePages]
	);
	return { id, visiblePages };
}

export interface UsePaginationButtonPropsOptions {
	currentPage: number;
	totalPages: number;
	visiblePages: number[];
	size: StandardSize;
	showFirstLast: boolean;
	showPrevNext: boolean;
	onPageChange: (page: number) => void;
}

export function usePaginationButtonProps(options: UsePaginationButtonPropsOptions) {
	const { currentPage, totalPages, visiblePages, size, showFirstLast, showPrevNext, onPageChange } =
		options;
	return useMemo(
		() => ({
			currentPage,
			totalPages,
			visiblePages,
			size,
			showFirstLast,
			showPrevNext,
			onPageChange,
		}),
		[currentPage, totalPages, visiblePages, size, showFirstLast, showPrevNext, onPageChange]
	);
}

export interface UsePaginationContentOptions {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	showFirstLast: boolean;
	showPrevNext: boolean;
	maxVisiblePages: number;
	size: StandardSize;
	paginationId: string | undefined;
}

/**
 * Custom hook that combines pagination setup and button props
 */
export function usePaginationContent(options: UsePaginationContentOptions) {
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
