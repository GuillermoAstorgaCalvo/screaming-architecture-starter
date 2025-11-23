/**
 * useDataTableColumns Tests
 *
 * Tests for the useDataTableColumns hook:
 * - Initial state setup
 * - Column width management (set, reset, reset all)
 * - Column reordering
 * - getColumnWidth function
 */

import { useDataTableColumns } from '@core/ui/data-display/data-table/hooks/useDataTableColumns';
import type { DataTableColumn } from '@src-types/ui/dataTable';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

interface TestData {
	id: string;
	name: string;
	age: number;
	email: string;
}

const createMockColumns = (): DataTableColumn<TestData>[] => [
	{
		id: 'name',
		header: 'Name',
		accessor: (row: TestData) => row.name,
		initialWidth: 200,
	},
	{
		id: 'age',
		header: 'Age',
		accessor: (row: TestData) => row.age,
		initialWidth: 100,
	},
	{
		id: 'email',
		header: 'Email',
		accessor: (row: TestData) => row.email,
		// No initialWidth
	},
];

const registerInitialStateTests = () => {
	describe('initial state', () => {
		it('should initialize with provided columns', () => {
			const columns = createMockColumns();
			const { result } = renderHook(() => useDataTableColumns({ columns }));

			expect(result.current.columns).toEqual(columns);
			expect(result.current.columns).toHaveLength(3);
		});

		it('should initialize columnWidths with initialWidth values', () => {
			const columns = createMockColumns();
			const { result } = renderHook(() => useDataTableColumns({ columns }));

			expect(result.current.columnWidths.size).toBe(2); // Only name and age have initialWidth
			expect(result.current.getColumnWidth('name')).toBe(200);
			expect(result.current.getColumnWidth('age')).toBe(100);
			expect(result.current.getColumnWidth('email')).toBeUndefined();
		});

		it('should initialize with empty columnWidths when no initialWidth provided', () => {
			const columns: DataTableColumn<TestData>[] = [
				{
					id: 'name',
					header: 'Name',
					accessor: (row: TestData) => row.name,
				},
			];
			const { result } = renderHook(() => useDataTableColumns({ columns }));

			expect(result.current.columnWidths.size).toBe(0);
			expect(result.current.getColumnWidth('name')).toBeUndefined();
		});
	});
};

const registerSetColumnWidthTests = () => {
	describe('setColumnWidth', () => {
		it('should set width for a column', () => {
			const columns = createMockColumns();
			const { result } = renderHook(() => useDataTableColumns({ columns }));

			act(() => {
				result.current.setColumnWidth('email', 300);
			});

			expect(result.current.getColumnWidth('email')).toBe(300);
		});

		it('should update existing width for a column', () => {
			const columns = createMockColumns();
			const { result } = renderHook(() => useDataTableColumns({ columns }));

			expect(result.current.getColumnWidth('name')).toBe(200);

			act(() => {
				result.current.setColumnWidth('name', 250);
			});

			expect(result.current.getColumnWidth('name')).toBe(250);
		});

		it('should set width for multiple columns', () => {
			const columns = createMockColumns();
			const { result } = renderHook(() => useDataTableColumns({ columns }));

			act(() => {
				result.current.setColumnWidth('email', 300);
				result.current.setColumnWidth('name', 250);
			});

			expect(result.current.getColumnWidth('email')).toBe(300);
			expect(result.current.getColumnWidth('name')).toBe(250);
			expect(result.current.getColumnWidth('age')).toBe(100); // Still has initial width
		});

		it('should handle setting width to 0', () => {
			const columns = createMockColumns();
			const { result } = renderHook(() => useDataTableColumns({ columns }));

			act(() => {
				result.current.setColumnWidth('name', 0);
			});

			expect(result.current.getColumnWidth('name')).toBe(0);
		});
	});
};

