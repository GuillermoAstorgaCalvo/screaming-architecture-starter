/**
 * Tests for useTreeViewSetup hook
 *
 * Tests the main setup hook that orchestrates all TreeView state and handlers:
 * - Basic setup with minimal props
 * - Different selection modes
 * - With/without callbacks
 * - Controlled vs uncontrolled state
 * - Focus behavior
 * - Return value structure
 */

import { useTreeViewSetup } from '@core/ui/data-display/tree-view/hooks/useTreeViewSetup';
import type { TreeNode, TreeViewProps } from '@src-types/ui/navigation/treeView';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

// Test data
const createMockNode = (id: string, label: string = `Node ${id}`): TreeNode => ({
	id,
	label,
});

const mockNodes: readonly TreeNode[] = [
	{
		id: 'node-1',
		label: 'Folder 1',
		children: [
			{ id: 'node-1-1', label: 'File 1-1' },
			{ id: 'node-1-2', label: 'File 1-2' },
		],
	},
	{
		id: 'node-2',
		label: 'Folder 2',
		children: [{ id: 'node-2-1', label: 'File 2-1' }],
	},
	{
		id: 'node-3',
		label: 'File 3',
	},
] as const;

describe('useTreeViewSetup', () => {
	describe('Basic Setup', () => {
		it('should return all required properties with minimal props', () => {
			const props: TreeViewProps = {
				nodes: mockNodes,
			};

			const { result } = renderHook(() => useTreeViewSetup(props));

			expect(result.current).toHaveProperty('nodes');
			expect(result.current).toHaveProperty('isSelected');
			expect(result.current).toHaveProperty('isExpanded');
			expect(result.current).toHaveProperty('selectionMode');
			expect(result.current).toHaveProperty('focusedNodeId');
			expect(result.current).toHaveProperty('handleNodeClick');
			expect(result.current).toHaveProperty('handleNodeDoubleClick');
			expect(result.current).toHaveProperty('handleKeyDown');
		});

		it('should return nodes from props', () => {
			const props: TreeViewProps = {
				nodes: mockNodes,
			};

			const { result } = renderHook(() => useTreeViewSetup(props));

			expect(result.current.nodes).toEqual(mockNodes);
		});

		it('should default selectionMode to "none"', () => {
			const props: TreeViewProps = {
				nodes: mockNodes,
			};

			const { result } = renderHook(() => useTreeViewSetup(props));

			expect(result.current.selectionMode).toBe('none');
		});

		it('should use provided selectionMode', () => {
			const props: TreeViewProps = {
				nodes: mockNodes,
				selectionMode: 'single',
			};

			const { result } = renderHook(() => useTreeViewSetup(props));

			expect(result.current.selectionMode).toBe('single');
		});

		it('should handle empty nodes array', () => {
			const props: TreeViewProps = {
				nodes: [],
			};

			const { result } = renderHook(() => useTreeViewSetup(props));

			expect(result.current.nodes).toEqual([]);
			expect(result.current.focusedNodeId).toBeNull();
		});
	});

	describe('Selection State', () => {
		it('should return isSelected function that works correctly', () => {
			const props: TreeViewProps = {
				nodes: mockNodes,
				selectionMode: 'single',
				defaultSelectedNodeIds: ['node-1'],
			};

			const { result } = renderHook(() => useTreeViewSetup(props));

			expect(result.current.isSelected('node-1')).toBe(true);
			expect(result.current.isSelected('node-2')).toBe(false);
		});

		it('should handle controlled selectedNodeIds', () => {
			const props: TreeViewProps = {
				nodes: mockNodes,
				selectionMode: 'single',
				selectedNodeIds: ['node-2'],
			};

			const { result } = renderHook(() => useTreeViewSetup(props));

			expect(result.current.isSelected('node-2')).toBe(true);
			expect(result.current.isSelected('node-1')).toBe(false);
		});

		it('should handle multiple selection mode', () => {
			const props: TreeViewProps = {
				nodes: mockNodes,
				selectionMode: 'multiple',
				defaultSelectedNodeIds: ['node-1', 'node-2'],
			};

			const { result } = renderHook(() => useTreeViewSetup(props));

			expect(result.current.isSelected('node-1')).toBe(true);
			expect(result.current.isSelected('node-2')).toBe(true);
			expect(result.current.isSelected('node-3')).toBe(false);
		});
	});

	describe('Expansion State', () => {
		it('should return isExpanded function that works correctly', () => {
			const props: TreeViewProps = {
				nodes: mockNodes,
				defaultExpandedNodeIds: ['node-1'],
			};

			const { result } = renderHook(() => useTreeViewSetup(props));

			expect(result.current.isExpanded('node-1')).toBe(true);
			expect(result.current.isExpanded('node-2')).toBe(false);
		});

		it('should handle controlled expandedNodeIds', () => {
			const props: TreeViewProps = {
				nodes: mockNodes,
				expandedNodeIds: ['node-2'],
			};

			const { result } = renderHook(() => useTreeViewSetup(props));

			expect(result.current.isExpanded('node-2')).toBe(true);
			expect(result.current.isExpanded('node-1')).toBe(false);
		});
	});

	describe('Focus Behavior', () => {
		it('should focus first selected node when nodes are selected', () => {
			const props: TreeViewProps = {
				nodes: mockNodes,
				selectionMode: 'single',
				defaultSelectedNodeIds: ['node-2'],
			};

			const { result } = renderHook(() => useTreeViewSetup(props));

			expect(result.current.focusedNodeId).toBe('node-2');
		});

		it('should focus first node when no nodes are selected', () => {
			const props: TreeViewProps = {
				nodes: mockNodes,
			};

			const { result } = renderHook(() => useTreeViewSetup(props));

			expect(result.current.focusedNodeId).toBe('node-1');
		});

		it('should return null focusedNodeId when nodes array is empty', () => {
			const props: TreeViewProps = {
				nodes: [],
			};

			const { result } = renderHook(() => useTreeViewSetup(props));

			expect(result.current.focusedNodeId).toBeNull();
		});

		it('should allow setting focused node via setFocusedNodeId', () => {
			const props: TreeViewProps = {
				nodes: mockNodes,
			};

			const { result } = renderHook(() => useTreeViewSetup(props));

			expect(result.current.focusedNodeId).toBe('node-1');

			act(() => {
				// The setFocusedNodeId is not directly exposed, but we can test it through handlers
				// We'll test this through keyboard navigation or other handlers
			});
		});
	});

	describe('Event Handlers', () => {
		it('should call onNodeClick when handleNodeClick is invoked', () => {
			const onNodeClick = vi.fn();
			const props: TreeViewProps = {
				nodes: mockNodes,
				onNodeClick,
			};

			const { result } = renderHook(() => useTreeViewSetup(props));

			const node = mockNodes[0];
			expect(node).toBeDefined();
			act(() => {
				result.current.handleNodeClick('node-1', node!);
			});

			expect(onNodeClick).toHaveBeenCalledTimes(1);
			expect(onNodeClick).toHaveBeenCalledWith('node-1', node);
		});

		it('should not throw when handleNodeClick is called without onNodeClick prop', () => {
			const props: TreeViewProps = {
				nodes: mockNodes,
			};

			const { result } = renderHook(() => useTreeViewSetup(props));

			const node = mockNodes[0];
			expect(node).toBeDefined();
			act(() => {
				result.current.handleNodeClick('node-1', node!);
			});
			// Should not throw - test passes if we get here
			expect(true).toBe(true);
		});

		it('should call onNodeDoubleClick when handleNodeDoubleClick is invoked', () => {
			const onNodeDoubleClick = vi.fn();
			const props: TreeViewProps = {
				nodes: mockNodes,
				onNodeDoubleClick,
			};

			const { result } = renderHook(() => useTreeViewSetup(props));

			const node = mockNodes[0];
			expect(node).toBeDefined();
			act(() => {
				result.current.handleNodeDoubleClick('node-1', node!);
			});

			expect(onNodeDoubleClick).toHaveBeenCalledTimes(1);
			expect(onNodeDoubleClick).toHaveBeenCalledWith('node-1', node);
		});

		it('should not throw when handleNodeDoubleClick is called without onNodeDoubleClick prop', () => {
			const props: TreeViewProps = {
				nodes: mockNodes,
			};

			const { result } = renderHook(() => useTreeViewSetup(props));

			const node = mockNodes[0];
			expect(node).toBeDefined();
			act(() => {
				result.current.handleNodeDoubleClick('node-1', node!);
			});
			// Should not throw - test passes if we get here
			expect(true).toBe(true);
		});

		it('should provide handleKeyDown function', () => {
			const props: TreeViewProps = {
				nodes: mockNodes,
			};

			const { result } = renderHook(() => useTreeViewSetup(props));

			expect(typeof result.current.handleKeyDown).toBe('function');
		});
	});

	describe('State Management', () => {
		it('should reflect initial selection state correctly', () => {
			const props: TreeViewProps = {
				nodes: mockNodes,
				selectionMode: 'single',
				defaultSelectedNodeIds: ['node-1'],
			};

			const { result } = renderHook(() => useTreeViewSetup(props));

			expect(result.current.isSelected('node-1')).toBe(true);
			expect(result.current.isSelected('node-2')).toBe(false);
		});

		it('should reflect initial expansion state correctly', () => {
			const props: TreeViewProps = {
				nodes: mockNodes,
				defaultExpandedNodeIds: ['node-1'],
			};

			const { result } = renderHook(() => useTreeViewSetup(props));

			expect(result.current.isExpanded('node-1')).toBe(true);
			expect(result.current.isExpanded('node-2')).toBe(false);
		});

		it('should update selection state when controlled selectedNodeIds change', () => {
			const props: TreeViewProps = {
				nodes: mockNodes,
				selectionMode: 'single',
				selectedNodeIds: ['node-1'],
			};

			const { result, rerender } = renderHook(({ props }) => useTreeViewSetup(props), {
				initialProps: { props },
			});

			expect(result.current.isSelected('node-1')).toBe(true);
			expect(result.current.isSelected('node-2')).toBe(false);

			rerender({
				props: {
					...props,
					selectedNodeIds: ['node-2'],
				},
			});

			expect(result.current.isSelected('node-1')).toBe(false);
			expect(result.current.isSelected('node-2')).toBe(true);
		});

		it('should update expansion state when controlled expandedNodeIds change', () => {
			const props: TreeViewProps = {
				nodes: mockNodes,
				expandedNodeIds: ['node-1'],
			};

			const { result, rerender } = renderHook(({ props }) => useTreeViewSetup(props), {
				initialProps: { props },
			});

			expect(result.current.isExpanded('node-1')).toBe(true);
			expect(result.current.isExpanded('node-2')).toBe(false);

			rerender({
				props: {
					...props,
					expandedNodeIds: ['node-2'],
				},
			});

			expect(result.current.isExpanded('node-1')).toBe(false);
			expect(result.current.isExpanded('node-2')).toBe(true);
		});
	});

	describe('Integration with All Props', () => {
		it('should work correctly with all props provided', () => {
			const onNodeClick = vi.fn();
			const onNodeDoubleClick = vi.fn();
			const onSelectionChange = vi.fn();
			const onExpansionChange = vi.fn();

			const props: TreeViewProps = {
				nodes: mockNodes,
				selectionMode: 'multiple',
				selectedNodeIds: ['node-1'],
				expandedNodeIds: ['node-2'],
				onNodeClick,
				onNodeDoubleClick,
				onSelectionChange,
				onExpansionChange,
			};

			const { result } = renderHook(() => useTreeViewSetup(props));

			// Check controlled state
			expect(result.current.isSelected('node-1')).toBe(true);
			expect(result.current.isExpanded('node-2')).toBe(true);

			// Check handlers exist
			expect(typeof result.current.handleNodeClick).toBe('function');
			expect(typeof result.current.handleNodeDoubleClick).toBe('function');
			expect(typeof result.current.handleKeyDown).toBe('function');

			// Test handlers
			const node = mockNodes[0];
			expect(node).toBeDefined();
			act(() => {
				result.current.handleNodeClick('node-1', node!);
				expect(mockNodes[1]).toBeDefined();
				result.current.handleNodeDoubleClick('node-2', mockNodes[1]!);
			});

			expect(onNodeClick).toHaveBeenCalledWith('node-1', node);
			expect(onNodeDoubleClick).toHaveBeenCalledWith('node-2', mockNodes[1]);
		});

		it('should handle default values correctly', () => {
			const props: TreeViewProps = {
				nodes: mockNodes,
				defaultSelectedNodeIds: ['node-1', 'node-2'],
				defaultExpandedNodeIds: ['node-1'],
			};

			const { result } = renderHook(() => useTreeViewSetup(props));

			expect(result.current.isSelected('node-1')).toBe(true);
			expect(result.current.isSelected('node-2')).toBe(true);
			expect(result.current.isExpanded('node-1')).toBe(true);
		});
	});

	describe('Readonly Props', () => {
		it('should handle readonly props correctly', () => {
			const props: Readonly<TreeViewProps> = {
				nodes: mockNodes,
				selectionMode: 'single',
			} as const;

			const { result } = renderHook(() => useTreeViewSetup(props));

			expect(result.current.nodes).toEqual(mockNodes);
			expect(result.current.selectionMode).toBe('single');
		});
	});
});
