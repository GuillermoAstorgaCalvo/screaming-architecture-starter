/**
 * Tests for useTreeView hook
 *
 * Tests the main tree view hook functionality:
 * - Initial state (selection and expansion)
 * - Selection operations (toggle, select, deselect)
 * - Expansion operations (toggle, expand, collapse)
 * - Node utilities (getAllNodeIds, getNodeById)
 * - Controlled vs uncontrolled modes
 * - Callback invocations
 */

import { useTreeView } from '@core/ui/data-display/tree-view/hooks/useTreeView';
import type { TreeNode } from '@src-types/ui/navigation/treeView';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

// Test data helpers
const createMockNode = (
	id: string,
	label: string = `Node ${id}`,
	children?: TreeNode[]
): TreeNode => ({
	id,
	label,
	...(children && { children }),
});

const createSimpleTree = (): TreeNode[] => [
	createMockNode('node-1', 'Node 1'),
	createMockNode('node-2', 'Node 2'),
	createMockNode('node-3', 'Node 3'),
];

const createNestedTree = (): TreeNode[] => [
	createMockNode('node-1', 'Node 1', [
		createMockNode('node-1-1', 'Node 1.1'),
		createMockNode('node-1-2', 'Node 1.2', [createMockNode('node-1-2-1', 'Node 1.2.1')]),
	]),
	createMockNode('node-2', 'Node 2'),
];