const registerResetColumnWidthTests = () => {
	describe('resetColumnWidth', () => {
		it('should reset column width to initialWidth', () => {
			const columns = createMockColumns();
			const { result } = renderHook(() => useDataTableColumns({ columns }));

			// Change the width
			act(() => {
				result.current.setColumnWidth('name', 300);
			});
			expect(result.current.getColumnWidth('name')).toBe(300);

			// Reset it
			act(() => {
				result.current.resetColumnWidth('name');
			});
			expect(result.current.getColumnWidth('name')).toBe(200); // Back to initialWidth
		});

		it('should remove width when column has no initialWidth', () => {
			const columns = createMockColumns();
			const { result } = renderHook(() => useDataTableColumns({ columns }));

			// Set a width for email (which has no initialWidth)
			act(() => {
				result.current.setColumnWidth('email', 300);
			});
			expect(result.current.getColumnWidth('email')).toBe(300);

			// Reset it - should remove the width
			act(() => {
				result.current.resetColumnWidth('email');
			});
			expect(result.current.getColumnWidth('email')).toBeUndefined();
		});

		it('should handle resetting column that was never modified', () => {
			const columns = createMockColumns();
			const { result } = renderHook(() => useDataTableColumns({ columns }));

			// Reset name which has initialWidth
			act(() => {
				result.current.resetColumnWidth('name');
			});
			expect(result.current.getColumnWidth('name')).toBe(200); // Still has initialWidth

			// Reset email which has no initialWidth
			act(() => {
				result.current.resetColumnWidth('email');
			});
			expect(result.current.getColumnWidth('email')).toBeUndefined();
		});
	});
};

const registerResetAllColumnWidthsTests = () => {
	describe('resetAllColumnWidths', () => {
		it('should reset all column widths to initialWidth values', () => {
			const columns = createMockColumns();
			const { result } = renderHook(() => useDataTableColumns({ columns }));

			// Modify widths
			act(() => {
				result.current.setColumnWidth('name', 300);
				result.current.setColumnWidth('age', 150);
				result.current.setColumnWidth('email', 400);
			});

			expect(result.current.getColumnWidth('name')).toBe(300);
			expect(result.current.getColumnWidth('age')).toBe(150);
			expect(result.current.getColumnWidth('email')).toBe(400);

			// Reset all
			act(() => {
				result.current.resetAllColumnWidths();
			});

			expect(result.current.getColumnWidth('name')).toBe(200); // Back to initialWidth
			expect(result.current.getColumnWidth('age')).toBe(100); // Back to initialWidth
			expect(result.current.getColumnWidth('email')).toBeUndefined(); // No initialWidth
		});

		it('should work when no columns have initialWidth', () => {
			const columns: DataTableColumn<TestData>[] = [
				{
					id: 'name',
					header: 'Name',
					accessor: (row: TestData) => row.name,
				},
			];
			const { result } = renderHook(() => useDataTableColumns({ columns }));

			act(() => {
				result.current.setColumnWidth('name', 300);
			});

			act(() => {
				result.current.resetAllColumnWidths();
			});

			expect(result.current.columnWidths.size).toBe(0);
			expect(result.current.getColumnWidth('name')).toBeUndefined();
		});
	});
};

const registerMoveColumnTests = () => {
	describe('moveColumn', () => {
		it('should move column from one position to another', () => {
			const columns = createMockColumns();
			const { result } = renderHook(() => useDataTableColumns({ columns }));

			expect(result.current.columns[0]?.id).toBe('name');
			expect(result.current.columns[1]?.id).toBe('age');
			expect(result.current.columns[2]?.id).toBe('email');

			act(() => {
				result.current.moveColumn(0, 2); // Move name to position 2
			});

			expect(result.current.columns[0]?.id).toBe('age');
			expect(result.current.columns[1]?.id).toBe('email');
			expect(result.current.columns[2]?.id).toBe('name');
		});

		it('should move column to the beginning', () => {
			const columns = createMockColumns();
			const { result } = renderHook(() => useDataTableColumns({ columns }));

			act(() => {
				result.current.moveColumn(2, 0); // Move email to beginning
			});

			expect(result.current.columns[0]?.id).toBe('email');
			expect(result.current.columns[1]?.id).toBe('name');
			expect(result.current.columns[2]?.id).toBe('age');
		});

		it('should move column to the end', () => {
			const columns = createMockColumns();
			const { result } = renderHook(() => useDataTableColumns({ columns }));

			act(() => {
				result.current.moveColumn(0, 2); // Move name to end
			});

			expect(result.current.columns[2]?.id).toBe('name');
		});

		it('should call onColumnsReorder when provided', () => {
			const columns = createMockColumns();
			const onColumnsReorder = vi.fn();
			const { result } = renderHook(() => useDataTableColumns({ columns, onColumnsReorder }));

			act(() => {
				result.current.moveColumn(0, 2);
			});

			expect(onColumnsReorder).toHaveBeenCalledTimes(1);
			expect(onColumnsReorder).toHaveBeenCalledWith(['age', 'email', 'name']);
		});

		it('should not call onColumnsReorder when not provided', () => {
			const columns = createMockColumns();
			const { result } = renderHook(() => useDataTableColumns({ columns }));

			act(() => {
				result.current.moveColumn(0, 2);
			});

			// Should not throw and should still reorder
			expect(result.current.columns[0]?.id).toBe('age');
		});

		it('should handle moving column to same position', () => {
			const columns = createMockColumns();
			const { result } = renderHook(() => useDataTableColumns({ columns }));

			const originalOrder = result.current.columns.map(c => c.id);

			act(() => {
				result.current.moveColumn(1, 1); // Move age to same position
			});

			expect(result.current.columns.map(c => c.id)).toEqual(originalOrder);
		});

		it('should preserve column widths when reordering', () => {
			const columns = createMockColumns();
			const { result } = renderHook(() => useDataTableColumns({ columns }));

			act(() => {
				result.current.setColumnWidth('name', 250);
			});

			act(() => {
				result.current.moveColumn(0, 2);
			});

			// Width should still be associated with the column ID, not position
			expect(result.current.getColumnWidth('name')).toBe(250);
		});
	});
};

