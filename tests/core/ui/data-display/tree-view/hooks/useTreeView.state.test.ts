/**
 * Tests for useTreeView.state hooks
 *
 * Tests state management hooks:
 * - useSelectionState (uncontrolled and controlled modes)
 * - useExpansionState (uncontrolled and controlled modes)
 */

import {
	useExpansionState,
	useSelectionState,
} from '@core/ui/data-display/tree-view/hooks/useTreeView.state';
import type { TreeNode } from '@src-types/ui/navigation/treeView';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

// Test data
const createMockNode = (id: string, overrides?: Partial<TreeNode>): TreeNode => ({
	id,
	label: `Node ${id}`,
	...overrides,
});

const mockNodes: readonly TreeNode[] = [
	createMockNode('node-1', { defaultExpanded: true, defaultSelected: true }),
	createMockNode('node-2'),
	createMockNode('node-3', {
		children: [createMockNode('node-3-1', { defaultSelected: true }), createMockNode('node-3-2')],
	}),
] as const;

const mockNodesWithoutDefaults: readonly TreeNode[] = [
	createMockNode('node-1'),
	createMockNode('node-2'),
	createMockNode('node-3', {
		children: [createMockNode('node-3-1'), createMockNode('node-3-2')],
	}),
] as const;

describe('useSelectionState', () => {
	describe('uncontrolled mode', () => {
		it('should initialize with empty selection when no defaults provided', () => {
			const { result } = renderHook(() =>
				useSelectionState({
					selectionMode: 'multiple',
					nodes: mockNodesWithoutDefaults,
				})
			);

			expect(result.current.selectedNodeIds.size).toBe(0);
			expect(result.current.isSelected('node-1')).toBe(false);
			expect(result.current.isSelected('node-2')).toBe(false);
		});

		it('should initialize with defaultSelectedIds', () => {
			const { result } = renderHook(() =>
				useSelectionState({
					selectionMode: 'multiple',
					nodes: mockNodesWithoutDefaults,
					defaultSelectedIds: ['node-1', 'node-2'],
				})
			);

			expect(result.current.selectedNodeIds.size).toBe(2);
			expect(result.current.isSelected('node-1')).toBe(true);
			expect(result.current.isSelected('node-2')).toBe(true);
			expect(result.current.isSelected('node-3')).toBe(false);
		});

		it('should initialize with nodes that have defaultSelected property', () => {
			const { result } = renderHook(() =>
				useSelectionState({
					selectionMode: 'multiple',
					nodes: mockNodes,
				})
			);

			expect(result.current.selectedNodeIds.has('node-1')).toBe(true);
			expect(result.current.selectedNodeIds.has('node-3-1')).toBe(true);
			expect(result.current.isSelected('node-1')).toBe(true);
			expect(result.current.isSelected('node-3-1')).toBe(true);
		});

		it('should combine defaultSelectedIds and nodes with defaultSelected', () => {
			const { result } = renderHook(() =>
				useSelectionState({
					selectionMode: 'multiple',
					nodes: mockNodes,
					defaultSelectedIds: ['node-2'],
				})
			);

			expect(result.current.selectedNodeIds.has('node-1')).toBe(true);
			expect(result.current.selectedNodeIds.has('node-2')).toBe(true);
			expect(result.current.selectedNodeIds.has('node-3-1')).toBe(true);
		});

		it('should update internal state when selection changes', () => {
			const { result } = renderHook(() =>
				useSelectionState({
					selectionMode: 'multiple',
					nodes: mockNodesWithoutDefaults,
				})
			);

			act(() => {
				result.current.selectNode('node-1');
			});

			expect(result.current.isSelected('node-1')).toBe(true);
			expect(result.current.selectedNodeIds.size).toBe(1);
		});

		it('should call onSelectionChange callback when selection changes', () => {
			const onSelectionChange = vi.fn();
			const { result } = renderHook(() =>
				useSelectionState({
					selectionMode: 'multiple',
					nodes: mockNodesWithoutDefaults,
					onSelectionChange,
				})
			);

			act(() => {
				result.current.selectNode('node-1');
			});

			expect(onSelectionChange).toHaveBeenCalledWith(['node-1']);
		});
	});

	describe('controlled mode', () => {
		it('should use controlledSelectedIds when provided', () => {
			const { result } = renderHook(() =>
				useSelectionState({
					selectionMode: 'multiple',
					nodes: mockNodes,
					controlledSelectedIds: ['node-1', 'node-2'],
				})
			);

			expect(result.current.selectedNodeIds.size).toBe(2);
			expect(result.current.isSelected('node-1')).toBe(true);
			expect(result.current.isSelected('node-2')).toBe(true);
			expect(result.current.isSelected('node-3')).toBe(false);
		});

		it('should update when controlledSelectedIds changes', () => {
			const { result, rerender } = renderHook(
				({ controlledSelectedIds }) =>
					useSelectionState({
						selectionMode: 'multiple',
						nodes: mockNodes,
						controlledSelectedIds,
					}),
				{
					initialProps: { controlledSelectedIds: ['node-1'] },
				}
			);

			expect(result.current.isSelected('node-1')).toBe(true);
			expect(result.current.isSelected('node-2')).toBe(false);

			rerender({ controlledSelectedIds: ['node-2', 'node-3'] });

			expect(result.current.isSelected('node-1')).toBe(false);
			expect(result.current.isSelected('node-2')).toBe(true);
			expect(result.current.isSelected('node-3')).toBe(true);
		});

		it('should not update internal state in controlled mode', () => {
			const onSelectionChange = vi.fn();
			const { result } = renderHook(() =>
				useSelectionState({
					selectionMode: 'multiple',
					nodes: mockNodesWithoutDefaults,
					controlledSelectedIds: ['node-1'],
					onSelectionChange,
				})
			);

			act(() => {
				result.current.selectNode('node-2');
			});

			// Internal state should not change, but callback should be called
			// In single mode, it would clear node-1, but in multiple mode it adds node-2
			expect(result.current.selectedNodeIds.has('node-1')).toBe(true);
			expect(onSelectionChange).toHaveBeenCalledWith(['node-1', 'node-2']);
		});
	});

	describe('isSelected', () => {
		it('should return true for selected nodes', () => {
			const { result } = renderHook(() =>
				useSelectionState({
					selectionMode: 'multiple',
					nodes: mockNodes,
					defaultSelectedIds: ['node-1'],
				})
			);

			expect(result.current.isSelected('node-1')).toBe(true);
			expect(result.current.isSelected('node-2')).toBe(false);
		});

		it('should return false for non-existent nodes', () => {
			const { result } = renderHook(() =>
				useSelectionState({
					selectionMode: 'multiple',
					nodes: mockNodes,
				})
			);

			expect(result.current.isSelected('non-existent')).toBe(false);
		});
	});

	describe('toggleSelection', () => {
		it('should toggle selection in multiple mode', () => {
			const { result } = renderHook(() =>
				useSelectionState({
					selectionMode: 'multiple',
					nodes: mockNodes,
					defaultSelectedIds: ['node-1'],
				})
			);

			expect(result.current.isSelected('node-1')).toBe(true);

			act(() => {
				result.current.toggleSelection('node-1');
			});

			expect(result.current.isSelected('node-1')).toBe(false);

			act(() => {
				result.current.toggleSelection('node-1');
			});

			expect(result.current.isSelected('node-1')).toBe(true);
		});

		it('should clear previous selection in single mode', () => {
			const { result } = renderHook(() =>
				useSelectionState({
					selectionMode: 'single',
					nodes: mockNodes,
					defaultSelectedIds: ['node-1'],
				})
			);

			expect(result.current.isSelected('node-1')).toBe(true);

			act(() => {
				result.current.toggleSelection('node-2');
			});

			expect(result.current.isSelected('node-1')).toBe(false);
			expect(result.current.isSelected('node-2')).toBe(true);
		});

		it('should not update selection when selectionMode is "none"', () => {
			const onSelectionChange = vi.fn();
			const { result } = renderHook(() =>
				useSelectionState({
					selectionMode: 'none',
					nodes: mockNodesWithoutDefaults,
					onSelectionChange,
				})
			);

			act(() => {
				result.current.toggleSelection('node-1');
			});

			expect(result.current.isSelected('node-1')).toBe(false);
			expect(onSelectionChange).not.toHaveBeenCalled();
		});
	});

	describe('selectNode', () => {
		it('should select node in multiple mode', () => {
			const { result } = renderHook(() =>
				useSelectionState({
					selectionMode: 'multiple',
					nodes: mockNodes,
				})
			);

			act(() => {
				result.current.selectNode('node-1');
			});

			expect(result.current.isSelected('node-1')).toBe(true);

			act(() => {
				result.current.selectNode('node-2');
			});

			expect(result.current.isSelected('node-1')).toBe(true);
			expect(result.current.isSelected('node-2')).toBe(true);
		});

		it('should clear previous selection in single mode', () => {
			const { result } = renderHook(() =>
				useSelectionState({
					selectionMode: 'single',
					nodes: mockNodes,
					defaultSelectedIds: ['node-1'],
				})
			);

			expect(result.current.isSelected('node-1')).toBe(true);

			act(() => {
				result.current.selectNode('node-2');
			});

			expect(result.current.isSelected('node-1')).toBe(false);
			expect(result.current.isSelected('node-2')).toBe(true);
		});

		it('should not update selection when selectionMode is "none"', () => {
			const onSelectionChange = vi.fn();
			const { result } = renderHook(() =>
				useSelectionState({
					selectionMode: 'none',
					nodes: mockNodesWithoutDefaults,
					onSelectionChange,
				})
			);

			act(() => {
				result.current.selectNode('node-1');
			});

			expect(result.current.isSelected('node-1')).toBe(false);
			expect(onSelectionChange).not.toHaveBeenCalled();
		});
	});

	describe('deselectNode', () => {
		it('should deselect node in multiple mode', () => {
			const { result } = renderHook(() =>
				useSelectionState({
					selectionMode: 'multiple',
					nodes: mockNodes,
					defaultSelectedIds: ['node-1', 'node-2'],
				})
			);

			expect(result.current.isSelected('node-1')).toBe(true);
			expect(result.current.isSelected('node-2')).toBe(true);

			act(() => {
				result.current.deselectNode('node-1');
			});

			expect(result.current.isSelected('node-1')).toBe(false);
			expect(result.current.isSelected('node-2')).toBe(true);
		});

		it('should deselect node in single mode', () => {
			const { result } = renderHook(() =>
				useSelectionState({
					selectionMode: 'single',
					nodes: mockNodes,
					defaultSelectedIds: ['node-1'],
				})
			);

			expect(result.current.isSelected('node-1')).toBe(true);

			act(() => {
				result.current.deselectNode('node-1');
			});

			expect(result.current.isSelected('node-1')).toBe(false);
		});

		it('should not update selection when selectionMode is "none"', () => {
			const onSelectionChange = vi.fn();
			const { result } = renderHook(() =>
				useSelectionState({
					selectionMode: 'none',
					nodes: mockNodes,
					onSelectionChange,
				})
			);

			act(() => {
				result.current.deselectNode('node-1');
			});

			expect(onSelectionChange).not.toHaveBeenCalled();
		});
	});

	describe('memoization', () => {
		it('should memoize isSelected callback', () => {
			const { result, rerender } = renderHook(() =>
				useSelectionState({
					selectionMode: 'multiple',
					nodes: mockNodes,
					defaultSelectedIds: ['node-1'],
				})
			);

			const firstIsSelected = result.current.isSelected;

			rerender();

			expect(result.current.isSelected).toBe(firstIsSelected);
		});

		it('should update isSelected when selectedNodeIds changes', () => {
			const { result } = renderHook(() =>
				useSelectionState({
					selectionMode: 'multiple',
					nodes: mockNodesWithoutDefaults,
					defaultSelectedIds: ['node-1'],
				})
			);

			expect(result.current.isSelected('node-1')).toBe(true);
			expect(result.current.isSelected('node-2')).toBe(false);

			act(() => {
				result.current.deselectNode('node-1');
			});

			expect(result.current.isSelected('node-1')).toBe(false);

			act(() => {
				result.current.selectNode('node-2');
			});

			expect(result.current.isSelected('node-2')).toBe(true);
		});
	});
});