describe('useTreeView', () => {
	describe('Initial State', () => {
		it('should initialize with empty selection and expansion', () => {
			const nodes = createSimpleTree();
			const { result } = renderHook(() =>
				useTreeView({
					nodes,
					selectionMode: 'none',
				})
			);

			expect(result.current.selectedNodeIds.size).toBe(0);
			expect(result.current.expandedNodeIds.size).toBe(0);
		});

		it('should initialize with default selected nodes', () => {
			const nodes = createSimpleTree();
			const { result } = renderHook(() =>
				useTreeView({
					nodes,
					selectionMode: 'single',
					defaultSelectedIds: ['node-1'],
				})
			);

			expect(result.current.selectedNodeIds.has('node-1')).toBe(true);
			expect(result.current.isSelected('node-1')).toBe(true);
			expect(result.current.selectedNodeIds.size).toBe(1);
		});

		it('should initialize with default expanded nodes', () => {
			const nodes = createNestedTree();
			const { result } = renderHook(() =>
				useTreeView({
					nodes,
					selectionMode: 'none',
					defaultExpandedIds: ['node-1'],
				})
			);

			expect(result.current.expandedNodeIds.has('node-1')).toBe(true);
			expect(result.current.isExpanded('node-1')).toBe(true);
			expect(result.current.expandedNodeIds.size).toBe(1);
		});

		it('should initialize with both default selection and expansion', () => {
			const nodes = createNestedTree();
			const { result } = renderHook(() =>
				useTreeView({
					nodes,
					selectionMode: 'single',
					defaultSelectedIds: ['node-2'],
					defaultExpandedIds: ['node-1'],
				})
			);

			expect(result.current.selectedNodeIds.has('node-2')).toBe(true);
			expect(result.current.isSelected('node-2')).toBe(true);
			expect(result.current.expandedNodeIds.has('node-1')).toBe(true);
			expect(result.current.isExpanded('node-1')).toBe(true);
		});
	});

	describe('Node Utilities', () => {
		it('should return all node IDs from flat tree', () => {
			const nodes = createSimpleTree();
			const { result } = renderHook(() =>
				useTreeView({
					nodes,
					selectionMode: 'none',
				})
			);

			const allIds = result.current.getAllNodeIds();
			expect(allIds).toEqual(['node-1', 'node-2', 'node-3']);
		});

		it('should return all node IDs from nested tree', () => {
			const nodes = createNestedTree();
			const { result } = renderHook(() =>
				useTreeView({
					nodes,
					selectionMode: 'none',
				})
			);

			const allIds = result.current.getAllNodeIds();
			expect(allIds).toEqual(['node-1', 'node-1-1', 'node-1-2', 'node-1-2-1', 'node-2']);
		});

		it('should return node by ID', () => {
			const nodes = createNestedTree();
			const { result } = renderHook(() =>
				useTreeView({
					nodes,
					selectionMode: 'none',
				})
			);

			const node = result.current.getNodeById('node-1-2');
			expect(node).toBeDefined();
			expect(node?.id).toBe('node-1-2');
			expect(node?.label).toBe('Node 1.2');
		});

		it('should return undefined for non-existent node ID', () => {
			const nodes = createSimpleTree();
			const { result } = renderHook(() =>
				useTreeView({
					nodes,
					selectionMode: 'none',
				})
			);

			const node = result.current.getNodeById('non-existent');
			expect(node).toBeUndefined();
		});

		it('should return root node by ID', () => {
			const nodes = createNestedTree();
			const { result } = renderHook(() =>
				useTreeView({
					nodes,
					selectionMode: 'none',
				})
			);

			const node = result.current.getNodeById('node-1');
			expect(node).toBeDefined();
			expect(node?.id).toBe('node-1');
		});

		it('should return deeply nested node by ID', () => {
			const nodes = createNestedTree();
			const { result } = renderHook(() =>
				useTreeView({
					nodes,
					selectionMode: 'none',
				})
			);

			const node = result.current.getNodeById('node-1-2-1');
			expect(node).toBeDefined();
			expect(node?.id).toBe('node-1-2-1');
		});
	});

	describe('Selection - Single Mode', () => {
		it('should select node in single mode', () => {
			const nodes = createSimpleTree();
			const { result } = renderHook(() =>
				useTreeView({
					nodes,
					selectionMode: 'single',
				})
			);

			act(() => {
				result.current.selectNode('node-1');
			});

			expect(result.current.isSelected('node-1')).toBe(true);
			expect(result.current.selectedNodeIds.size).toBe(1);
		});

		it('should replace selection when selecting different node in single mode', () => {
			const nodes = createSimpleTree();
			const { result } = renderHook(() =>
				useTreeView({
					nodes,
					selectionMode: 'single',
				})
			);

			act(() => {
				result.current.selectNode('node-1');
			});

			expect(result.current.isSelected('node-1')).toBe(true);

			act(() => {
				result.current.selectNode('node-2');
			});

			expect(result.current.isSelected('node-1')).toBe(false);
			expect(result.current.isSelected('node-2')).toBe(true);
			expect(result.current.selectedNodeIds.size).toBe(1);
		});

		it('should toggle selection in single mode', () => {
			const nodes = createSimpleTree();
			const { result } = renderHook(() =>
				useTreeView({
					nodes,
					selectionMode: 'single',
				})
			);

			act(() => {
				result.current.toggleSelection('node-1');
			});

			expect(result.current.isSelected('node-1')).toBe(true);

			act(() => {
				result.current.toggleSelection('node-1');
			});

			expect(result.current.isSelected('node-1')).toBe(false);
			expect(result.current.selectedNodeIds.size).toBe(0);
		});

		it('should deselect node in single mode', () => {
			const nodes = createSimpleTree();
			const { result } = renderHook(() =>
				useTreeView({
					nodes,
					selectionMode: 'single',
					defaultSelectedIds: ['node-1'],
				})
			);

			expect(result.current.isSelected('node-1')).toBe(true);

			act(() => {
				result.current.deselectNode('node-1');
			});

			expect(result.current.isSelected('node-1')).toBe(false);
			expect(result.current.selectedNodeIds.size).toBe(0);
		});
	});

	describe('Selection - Multiple Mode', () => {
		it('should select multiple nodes', () => {
			const nodes = createSimpleTree();
			const { result } = renderHook(() =>
				useTreeView({
					nodes,
					selectionMode: 'multiple',
				})
			);

			act(() => {
				result.current.selectNode('node-1');
			});

			act(() => {
				result.current.selectNode('node-2');
			});

			expect(result.current.isSelected('node-1')).toBe(true);
			expect(result.current.isSelected('node-2')).toBe(true);
			expect(result.current.selectedNodeIds.size).toBe(2);
		});

		it('should toggle selection in multiple mode', () => {
			const nodes = createSimpleTree();
			const { result } = renderHook(() =>
				useTreeView({
					nodes,
					selectionMode: 'multiple',
				})
			);

			act(() => {
				result.current.toggleSelection('node-1');
			});

			act(() => {
				result.current.toggleSelection('node-2');
			});

			expect(result.current.isSelected('node-1')).toBe(true);
			expect(result.current.isSelected('node-2')).toBe(true);

			act(() => {
				result.current.toggleSelection('node-1');
			});

			expect(result.current.isSelected('node-1')).toBe(false);
			expect(result.current.isSelected('node-2')).toBe(true);
			expect(result.current.selectedNodeIds.size).toBe(1);
		});

		it('should deselect specific node in multiple mode', () => {
			const nodes = createSimpleTree();
			const { result } = renderHook(() =>
				useTreeView({
					nodes,
					selectionMode: 'multiple',
					defaultSelectedIds: ['node-1', 'node-2'],
				})
			);

			expect(result.current.selectedNodeIds.size).toBe(2);

			act(() => {
				result.current.deselectNode('node-1');
			});

			expect(result.current.isSelected('node-1')).toBe(false);
			expect(result.current.isSelected('node-2')).toBe(true);
			expect(result.current.selectedNodeIds.size).toBe(1);
		});
	});

	describe('Selection - None Mode', () => {
		it('should not allow selection in none mode', () => {
			const nodes = createSimpleTree();
			const { result } = renderHook(() =>
				useTreeView({
					nodes,
					selectionMode: 'none',
				})
			);

			act(() => {
				result.current.selectNode('node-1');
			});

			expect(result.current.isSelected('node-1')).toBe(false);
			expect(result.current.selectedNodeIds.size).toBe(0);
		});

		it('should not toggle selection in none mode', () => {
			const nodes = createSimpleTree();
			const { result } = renderHook(() =>
				useTreeView({
					nodes,
					selectionMode: 'none',
				})
			);

			act(() => {
				result.current.toggleSelection('node-1');
			});

			expect(result.current.isSelected('node-1')).toBe(false);
			expect(result.current.selectedNodeIds.size).toBe(0);
		});
	});

	describe('Expansion', () => {
		it('should expand node', () => {
			const nodes = createNestedTree();
			const { result } = renderHook(() =>
				useTreeView({
					nodes,
					selectionMode: 'none',
				})
			);

			expect(result.current.isExpanded('node-1')).toBe(false);

			act(() => {
				result.current.expandNode('node-1');
			});

			expect(result.current.isExpanded('node-1')).toBe(true);
			expect(result.current.expandedNodeIds.size).toBe(1);
		});

		it('should collapse node', () => {
			const nodes = createNestedTree();
			const { result } = renderHook(() =>
				useTreeView({
					nodes,
					selectionMode: 'none',
					defaultExpandedIds: ['node-1'],
				})
			);

			expect(result.current.isExpanded('node-1')).toBe(true);

			act(() => {
				result.current.collapseNode('node-1');
			});

			expect(result.current.isExpanded('node-1')).toBe(false);
			expect(result.current.expandedNodeIds.size).toBe(0);
		});

		it('should toggle expansion', () => {
			const nodes = createNestedTree();
			const { result } = renderHook(() =>
				useTreeView({
					nodes,
					selectionMode: 'none',
				})
			);

			act(() => {
				result.current.toggleExpansion('node-1');
			});

			expect(result.current.isExpanded('node-1')).toBe(true);

			act(() => {
				result.current.toggleExpansion('node-1');
			});

			expect(result.current.isExpanded('node-1')).toBe(false);
		});

		it('should expand multiple nodes', () => {
			const nodes = createNestedTree();
			const { result } = renderHook(() =>
				useTreeView({
					nodes,
					selectionMode: 'none',
				})
			);

			act(() => {
				result.current.expandNode('node-1');
			});

			act(() => {
				result.current.expandNode('node-1-2');
			});

			expect(result.current.isExpanded('node-1')).toBe(true);
			expect(result.current.isExpanded('node-1-2')).toBe(true);
			expect(result.current.expandedNodeIds.size).toBe(2);
		});
	});

	describe('Controlled Mode', () => {
		it('should use controlled selected IDs', () => {
			const nodes = createSimpleTree();
			const { result, rerender } = renderHook(
				({ controlledSelectedIds }) =>
					useTreeView({
						nodes,
						selectionMode: 'single',
						controlledSelectedIds,
					}),
				{
					initialProps: {
						controlledSelectedIds: ['node-1'] as readonly string[],
					},
				}
			);

			expect(result.current.isSelected('node-1')).toBe(true);

			rerender({ controlledSelectedIds: ['node-2'] as readonly string[] });

			expect(result.current.isSelected('node-1')).toBe(false);
			expect(result.current.isSelected('node-2')).toBe(true);
		});

		it('should use controlled expanded IDs', () => {
			const nodes = createNestedTree();
			const { result, rerender } = renderHook(
				({ controlledExpandedIds }) =>
					useTreeView({
						nodes,
						selectionMode: 'none',
						controlledExpandedIds,
					}),
				{
					initialProps: {
						controlledExpandedIds: ['node-1'] as readonly string[],
					},
				}
			);

			expect(result.current.isExpanded('node-1')).toBe(true);

			rerender({ controlledExpandedIds: [] as readonly string[] });

			expect(result.current.isExpanded('node-1')).toBe(false);
		});

		it('should call onSelectionChange in controlled mode', () => {
			const nodes = createSimpleTree();
			const onSelectionChange = vi.fn();
			const { result } = renderHook(() =>
				useTreeView({
					nodes,
					selectionMode: 'single',
					controlledSelectedIds: [],
					onSelectionChange,
				})
			);

			act(() => {
				result.current.selectNode('node-1');
			});

			expect(onSelectionChange).toHaveBeenCalledWith(['node-1']);
		});

		it('should call onExpansionChange in controlled mode', () => {
			const nodes = createNestedTree();
			const onExpansionChange = vi.fn();
			const { result } = renderHook(() =>
				useTreeView({
					nodes,
					selectionMode: 'none',
					controlledExpandedIds: [],
					onExpansionChange,
				})
			);

			act(() => {
				result.current.expandNode('node-1');
			});

			expect(onExpansionChange).toHaveBeenCalledWith(['node-1']);
		});
	});

	describe('Uncontrolled Mode', () => {
		it('should call onSelectionChange in uncontrolled mode', () => {
			const nodes = createSimpleTree();
			const onSelectionChange = vi.fn();
			const { result } = renderHook(() =>
				useTreeView({
					nodes,
					selectionMode: 'single',
					onSelectionChange,
				})
			);

			act(() => {
				result.current.selectNode('node-1');
			});

			expect(onSelectionChange).toHaveBeenCalledWith(['node-1']);
		});

		it('should call onExpansionChange in uncontrolled mode', () => {
			const nodes = createNestedTree();
			const onExpansionChange = vi.fn();
			const { result } = renderHook(() =>
				useTreeView({
					nodes,
					selectionMode: 'none',
					onExpansionChange,
				})
			);

			act(() => {
				result.current.expandNode('node-1');
			});

			expect(onExpansionChange).toHaveBeenCalledWith(['node-1']);
		});

		it('should maintain internal state in uncontrolled mode', () => {
			const nodes = createSimpleTree();
			const { result } = renderHook(() =>
				useTreeView({
					nodes,
					selectionMode: 'single',
				})
			);

			act(() => {
				result.current.selectNode('node-1');
			});

			expect(result.current.isSelected('node-1')).toBe(true);

			act(() => {
				result.current.selectNode('node-2');
			});

			expect(result.current.isSelected('node-1')).toBe(false);
			expect(result.current.isSelected('node-2')).toBe(true);
		});
	});

	describe('Combined Operations', () => {
		it('should handle selection and expansion independently', () => {
			const nodes = createNestedTree();
			const { result } = renderHook(() =>
				useTreeView({
					nodes,
					selectionMode: 'single',
				})
			);

			act(() => {
				result.current.selectNode('node-2');
			});

			act(() => {
				result.current.expandNode('node-1');
			});

			expect(result.current.isSelected('node-2')).toBe(true);
			expect(result.current.isExpanded('node-1')).toBe(true);
			expect(result.current.isSelected('node-1')).toBe(false);
			expect(result.current.isExpanded('node-2')).toBe(false);
		});

		it('should handle multiple operations in sequence', () => {
			const nodes = createNestedTree();
			const { result } = renderHook(() =>
				useTreeView({
					nodes,
					selectionMode: 'multiple',
				})
			);

			act(() => {
				result.current.selectNode('node-1');
			});

			act(() => {
				result.current.selectNode('node-2');
			});

			act(() => {
				result.current.expandNode('node-1');
			});

			act(() => {
				result.current.expandNode('node-1-2');
			});

			expect(result.current.isSelected('node-1')).toBe(true);
			expect(result.current.isSelected('node-2')).toBe(true);
			expect(result.current.isExpanded('node-1')).toBe(true);
			expect(result.current.isExpanded('node-1-2')).toBe(true);
		});
	});

	describe('Edge Cases', () => {
		it('should handle empty nodes array', () => {
			const { result } = renderHook(() =>
				useTreeView({
					nodes: [],
					selectionMode: 'none',
				})
			);

			expect(result.current.getAllNodeIds()).toEqual([]);
			expect(result.current.getNodeById('any-id')).toBeUndefined();
		});

		it('should handle selecting non-existent node', () => {
			const nodes = createSimpleTree();
			const { result } = renderHook(() =>
				useTreeView({
					nodes,
					selectionMode: 'single',
				})
			);

			act(() => {
				result.current.selectNode('non-existent');
			});

			// The hook doesn't validate node existence, so it will add any ID
			expect(result.current.isSelected('non-existent')).toBe(true);
			expect(result.current.selectedNodeIds.size).toBe(1);
		});

		it('should handle expanding non-existent node', () => {
			const nodes = createNestedTree();
			const { result } = renderHook(() =>
				useTreeView({
					nodes,
					selectionMode: 'none',
				})
			);

			act(() => {
				result.current.expandNode('non-existent');
			});

			// The hook doesn't validate node existence, so it will add any ID
			expect(result.current.isExpanded('non-existent')).toBe(true);
			expect(result.current.expandedNodeIds.size).toBe(1);
		});

		it('should handle deselecting non-selected node', () => {
			const nodes = createSimpleTree();
			const { result } = renderHook(() =>
				useTreeView({
					nodes,
					selectionMode: 'single',
				})
			);

			act(() => {
				result.current.deselectNode('node-1');
			});

			expect(result.current.selectedNodeIds.size).toBe(0);
		});

		it('should handle collapsing non-expanded node', () => {
			const nodes = createNestedTree();
			const { result } = renderHook(() =>
				useTreeView({
					nodes,
					selectionMode: 'none',
				})
			);

			act(() => {
				result.current.collapseNode('node-1');
			});

			expect(result.current.expandedNodeIds.size).toBe(0);
		});
	});
});