const registerGetColumnWidthTests = () => {
	describe('getColumnWidth', () => {
		it('should return width for column with width set', () => {
			const columns = createMockColumns();
			const { result } = renderHook(() => useDataTableColumns({ columns }));

			act(() => {
				result.current.setColumnWidth('email', 300);
			});

			expect(result.current.getColumnWidth('email')).toBe(300);
		});

		it('should return initialWidth for column that has not been modified', () => {
			const columns = createMockColumns();
			const { result } = renderHook(() => useDataTableColumns({ columns }));

			expect(result.current.getColumnWidth('name')).toBe(200);
		});

		it('should return undefined for column with no width', () => {
			const columns = createMockColumns();
			const { result } = renderHook(() => useDataTableColumns({ columns }));

			expect(result.current.getColumnWidth('email')).toBeUndefined();
		});

		it('should return undefined for non-existent column', () => {
			const columns = createMockColumns();
			const { result } = renderHook(() => useDataTableColumns({ columns }));

			expect(result.current.getColumnWidth('nonexistent')).toBeUndefined();
		});
	});
};

const registerCombinedOperationsTests = () => {
	describe('combined operations', () => {
		it('should handle multiple width changes and resets', () => {
			const columns = createMockColumns();
			const { result } = renderHook(() => useDataTableColumns({ columns }));

			// Set multiple widths
			act(() => {
				result.current.setColumnWidth('name', 250);
				result.current.setColumnWidth('age', 150);
				result.current.setColumnWidth('email', 300);
			});

			expect(result.current.getColumnWidth('name')).toBe(250);
			expect(result.current.getColumnWidth('age')).toBe(150);
			expect(result.current.getColumnWidth('email')).toBe(300);

			// Reset one
			act(() => {
				result.current.resetColumnWidth('name');
			});

			expect(result.current.getColumnWidth('name')).toBe(200); // Back to initial
			expect(result.current.getColumnWidth('age')).toBe(150); // Still modified
			expect(result.current.getColumnWidth('email')).toBe(300); // Still modified

			// Reset all
			act(() => {
				result.current.resetAllColumnWidths();
			});

			expect(result.current.getColumnWidth('name')).toBe(200);
			expect(result.current.getColumnWidth('age')).toBe(100);
			expect(result.current.getColumnWidth('email')).toBeUndefined();
		});

		it('should handle reordering and width changes together', () => {
			const columns = createMockColumns();
			const { result } = renderHook(() => useDataTableColumns({ columns }));

			act(() => {
				result.current.setColumnWidth('name', 250);
				result.current.moveColumn(0, 2);
			});

			expect(result.current.columns[2]?.id).toBe('name');
			expect(result.current.getColumnWidth('name')).toBe(250);
		});

		it('should maintain function references across renders', () => {
			const columns = createMockColumns();
			const { result, rerender } = renderHook(() => useDataTableColumns({ columns }));

			const {
				setColumnWidth: setWidth1,
				resetColumnWidth: resetWidth1,
				resetAllColumnWidths: resetAll1,
				moveColumn: move1,
				getColumnWidth: getWidth1,
			} = result.current;

			rerender();

			const {
				setColumnWidth: setWidth2,
				resetColumnWidth: resetWidth2,
				resetAllColumnWidths: resetAll2,
				moveColumn: move2,
				getColumnWidth: getWidth2,
			} = result.current;

			// Functions should be stable (memoized with useCallback)
			expect(setWidth1).toBe(setWidth2);
			expect(resetWidth1).toBe(resetWidth2);
			expect(resetAll1).toBe(resetAll2);
			expect(move1).toBe(move2);
			expect(getWidth1).toBe(getWidth2);
		});
	});
};