describe('useExpansionState', () => {
	describe('uncontrolled mode', () => {
		it('should initialize with empty expansion when no defaults provided', () => {
			const { result } = renderHook(() =>
				useExpansionState({
					nodes: mockNodesWithoutDefaults,
				})
			);

			expect(result.current.expandedNodeIds.size).toBe(0);
			expect(result.current.isExpanded('node-1')).toBe(false);
			expect(result.current.isExpanded('node-2')).toBe(false);
		});

		it('should initialize with defaultExpandedIds', () => {
			const { result } = renderHook(() =>
				useExpansionState({
					nodes: mockNodes,
					defaultExpandedIds: ['node-1', 'node-2'],
				})
			);

			expect(result.current.expandedNodeIds.size).toBe(2);
			expect(result.current.isExpanded('node-1')).toBe(true);
			expect(result.current.isExpanded('node-2')).toBe(true);
			expect(result.current.isExpanded('node-3')).toBe(false);
		});

		it('should initialize with nodes that have defaultExpanded property', () => {
			const { result } = renderHook(() =>
				useExpansionState({
					nodes: mockNodes,
				})
			);

			expect(result.current.expandedNodeIds.has('node-1')).toBe(true);
			expect(result.current.isExpanded('node-1')).toBe(true);
		});

		it('should combine defaultExpandedIds and nodes with defaultExpanded', () => {
			const { result } = renderHook(() =>
				useExpansionState({
					nodes: mockNodes,
					defaultExpandedIds: ['node-2'],
				})
			);

			expect(result.current.expandedNodeIds.has('node-1')).toBe(true);
			expect(result.current.expandedNodeIds.has('node-2')).toBe(true);
		});

		it('should update internal state when expansion changes', () => {
			const { result } = renderHook(() =>
				useExpansionState({
					nodes: mockNodes,
				})
			);

			act(() => {
				result.current.expandNode('node-2');
			});

			expect(result.current.isExpanded('node-2')).toBe(true);
			expect(result.current.expandedNodeIds.size).toBeGreaterThan(0);
		});

		it('should call onExpansionChange callback when expansion changes', () => {
			const onExpansionChange = vi.fn();
			const { result } = renderHook(() =>
				useExpansionState({
					nodes: mockNodesWithoutDefaults,
					onExpansionChange,
				})
			);

			act(() => {
				result.current.expandNode('node-2');
			});

			expect(onExpansionChange).toHaveBeenCalledWith(['node-2']);
		});
	});

	describe('controlled mode', () => {
		it('should use controlledExpandedIds when provided', () => {
			const { result } = renderHook(() =>
				useExpansionState({
					nodes: mockNodes,
					controlledExpandedIds: ['node-1', 'node-2'],
				})
			);

			expect(result.current.expandedNodeIds.size).toBe(2);
			expect(result.current.isExpanded('node-1')).toBe(true);
			expect(result.current.isExpanded('node-2')).toBe(true);
			expect(result.current.isExpanded('node-3')).toBe(false);
		});

		it('should update when controlledExpandedIds changes', () => {
			const { result, rerender } = renderHook(
				({ controlledExpandedIds }) =>
					useExpansionState({
						nodes: mockNodes,
						controlledExpandedIds,
					}),
				{
					initialProps: { controlledExpandedIds: ['node-1'] },
				}
			);

			expect(result.current.isExpanded('node-1')).toBe(true);
			expect(result.current.isExpanded('node-2')).toBe(false);

			rerender({ controlledExpandedIds: ['node-2', 'node-3'] });

			expect(result.current.isExpanded('node-1')).toBe(false);
			expect(result.current.isExpanded('node-2')).toBe(true);
			expect(result.current.isExpanded('node-3')).toBe(true);
		});

		it('should not update internal state in controlled mode', () => {
			const onExpansionChange = vi.fn();
			const { result } = renderHook(() =>
				useExpansionState({
					nodes: mockNodes,
					controlledExpandedIds: ['node-1'],
					onExpansionChange,
				})
			);

			act(() => {
				result.current.expandNode('node-2');
			});

			// Internal state should not change, but callback should be called
			expect(result.current.expandedNodeIds.has('node-1')).toBe(true);
			expect(onExpansionChange).toHaveBeenCalledWith(['node-1', 'node-2']);
		});
	});

	describe('isExpanded', () => {
		it('should return true for expanded nodes', () => {
			const { result } = renderHook(() =>
				useExpansionState({
					nodes: mockNodes,
					defaultExpandedIds: ['node-1'],
				})
			);

			expect(result.current.isExpanded('node-1')).toBe(true);
			expect(result.current.isExpanded('node-2')).toBe(false);
		});

		it('should return false for non-existent nodes', () => {
			const { result } = renderHook(() =>
				useExpansionState({
					nodes: mockNodes,
				})
			);

			expect(result.current.isExpanded('non-existent')).toBe(false);
		});
	});

	describe('toggleExpansion', () => {
		it('should expand collapsed node', () => {
			const { result } = renderHook(() =>
				useExpansionState({
					nodes: mockNodes,
				})
			);

			expect(result.current.isExpanded('node-2')).toBe(false);

			act(() => {
				result.current.toggleExpansion('node-2');
			});

			expect(result.current.isExpanded('node-2')).toBe(true);
		});

		it('should collapse expanded node', () => {
			const { result } = renderHook(() =>
				useExpansionState({
					nodes: mockNodes,
					defaultExpandedIds: ['node-1'],
				})
			);

			expect(result.current.isExpanded('node-1')).toBe(true);

			act(() => {
				result.current.toggleExpansion('node-1');
			});

			expect(result.current.isExpanded('node-1')).toBe(false);
		});

		it('should call onExpansionChange when toggling', () => {
			const onExpansionChange = vi.fn();
			const { result } = renderHook(() =>
				useExpansionState({
					nodes: mockNodesWithoutDefaults,
					onExpansionChange,
				})
			);

			act(() => {
				result.current.toggleExpansion('node-2');
			});

			expect(onExpansionChange).toHaveBeenCalledWith(['node-2']);
		});
	});

	describe('expandNode', () => {
		it('should expand node', () => {
			const { result } = renderHook(() =>
				useExpansionState({
					nodes: mockNodes,
				})
			);

			expect(result.current.isExpanded('node-2')).toBe(false);

			act(() => {
				result.current.expandNode('node-2');
			});

			expect(result.current.isExpanded('node-2')).toBe(true);
		});

		it('should not affect already expanded nodes', () => {
			const { result } = renderHook(() =>
				useExpansionState({
					nodes: mockNodes,
					defaultExpandedIds: ['node-1'],
				})
			);

			expect(result.current.isExpanded('node-1')).toBe(true);

			act(() => {
				result.current.expandNode('node-1');
			});

			expect(result.current.isExpanded('node-1')).toBe(true);
		});

		it('should call onExpansionChange when expanding', () => {
			const onExpansionChange = vi.fn();
			const { result } = renderHook(() =>
				useExpansionState({
					nodes: mockNodesWithoutDefaults,
					onExpansionChange,
				})
			);

			act(() => {
				result.current.expandNode('node-2');
			});

			expect(onExpansionChange).toHaveBeenCalledWith(['node-2']);
		});
	});

	describe('collapseNode', () => {
		it('should collapse expanded node', () => {
			const { result } = renderHook(() =>
				useExpansionState({
					nodes: mockNodes,
					defaultExpandedIds: ['node-1'],
				})
			);

			expect(result.current.isExpanded('node-1')).toBe(true);

			act(() => {
				result.current.collapseNode('node-1');
			});

			expect(result.current.isExpanded('node-1')).toBe(false);
		});

		it('should not affect already collapsed nodes', () => {
			const { result } = renderHook(() =>
				useExpansionState({
					nodes: mockNodes,
				})
			);

			expect(result.current.isExpanded('node-2')).toBe(false);

			act(() => {
				result.current.collapseNode('node-2');
			});

			expect(result.current.isExpanded('node-2')).toBe(false);
		});

		it('should call onExpansionChange when collapsing', () => {
			const onExpansionChange = vi.fn();
			const { result } = renderHook(() =>
				useExpansionState({
					nodes: mockNodes,
					defaultExpandedIds: ['node-1'],
					onExpansionChange,
				})
			);

			act(() => {
				result.current.collapseNode('node-1');
			});

			expect(onExpansionChange).toHaveBeenCalledWith([]);
		});
	});

	describe('memoization', () => {
		it('should memoize isExpanded callback', () => {
			const { result, rerender } = renderHook(() =>
				useExpansionState({
					nodes: mockNodes,
					defaultExpandedIds: ['node-1'],
				})
			);

			const firstIsExpanded = result.current.isExpanded;

			rerender();

			expect(result.current.isExpanded).toBe(firstIsExpanded);
		});

		it('should update isExpanded when expandedNodeIds changes', () => {
			const { result } = renderHook(() =>
				useExpansionState({
					nodes: mockNodesWithoutDefaults,
					defaultExpandedIds: ['node-1'],
				})
			);

			expect(result.current.isExpanded('node-1')).toBe(true);
			expect(result.current.isExpanded('node-2')).toBe(false);

			act(() => {
				result.current.collapseNode('node-1');
			});

			expect(result.current.isExpanded('node-1')).toBe(false);

			act(() => {
				result.current.expandNode('node-2');
			});

			expect(result.current.isExpanded('node-2')).toBe(true);
		});
	});
});
