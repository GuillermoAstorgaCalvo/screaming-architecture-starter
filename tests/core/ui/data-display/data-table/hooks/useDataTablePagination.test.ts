/**
 * useDataTablePagination Tests
 *
 * Tests for the useDataTablePagination hook:
 * - Initial state setup
 * - Page navigation (next, previous, first, last)
 * - Page setting
 * - Pagination data transformation
 * - Pagination indices calculation
 */

import { useDataTablePagination } from '@core/ui/data-display/data-table/hooks/useDataTablePagination';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

interface TestData {
	id: string;
	name: string;
}

const createMockData = (count: number): TestData[] => {
	return Array.from({ length: count }, (_, i) => ({
		id: `item-${i + 1}`,
		name: `Item ${i + 1}`,
	}));
};

describe('useDataTablePagination', () => {
	describe('initial state', () => {
		it('should initialize with default values', () => {
			const { result } = renderHook(() => useDataTablePagination({ totalItems: 100 }));

			expect(result.current.currentPage).toBe(1);
			expect(result.current.pageSize).toBe(10);
			expect(result.current.totalPages).toBe(10);
			expect(result.current.totalItems).toBe(100);
		});

		it('should initialize with provided initialPage', () => {
			const { result } = renderHook(() =>
				useDataTablePagination({ totalItems: 100, initialPage: 3 })
			);

			expect(result.current.currentPage).toBe(3);
		});

		it('should initialize with provided pageSize', () => {
			const { result } = renderHook(() =>
				useDataTablePagination({ totalItems: 100, pageSize: 20 })
			);

			expect(result.current.pageSize).toBe(20);
			expect(result.current.totalPages).toBe(5);
		});

		it('should calculate totalPages correctly', () => {
			const { result } = renderHook(() => useDataTablePagination({ totalItems: 25, pageSize: 10 }));

			expect(result.current.totalPages).toBe(3); // Math.ceil(25/10) = 3
		});

		it('should handle totalItems less than pageSize', () => {
			const { result } = renderHook(() => useDataTablePagination({ totalItems: 5, pageSize: 10 }));

			expect(result.current.totalPages).toBe(1);
		});

		it('should calculate pagination indices correctly', () => {
			const { result } = renderHook(() =>
				useDataTablePagination({ totalItems: 100, pageSize: 10, initialPage: 1 })
			);

			expect(result.current.startIndex).toBe(1);
			expect(result.current.endIndex).toBe(10);
		});

		it('should calculate pagination indices for last page', () => {
			const { result } = renderHook(() =>
				useDataTablePagination({ totalItems: 95, pageSize: 10, initialPage: 10 })
			);

			expect(result.current.startIndex).toBe(91);
			expect(result.current.endIndex).toBe(95);
		});
	});

	describe('setPage', () => {
		it('should set page to specified value', () => {
			const { result } = renderHook(() =>
				useDataTablePagination({ totalItems: 100, pageSize: 10 })
			);

			act(() => {
				result.current.setPage(3);
			});

			expect(result.current.currentPage).toBe(3);
		});

		it('should clamp page to valid range', () => {
			const { result } = renderHook(() =>
				useDataTablePagination({ totalItems: 100, pageSize: 10 })
			);

			act(() => {
				result.current.setPage(0);
			});
			expect(result.current.currentPage).toBe(1);

			act(() => {
				result.current.setPage(20);
			});
			expect(result.current.currentPage).toBe(10); // Max page is 10
		});

		it('should update pagination indices when page changes', () => {
			const { result } = renderHook(() =>
				useDataTablePagination({ totalItems: 100, pageSize: 10 })
			);

			act(() => {
				result.current.setPage(2);
			});

			expect(result.current.startIndex).toBe(11);
			expect(result.current.endIndex).toBe(20);
		});

		it('should call onPageChange when provided', () => {
			const onPageChange = vi.fn();
			const { result } = renderHook(() =>
				useDataTablePagination({ totalItems: 100, pageSize: 10, onPageChange })
			);

			act(() => {
				result.current.setPage(3);
			});

			expect(onPageChange).toHaveBeenCalledTimes(1);
			expect(onPageChange).toHaveBeenCalledWith(3);
		});

		it('should call onPageChange with clamped value when page is out of range', () => {
			const onPageChange = vi.fn();
			const { result } = renderHook(() =>
				useDataTablePagination({ totalItems: 100, pageSize: 10, onPageChange })
			);

			act(() => {
				result.current.setPage(20);
			});

			expect(onPageChange).toHaveBeenCalledWith(10);
		});
	});

	describe('nextPage', () => {
		it('should move to next page', () => {
			const { result } = renderHook(() =>
				useDataTablePagination({ totalItems: 100, pageSize: 10, initialPage: 1 })
			);

			act(() => {
				result.current.nextPage();
			});

			expect(result.current.currentPage).toBe(2);
		});

		it('should not move beyond last page', () => {
			const { result } = renderHook(() =>
				useDataTablePagination({ totalItems: 100, pageSize: 10, initialPage: 10 })
			);

			act(() => {
				result.current.nextPage();
			});

			expect(result.current.currentPage).toBe(10);
		});

		it('should call onPageChange when moving to next page', () => {
			const onPageChange = vi.fn();
			const { result } = renderHook(() =>
				useDataTablePagination({
					totalItems: 100,
					pageSize: 10,
					initialPage: 1,
					onPageChange,
				})
			);

			act(() => {
				result.current.nextPage();
			});

			expect(onPageChange).toHaveBeenCalledWith(2);
		});

		it('should not call onPageChange when already on last page', () => {
			const onPageChange = vi.fn();
			const { result } = renderHook(() =>
				useDataTablePagination({
					totalItems: 100,
					pageSize: 10,
					initialPage: 10,
					onPageChange,
				})
			);

			act(() => {
				result.current.nextPage();
			});

			expect(onPageChange).not.toHaveBeenCalled();
		});
	});

	describe('previousPage', () => {
		it('should move to previous page', () => {
			const { result } = renderHook(() =>
				useDataTablePagination({ totalItems: 100, pageSize: 10, initialPage: 3 })
			);

			act(() => {
				result.current.previousPage();
			});

			expect(result.current.currentPage).toBe(2);
		});

		it('should not move before first page', () => {
			const { result } = renderHook(() =>
				useDataTablePagination({ totalItems: 100, pageSize: 10, initialPage: 1 })
			);

			act(() => {
				result.current.previousPage();
			});

			expect(result.current.currentPage).toBe(1);
		});

		it('should call onPageChange when moving to previous page', () => {
			const onPageChange = vi.fn();
			const { result } = renderHook(() =>
				useDataTablePagination({
					totalItems: 100,
					pageSize: 10,
					initialPage: 3,
					onPageChange,
				})
			);

			act(() => {
				result.current.previousPage();
			});

			expect(onPageChange).toHaveBeenCalledWith(2);
		});

		it('should not call onPageChange when already on first page', () => {
			const onPageChange = vi.fn();
			const { result } = renderHook(() =>
				useDataTablePagination({
					totalItems: 100,
					pageSize: 10,
					initialPage: 1,
					onPageChange,
				})
			);

			act(() => {
				result.current.previousPage();
			});

			expect(onPageChange).not.toHaveBeenCalled();
		});
	});

	describe('firstPage', () => {
		it('should move to first page', () => {
			const { result } = renderHook(() =>
				useDataTablePagination({ totalItems: 100, pageSize: 10, initialPage: 5 })
			);

			act(() => {
				result.current.firstPage();
			});

			expect(result.current.currentPage).toBe(1);
		});

		it('should call onPageChange when moving to first page', () => {
			const onPageChange = vi.fn();
			const { result } = renderHook(() =>
				useDataTablePagination({
					totalItems: 100,
					pageSize: 10,
					initialPage: 5,
					onPageChange,
				})
			);

			act(() => {
				result.current.firstPage();
			});

			expect(onPageChange).toHaveBeenCalledWith(1);
		});

		it('should call onPageChange even when already on first page', () => {
			const onPageChange = vi.fn();
			const { result } = renderHook(() =>
				useDataTablePagination({
					totalItems: 100,
					pageSize: 10,
					initialPage: 1,
					onPageChange,
				})
			);

			act(() => {
				result.current.firstPage();
			});

			expect(onPageChange).toHaveBeenCalledWith(1);
		});
	});

	describe('lastPage', () => {
		it('should move to last page', () => {
			const { result } = renderHook(() =>
				useDataTablePagination({ totalItems: 100, pageSize: 10, initialPage: 1 })
			);

			act(() => {
				result.current.lastPage();
			});

			expect(result.current.currentPage).toBe(10);
		});

		it('should call onPageChange when moving to last page', () => {
			const onPageChange = vi.fn();
			const { result } = renderHook(() =>
				useDataTablePagination({
					totalItems: 100,
					pageSize: 10,
					initialPage: 1,
					onPageChange,
				})
			);

			act(() => {
				result.current.lastPage();
			});

			expect(onPageChange).toHaveBeenCalledWith(10);
		});

		it('should call onPageChange even when already on last page', () => {
			const onPageChange = vi.fn();
			const { result } = renderHook(() =>
				useDataTablePagination({
					totalItems: 100,
					pageSize: 10,
					initialPage: 10,
					onPageChange,
				})
			);

			act(() => {
				result.current.lastPage();
			});

			expect(onPageChange).toHaveBeenCalledWith(10);
		});
	});

	describe('paginatedData', () => {
		it('should return paginated data for first page', () => {
			const data = createMockData(25);
			const { result } = renderHook(() =>
				useDataTablePagination({ totalItems: 25, pageSize: 10, initialPage: 1 })
			);

			const paginated = result.current.paginatedData(data);

			expect(paginated).toHaveLength(10);
			expect(paginated[0]?.id).toBe('item-1');
			expect(paginated[9]?.id).toBe('item-10');
		});

		it('should return paginated data for middle page', () => {
			const data = createMockData(25);
			const { result } = renderHook(() =>
				useDataTablePagination({ totalItems: 25, pageSize: 10, initialPage: 2 })
			);

			const paginated = result.current.paginatedData(data);

			expect(paginated).toHaveLength(10);
			expect(paginated[0]?.id).toBe('item-11');
			expect(paginated[9]?.id).toBe('item-20');
		});

		it('should return paginated data for last page', () => {
			const data = createMockData(25);
			const { result } = renderHook(() =>
				useDataTablePagination({ totalItems: 25, pageSize: 10, initialPage: 3 })
			);

			const paginated = result.current.paginatedData(data);

			expect(paginated).toHaveLength(5);
			expect(paginated[0]?.id).toBe('item-21');
			expect(paginated[4]?.id).toBe('item-25');
		});

		it('should update paginated data when page changes', () => {
			const data = createMockData(25);
			const { result } = renderHook(() =>
				useDataTablePagination({ totalItems: 25, pageSize: 10, initialPage: 1 })
			);

			let paginated = result.current.paginatedData(data);
			expect(paginated[0]?.id).toBe('item-1');

			act(() => {
				result.current.setPage(2);
			});

			paginated = result.current.paginatedData(data);
			expect(paginated[0]?.id).toBe('item-11');
		});

		it('should handle empty data array', () => {
			const data: TestData[] = [];
			const { result } = renderHook(() => useDataTablePagination({ totalItems: 0, pageSize: 10 }));

			const paginated = result.current.paginatedData(data);

			expect(paginated).toHaveLength(0);
		});

		it('should handle data smaller than page size', () => {
			const data = createMockData(5);
			const { result } = renderHook(() => useDataTablePagination({ totalItems: 5, pageSize: 10 }));

			const paginated = result.current.paginatedData(data);

			expect(paginated).toHaveLength(5);
		});
	});

	describe('pagination indices', () => {
		it('should calculate correct indices for first page', () => {
			const { result } = renderHook(() =>
				useDataTablePagination({ totalItems: 100, pageSize: 10, initialPage: 1 })
			);

			expect(result.current.startIndex).toBe(1);
			expect(result.current.endIndex).toBe(10);
		});

		it('should calculate correct indices for middle page', () => {
			const { result } = renderHook(() =>
				useDataTablePagination({ totalItems: 100, pageSize: 10, initialPage: 5 })
			);

			expect(result.current.startIndex).toBe(41);
			expect(result.current.endIndex).toBe(50);
		});

		it('should calculate correct indices for last page', () => {
			const { result } = renderHook(() =>
				useDataTablePagination({ totalItems: 95, pageSize: 10, initialPage: 10 })
			);

			expect(result.current.startIndex).toBe(91);
			expect(result.current.endIndex).toBe(95);
		});

		it('should update indices when page changes', () => {
			const { result } = renderHook(() =>
				useDataTablePagination({ totalItems: 100, pageSize: 10, initialPage: 1 })
			);

			expect(result.current.startIndex).toBe(1);
			expect(result.current.endIndex).toBe(10);

			act(() => {
				result.current.setPage(3);
			});

			expect(result.current.startIndex).toBe(21);
			expect(result.current.endIndex).toBe(30);
		});

		it('should handle totalItems less than pageSize', () => {
			const { result } = renderHook(() => useDataTablePagination({ totalItems: 5, pageSize: 10 }));

			expect(result.current.startIndex).toBe(1);
			expect(result.current.endIndex).toBe(5);
		});
	});

	describe('edge cases', () => {
		it('should handle zero totalItems', () => {
			const { result } = renderHook(() => useDataTablePagination({ totalItems: 0, pageSize: 10 }));

			expect(result.current.totalPages).toBe(1);
			expect(result.current.currentPage).toBe(1);
			expect(result.current.startIndex).toBe(1);
			expect(result.current.endIndex).toBe(0);
		});

		it('should handle very large totalItems', () => {
			const { result } = renderHook(() =>
				useDataTablePagination({ totalItems: 1000000, pageSize: 100 })
			);

			expect(result.current.totalPages).toBe(10000);
		});

		it('should handle pageSize of 1', () => {
			const { result } = renderHook(() => useDataTablePagination({ totalItems: 10, pageSize: 1 }));

			expect(result.current.totalPages).toBe(10);
			expect(result.current.startIndex).toBe(1);
			expect(result.current.endIndex).toBe(1);
		});

		it('should handle pageSize larger than totalItems', () => {
			const { result } = renderHook(() => useDataTablePagination({ totalItems: 5, pageSize: 100 }));

			expect(result.current.totalPages).toBe(1);
			expect(result.current.startIndex).toBe(1);
			expect(result.current.endIndex).toBe(5);
		});

		it('should maintain stable function references', () => {
			const { result, rerender } = renderHook(() =>
				useDataTablePagination({ totalItems: 100, pageSize: 10 })
			);

			const { setPage, nextPage, previousPage, firstPage, lastPage, paginatedData } =
				result.current;

			rerender();

			expect(result.current.setPage).toBe(setPage);
			expect(result.current.nextPage).toBe(nextPage);
			expect(result.current.previousPage).toBe(previousPage);
			expect(result.current.firstPage).toBe(firstPage);
			expect(result.current.lastPage).toBe(lastPage);
			expect(result.current.paginatedData).toBe(paginatedData);
		});
	});
});