const registerEdgeCasesTests = () => {
	describe('edge cases', () => {
		it('should handle empty columns array', () => {
			const columns: DataTableColumn<TestData>[] = [];
			const { result } = renderHook(() => useDataTableColumns({ columns }));

			expect(result.current.columns).toEqual([]);
			expect(result.current.columnWidths.size).toBe(0);
		});

		it('should handle single column', () => {
			const columns: DataTableColumn<TestData>[] = [
				{
					id: 'name',
					header: 'Name',
					accessor: (row: TestData) => row.name,
					initialWidth: 200,
				},
			];
			const { result } = renderHook(() => useDataTableColumns({ columns }));

			expect(result.current.columns).toHaveLength(1);
			expect(result.current.getColumnWidth('name')).toBe(200);

			act(() => {
				result.current.setColumnWidth('name', 300);
			});

			expect(result.current.getColumnWidth('name')).toBe(300);
		});

		it('should handle rapid width changes', () => {
			const columns = createMockColumns();
			const { result } = renderHook(() => useDataTableColumns({ columns }));

			act(() => {
				for (let i = 0; i < 10; i++) {
					result.current.setColumnWidth('name', 200 + i * 10);
				}
			});

			expect(result.current.getColumnWidth('name')).toBe(290);
		});

		it('should handle moving column with invalid indices gracefully', () => {
			const columns = createMockColumns();
			const { result } = renderHook(() => useDataTableColumns({ columns }));

			const originalOrder = result.current.columns.map(c => c.id);

			// Try to move from invalid index - should handle gracefully
			act(() => {
				result.current.moveColumn(10, 0); // Invalid fromIndex
			});

			// Should not crash, order might be unchanged or handled by splice
			expect(result.current.columns.length).toBe(3);
		});

		it('should handle columns prop changes', () => {
			const initialColumns = createMockColumns();
			const { result, rerender } = renderHook(({ columns }) => useDataTableColumns({ columns }), {
				initialProps: { columns: initialColumns },
			});

			expect(result.current.columns).toEqual(initialColumns);

			const newColumns: DataTableColumn<TestData>[] = [
				{
					id: 'newColumn',
					header: 'New Column',
					accessor: (row: TestData) => row.name,
					initialWidth: 150,
				},
			];

			rerender({ columns: newColumns });

			// Hook should maintain its internal state, not update from props
			// This tests that useState initializes once
			expect(result.current.columns).toEqual(initialColumns);
		});

		it('should handle resetColumnWidth for column that does not exist in current columns', () => {
			const columns = createMockColumns();
			const { result } = renderHook(() => useDataTableColumns({ columns }));

			// Set a width for a non-existent column
			act(() => {
				result.current.setColumnWidth('nonexistent', 500);
			});

			expect(result.current.getColumnWidth('nonexistent')).toBe(500);

			// Reset it - should remove since it has no initialWidth
			act(() => {
				result.current.resetColumnWidth('nonexistent');
			});

			expect(result.current.getColumnWidth('nonexistent')).toBeUndefined();
		});
	});
};

describe('useDataTableColumns', () => {
	registerInitialStateTests();
	registerSetColumnWidthTests();
	registerResetColumnWidthTests();
	registerResetAllColumnWidthsTests();
	registerMoveColumnTests();
	registerGetColumnWidthTests();
	registerCombinedOperationsTests();
	registerEdgeCasesTests();
});
