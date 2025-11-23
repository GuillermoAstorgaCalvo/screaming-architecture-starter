import {
	calculateOffset,
	calculatePaginationMeta,
	type CursorPaginatedResponse,
	type CursorPaginationMeta,
	type CursorPaginationParams,
	type PaginatedResponse,
	type PaginationMeta,
	type PaginationParams,
} from '@src-types/pagination';
import { describe, expect, it } from 'vitest';

describe('pagination types', () => {
	describe('PaginationMeta', () => {
		it('should allow PaginationMeta with all properties', () => {
			const meta: PaginationMeta = {
				page: 1,
				pageSize: 10,
				total: 100,
				totalPages: 10,
				hasNext: true,
				hasPrevious: false,
			};
			expect(meta.page).toBe(1);
			expect(meta.pageSize).toBe(10);
			expect(meta.total).toBe(100);
			expect(meta.totalPages).toBe(10);
			expect(meta.hasNext).toBe(true);
			expect(meta.hasPrevious).toBe(false);
		});

		it('should allow PaginationMeta without optional properties', () => {
			const meta: PaginationMeta = {
				page: 1,
				pageSize: 10,
				total: 100,
				totalPages: 10,
			};
			expect(meta.page).toBe(1);
			expect(meta.pageSize).toBe(10);
			expect(meta.total).toBe(100);
			expect(meta.totalPages).toBe(10);
		});
	});

	describe('PaginatedResponse', () => {
		it('should allow PaginatedResponse with data and pagination', () => {
			const response: PaginatedResponse<string> = {
				data: ['item1', 'item2', 'item3'],
				pagination: {
					page: 1,
					pageSize: 10,
					total: 100,
					totalPages: 10,
				},
			};
			expect(response.data).toHaveLength(3);
			expect(response.pagination.page).toBe(1);
			expect(response.pagination.pageSize).toBe(10);
			expect(response.pagination.total).toBe(100);
			expect(response.pagination.totalPages).toBe(10);
		});
	});

	describe('PaginationParams', () => {
		it('should allow PaginationParams with all properties', () => {
			const params: PaginationParams = {
				page: 2,
				pageSize: 20,
				sortBy: 'name',
				sortOrder: 'asc',
			};
			expect(params.page).toBe(2);
			expect(params.pageSize).toBe(20);
			expect(params.sortBy).toBe('name');
			expect(params.sortOrder).toBe('asc');
		});

		it('should allow PaginationParams with minimal properties', () => {
			const params: PaginationParams = {};
			expect(params).toBeDefined();
		});
	});

	describe('CursorPaginationMeta', () => {
		it('should allow CursorPaginationMeta with all properties', () => {
			const meta: CursorPaginationMeta = {
				cursor: 'cursor123',
				hasNext: true,
				previousCursor: 'cursor122',
				pageSize: 10,
			};
			expect(meta.cursor).toBe('cursor123');
			expect(meta.hasNext).toBe(true);
			expect(meta.previousCursor).toBe('cursor122');
			expect(meta.pageSize).toBe(10);
		});

		it('should allow CursorPaginationMeta without previousCursor', () => {
			const meta: CursorPaginationMeta = {
				cursor: 'cursor123',
				hasNext: true,
				pageSize: 10,
			};
			expect(meta.cursor).toBe('cursor123');
			expect(meta.hasNext).toBe(true);
			expect(meta.pageSize).toBe(10);
		});
	});

	describe('CursorPaginatedResponse', () => {
		it('should allow CursorPaginatedResponse with data and pagination', () => {
			const response: CursorPaginatedResponse<string> = {
				data: ['item1', 'item2'],
				pagination: {
					cursor: 'cursor123',
					hasNext: true,
					pageSize: 10,
				},
			};
			expect(response.data).toHaveLength(2);
			expect(response.pagination.cursor).toBe('cursor123');
			expect(response.pagination.hasNext).toBe(true);
			expect(response.pagination.pageSize).toBe(10);
		});
	});

	describe('CursorPaginationParams', () => {
		it('should allow CursorPaginationParams with all properties', () => {
			const params: CursorPaginationParams = {
				cursor: 'cursor123',
				pageSize: 20,
			};
			expect(params.cursor).toBe('cursor123');
			expect(params.pageSize).toBe(20);
		});

		it('should allow CursorPaginationParams without cursor', () => {
			const params: CursorPaginationParams = {
				pageSize: 20,
			};
			expect(params.pageSize).toBe(20);
		});
	});

	describe('calculatePaginationMeta', () => {
		it('should calculate pagination meta correctly', () => {
			const meta = calculatePaginationMeta(1, 10, 100);
			expect(meta.page).toBe(1);
			expect(meta.pageSize).toBe(10);
			expect(meta.total).toBe(100);
			expect(meta.totalPages).toBe(10);
			expect(meta.hasNext).toBe(true);
			expect(meta.hasPrevious).toBe(false);
		});

		it('should calculate hasNext correctly', () => {
			const meta1 = calculatePaginationMeta(1, 10, 100);
			expect(meta1.hasNext).toBe(true);

			const meta2 = calculatePaginationMeta(10, 10, 100);
			expect(meta2.hasNext).toBe(false);
		});

		it('should calculate hasPrevious correctly', () => {
			const meta1 = calculatePaginationMeta(1, 10, 100);
			expect(meta1.hasPrevious).toBe(false);

			const meta2 = calculatePaginationMeta(2, 10, 100);
			expect(meta2.hasPrevious).toBe(true);
		});

		it('should handle zero total', () => {
			const meta = calculatePaginationMeta(1, 10, 0);
			expect(meta.total).toBe(0);
			expect(meta.totalPages).toBe(0);
			expect(meta.hasNext).toBe(false);
		});

		it('should sanitize negative page', () => {
			const meta = calculatePaginationMeta(-1, 10, 100);
			expect(meta.page).toBe(1);
		});

		it('should sanitize negative pageSize', () => {
			const meta = calculatePaginationMeta(1, -10, 100);
			expect(meta.pageSize).toBe(1);
		});

		it('should sanitize negative total', () => {
			const meta = calculatePaginationMeta(1, 10, -100);
			expect(meta.total).toBe(0);
		});

		it('should handle fractional values', () => {
			const meta = calculatePaginationMeta(1.5, 10.7, 100.3);
			expect(meta.page).toBe(1);
			expect(meta.pageSize).toBe(10);
			expect(meta.total).toBe(100);
		});
	});

	describe('calculateOffset', () => {
		it('should calculate offset correctly', () => {
			expect(calculateOffset(1, 10)).toBe(0);
			expect(calculateOffset(2, 10)).toBe(10);
			expect(calculateOffset(3, 10)).toBe(20);
		});

		it('should handle negative page', () => {
			expect(calculateOffset(-1, 10)).toBe(0);
		});

		it('should handle negative pageSize', () => {
			expect(calculateOffset(2, -10)).toBe(0);
		});

		it('should handle fractional values', () => {
			expect(calculateOffset(1.5, 10.7)).toBe(0);
			expect(calculateOffset(2.5, 10.7)).toBe(10);
		});
	});
});
