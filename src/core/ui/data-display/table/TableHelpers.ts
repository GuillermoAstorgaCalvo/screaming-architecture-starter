import {
	TABLE_BASE_CLASSES,
	TABLE_CELL_BASE_CLASSES,
	TABLE_HEADER_BASE_CLASSES,
	TABLE_ROW_BASE_CLASSES,
	TABLE_ROW_HOVER_CLASSES,
	TABLE_ROW_STRIPED_CLASSES,
	TABLE_SIZE_CLASSES,
} from '@core/constants/ui/data';
import type { StandardSize } from '@src-types/ui/base';
import { twMerge } from 'tailwind-merge';

// ============================================================================
// Types
// ============================================================================

export type RowClassName<T> = string | ((row: T, index: number) => string) | undefined;

export interface RowClassOptions<T> {
	striped: boolean;
	hoverable: boolean;
	rowClassName?: RowClassName<T>;
	row: T;
	index: number;
}

// ============================================================================
// Helper Functions
// ============================================================================

export function getTableClasses(className?: string): string {
	return twMerge(TABLE_BASE_CLASSES, className);
}

export function getCellClasses(size: StandardSize): string {
	const sizeClasses = TABLE_SIZE_CLASSES[size];
	return twMerge(TABLE_CELL_BASE_CLASSES, sizeClasses);
}

export function getHeaderClasses(size: StandardSize): string {
	const sizeClasses = TABLE_SIZE_CLASSES[size];
	return twMerge(TABLE_HEADER_BASE_CLASSES, TABLE_CELL_BASE_CLASSES, sizeClasses);
}

export function getRowClasses<T>(options: RowClassOptions<T>): string {
	const { striped, hoverable, rowClassName, row, index } = options;
	const classes = [TABLE_ROW_BASE_CLASSES];
	if (striped) {
		classes.push(TABLE_ROW_STRIPED_CLASSES);
	}
	if (hoverable) {
		classes.push(TABLE_ROW_HOVER_CLASSES);
	}
	if (rowClassName) {
		const customClass =
			typeof rowClassName === 'function' ? rowClassName(row, index) : rowClassName;
		classes.push(customClass);
	}
	return twMerge(...classes);
}

export function getTableRowId<T>(
	row: T,
	index: number,
	getRowId?: ((row: T, index: number) => string) | undefined
): string {
	return getRowId?.(row, index) ?? `row-${index}`;
}
