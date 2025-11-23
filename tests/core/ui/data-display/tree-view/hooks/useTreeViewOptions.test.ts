/**
 * Tests for useTreeViewOptions hook
 *
 * Tests:
 * - buildTreeViewOptions: option building with defaults and conditionals
 * - useTreeViewState: hook that builds options and uses useTreeView
 * - extractSetupProps: prop extraction from TreeViewProps
 */

import {
	buildTreeViewOptions,
	extractSetupProps,
	useTreeViewState,
} from '@core/ui/data-display/tree-view/hooks/useTreeViewOptions';
import type { TreeNode, TreeViewProps } from '@src-types/ui/navigation/treeView';
import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

// Test data
const createMockNode = (id: string, label: string = `Node ${id}`): TreeNode => ({
	id,
	label,
});

const mockNodes: readonly TreeNode[] = [
	createMockNode('node-1', 'Node 1'),
	createMockNode('node-2', 'Node 2'),
	{
		id: 'node-3',
		label: 'Node 3',
		children: [createMockNode('node-3-1', 'Node 3.1')],
	},
] as const;

describe('buildTreeViewOptions', () => {
	it('should build options with minimal params', () => {
		const params = {
			nodes: mockNodes,
			selectionMode: 'none' as const,
			controlledSelectedIds: undefined,
			controlledExpandedIds: undefined,
			defaultSelectedNodeIds: undefined,
			defaultExpandedNodeIds: undefined,
			onSelectionChange: undefined,
			onExpansionChange: undefined,
		};

		const result = buildTreeViewOptions(params);

		expect(result).toEqual({
			nodes: mockNodes,
			selectionMode: 'none',
		});
	});

	it('should use default selectionMode when not provided', () => {
		const params = {
			nodes: mockNodes,
			selectionMode: undefined as any,
			controlledSelectedIds: undefined,
			controlledExpandedIds: undefined,
			defaultSelectedNodeIds: undefined,
			defaultExpandedNodeIds: undefined,
			onSelectionChange: undefined,
			onExpansionChange: undefined,
		};

		const result = buildTreeViewOptions(params);

		expect(result.selectionMode).toBe('none');
	});

	it('should include controlledSelectedIds when provided', () => {
		const controlledSelectedIds = ['node-1', 'node-2'];
		const params = {
			nodes: mockNodes,
			selectionMode: 'multiple' as const,
			controlledSelectedIds,
			controlledExpandedIds: undefined,
			defaultSelectedNodeIds: undefined,
			defaultExpandedNodeIds: undefined,
			onSelectionChange: undefined,
			onExpansionChange: undefined,
		};

		const result = buildTreeViewOptions(params);

		expect(result).toHaveProperty('controlledSelectedIds', controlledSelectedIds);
	});

	it('should not include controlledSelectedIds when undefined', () => {
		const params = {
			nodes: mockNodes,
			selectionMode: 'multiple' as const,
			controlledSelectedIds: undefined,
			controlledExpandedIds: undefined,
			defaultSelectedNodeIds: undefined,
			defaultExpandedNodeIds: undefined,
			onSelectionChange: undefined,
			onExpansionChange: undefined,
		};

		const result = buildTreeViewOptions(params);

		expect(result).not.toHaveProperty('controlledSelectedIds');
	});

	it('should include controlledExpandedIds when provided', () => {
		const controlledExpandedIds = ['node-3'];
		const params = {
			nodes: mockNodes,
			selectionMode: 'none' as const,
			controlledSelectedIds: undefined,
			controlledExpandedIds,
			defaultSelectedNodeIds: undefined,
			defaultExpandedNodeIds: undefined,
			onSelectionChange: undefined,
			onExpansionChange: undefined,
		};

		const result = buildTreeViewOptions(params);

		expect(result).toHaveProperty('controlledExpandedIds', controlledExpandedIds);
	});

	it('should not include controlledExpandedIds when undefined', () => {
		const params = {
			nodes: mockNodes,
			selectionMode: 'none' as const,
			controlledSelectedIds: undefined,
			controlledExpandedIds: undefined,
			defaultSelectedNodeIds: undefined,
			defaultExpandedNodeIds: undefined,
			onSelectionChange: undefined,
			onExpansionChange: undefined,
		};

		const result = buildTreeViewOptions(params);

		expect(result).not.toHaveProperty('controlledExpandedIds');
	});

	it('should include defaultSelectedNodeIds when provided', () => {
		const defaultSelectedNodeIds = ['node-1'];
		const params = {
			nodes: mockNodes,
			selectionMode: 'single' as const,
			controlledSelectedIds: undefined,
			controlledExpandedIds: undefined,
			defaultSelectedNodeIds,
			defaultExpandedNodeIds: undefined,
			onSelectionChange: undefined,
			onExpansionChange: undefined,
		};

		const result = buildTreeViewOptions(params);

		expect(result).toHaveProperty('defaultSelectedIds', defaultSelectedNodeIds);
	});

	it('should not include defaultSelectedNodeIds when undefined', () => {
		const params = {
			nodes: mockNodes,
			selectionMode: 'single' as const,
			controlledSelectedIds: undefined,
			controlledExpandedIds: undefined,
			defaultSelectedNodeIds: undefined,
			defaultExpandedNodeIds: undefined,
			onSelectionChange: undefined,
			onExpansionChange: undefined,
		};

		const result = buildTreeViewOptions(params);

		expect(result).not.toHaveProperty('defaultSelectedIds');
	});

	it('should include defaultExpandedNodeIds when provided', () => {
		const defaultExpandedNodeIds = ['node-3'];
		const params = {
			nodes: mockNodes,
			selectionMode: 'none' as const,
			controlledSelectedIds: undefined,
			controlledExpandedIds: undefined,
			defaultSelectedNodeIds: undefined,
			defaultExpandedNodeIds,
			onSelectionChange: undefined,
			onExpansionChange: undefined,
		};

		const result = buildTreeViewOptions(params);

		expect(result).toHaveProperty('defaultExpandedIds', defaultExpandedNodeIds);
	});

	it('should not include defaultExpandedNodeIds when undefined', () => {
		const params = {
			nodes: mockNodes,
			selectionMode: 'none' as const,
			controlledSelectedIds: undefined,
			controlledExpandedIds: undefined,
			defaultSelectedNodeIds: undefined,
			defaultExpandedNodeIds: undefined,
			onSelectionChange: undefined,
			onExpansionChange: undefined,
		};

		const result = buildTreeViewOptions(params);

		expect(result).not.toHaveProperty('defaultExpandedIds');
	});

	it('should include onSelectionChange when provided', () => {
		const onSelectionChange = vi.fn();
		const params = {
			nodes: mockNodes,
			selectionMode: 'multiple' as const,
			controlledSelectedIds: undefined,
			controlledExpandedIds: undefined,
			defaultSelectedNodeIds: undefined,
			defaultExpandedNodeIds: undefined,
			onSelectionChange,
			onExpansionChange: undefined,
		};

		const result = buildTreeViewOptions(params);

		expect(result).toHaveProperty('onSelectionChange', onSelectionChange);
	});

	it('should not include onSelectionChange when undefined', () => {
		const params = {
			nodes: mockNodes,
			selectionMode: 'multiple' as const,
			controlledSelectedIds: undefined,
			controlledExpandedIds: undefined,
			defaultSelectedNodeIds: undefined,
			defaultExpandedNodeIds: undefined,
			onSelectionChange: undefined,
			onExpansionChange: undefined,
		};

		const result = buildTreeViewOptions(params);

		expect(result).not.toHaveProperty('onSelectionChange');
	});

	it('should include onExpansionChange when provided', () => {
		const onExpansionChange = vi.fn();
		const params = {
			nodes: mockNodes,
			selectionMode: 'none' as const,
			controlledSelectedIds: undefined,
			controlledExpandedIds: undefined,
			defaultSelectedNodeIds: undefined,
			defaultExpandedNodeIds: undefined,
			onSelectionChange: undefined,
			onExpansionChange,
		};

		const result = buildTreeViewOptions(params);

		expect(result).toHaveProperty('onExpansionChange', onExpansionChange);
	});

	it('should not include onExpansionChange when undefined', () => {
		const params = {
			nodes: mockNodes,
			selectionMode: 'none' as const,
			controlledSelectedIds: undefined,
			controlledExpandedIds: undefined,
			defaultSelectedNodeIds: undefined,
			defaultExpandedNodeIds: undefined,
			onSelectionChange: undefined,
			onExpansionChange: undefined,
		};

		const result = buildTreeViewOptions(params);

		expect(result).not.toHaveProperty('onExpansionChange');
	});

	it('should build options with all properties when provided', () => {
		const controlledSelectedIds = ['node-1'];
		const controlledExpandedIds = ['node-3'];
		const defaultSelectedNodeIds = ['node-2'];
		const defaultExpandedNodeIds = ['node-3'];
		const onSelectionChange = vi.fn();
		const onExpansionChange = vi.fn();

		const params = {
			nodes: mockNodes,
			selectionMode: 'multiple' as const,
			controlledSelectedIds,
			controlledExpandedIds,
			defaultSelectedNodeIds,
			defaultExpandedNodeIds,
			onSelectionChange,
			onExpansionChange,
		};

		const result = buildTreeViewOptions(params);

		expect(result).toEqual({
			nodes: mockNodes,
			selectionMode: 'multiple',
			controlledSelectedIds,
			controlledExpandedIds,
			defaultSelectedIds: defaultSelectedNodeIds,
			defaultExpandedIds: defaultExpandedNodeIds,
			onSelectionChange,
			onExpansionChange,
		});
	});

	it('should handle empty nodes array', () => {
		const params = {
			nodes: [] as readonly TreeNode[],
			selectionMode: 'none' as const,
			controlledSelectedIds: undefined,
			controlledExpandedIds: undefined,
			defaultSelectedNodeIds: undefined,
			defaultExpandedNodeIds: undefined,
			onSelectionChange: undefined,
			onExpansionChange: undefined,
		};

		const result = buildTreeViewOptions(params);

		expect(result.nodes).toEqual([]);
		expect(result.selectionMode).toBe('none');
	});
});

describe('useTreeViewState', () => {
	it('should call useTreeView with built options', () => {
		const params = {
			nodes: mockNodes,
			selectionMode: 'none' as const,
			controlledSelectedIds: undefined,
			controlledExpandedIds: undefined,
			defaultSelectedNodeIds: undefined,
			defaultExpandedNodeIds: undefined,
			onSelectionChange: undefined,
			onExpansionChange: undefined,
		};

		const { result } = renderHook(() => useTreeViewState(params));

		expect(result.current).toBeDefined();
		expect(result.current).toHaveProperty('selectedNodeIds');
		expect(result.current).toHaveProperty('expandedNodeIds');
		expect(result.current).toHaveProperty('isSelected');
		expect(result.current).toHaveProperty('isExpanded');
		expect(result.current).toHaveProperty('toggleSelection');
		expect(result.current).toHaveProperty('toggleExpansion');
		expect(result.current).toHaveProperty('getAllNodeIds');
		expect(result.current).toHaveProperty('getNodeById');
	});

	it('should memoize options based on params', () => {
		const params = {
			nodes: mockNodes,
			selectionMode: 'single' as const,
			controlledSelectedIds: undefined,
			controlledExpandedIds: undefined,
			defaultSelectedNodeIds: ['node-1'],
			defaultExpandedNodeIds: undefined,
			onSelectionChange: undefined,
			onExpansionChange: undefined,
		};

		const { result, rerender } = renderHook(({ params }) => useTreeViewState(params), {
			initialProps: { params },
		});

		const initialSelectedIds = result.current.selectedNodeIds;
		const initialGetAllNodeIds = result.current.getAllNodeIds();

		// Rerender with same params - should maintain same reference
		rerender({ params });

		expect(result.current.selectedNodeIds).toBe(initialSelectedIds);
		expect(result.current.getAllNodeIds()).toEqual(initialGetAllNodeIds);

		// Rerender with different nodes - should update
		const newNodes: readonly TreeNode[] = [createMockNode('node-4', 'Node 4')] as const;
		const newParams = {
			...params,
			nodes: newNodes,
		};
		rerender({ params: newParams });

		// The nodes should change
		expect(result.current.getAllNodeIds()).not.toEqual(initialGetAllNodeIds);
		expect(result.current.getAllNodeIds()).toEqual(['node-4']);
	});

	it('should handle controlled selection mode', () => {
		const controlledSelectedIds = ['node-1'];
		const params = {
			nodes: mockNodes,
			selectionMode: 'single' as const,
			controlledSelectedIds,
			controlledExpandedIds: undefined,
			defaultSelectedNodeIds: undefined,
			defaultExpandedNodeIds: undefined,
			onSelectionChange: undefined,
			onExpansionChange: undefined,
		};

		const { result } = renderHook(() => useTreeViewState(params));

		expect(result.current.isSelected('node-1')).toBe(true);
		expect(result.current.isSelected('node-2')).toBe(false);
	});

	it('should handle default selection mode', () => {
		const defaultSelectedNodeIds = ['node-2'];
		const params = {
			nodes: mockNodes,
			selectionMode: 'multiple' as const,
			controlledSelectedIds: undefined,
			controlledExpandedIds: undefined,
			defaultSelectedNodeIds,
			defaultExpandedNodeIds: undefined,
			onSelectionChange: undefined,
			onExpansionChange: undefined,
		};

		const { result } = renderHook(() => useTreeViewState(params));

		expect(result.current.isSelected('node-2')).toBe(true);
		expect(result.current.isSelected('node-1')).toBe(false);
	});
});

describe('extractSetupProps', () => {
	it('should extract all props from TreeViewProps', () => {
		const onSelectionChange = vi.fn();
		const onExpansionChange = vi.fn();
		const onNodeClick = vi.fn();
		const onNodeDoubleClick = vi.fn();

		const props: TreeViewProps = {
			nodes: mockNodes,
			selectionMode: 'multiple',
			selectedNodeIds: ['node-1'],
			expandedNodeIds: ['node-3'],
			defaultSelectedNodeIds: ['node-2'],
			defaultExpandedNodeIds: ['node-3'],
			onSelectionChange,
			onExpansionChange,
			onNodeClick,
			onNodeDoubleClick,
		};

		const result = extractSetupProps(props);

		expect(result).toEqual({
			nodes: mockNodes,
			selectionMode: 'multiple',
			controlledSelectedIds: ['node-1'],
			controlledExpandedIds: ['node-3'],
			defaultSelectedNodeIds: ['node-2'],
			defaultExpandedNodeIds: ['node-3'],
			onSelectionChange,
			onExpansionChange,
			onNodeClick,
			onNodeDoubleClick,
		});
	});

	it('should use default selectionMode when not provided', () => {
		const props: TreeViewProps = {
			nodes: mockNodes,
		};

		const result = extractSetupProps(props);

		expect(result.selectionMode).toBe('none');
	});

	it('should map selectedNodeIds to controlledSelectedIds', () => {
		const props: TreeViewProps = {
			nodes: mockNodes,
			selectedNodeIds: ['node-1', 'node-2'],
		};

		const result = extractSetupProps(props);

		expect(result.controlledSelectedIds).toEqual(['node-1', 'node-2']);
	});

	it('should map expandedNodeIds to controlledExpandedIds', () => {
		const props: TreeViewProps = {
			nodes: mockNodes,
			expandedNodeIds: ['node-3'],
		};

		const result = extractSetupProps(props);

		expect(result.controlledExpandedIds).toEqual(['node-3']);
	});

	it('should handle undefined optional props', () => {
		const props: TreeViewProps = {
			nodes: mockNodes,
		};

		const result = extractSetupProps(props);

		expect(result.controlledSelectedIds).toBeUndefined();
		expect(result.controlledExpandedIds).toBeUndefined();
		expect(result.defaultSelectedNodeIds).toBeUndefined();
		expect(result.defaultExpandedNodeIds).toBeUndefined();
		expect(result.onSelectionChange).toBeUndefined();
		expect(result.onExpansionChange).toBeUndefined();
		expect(result.onNodeClick).toBeUndefined();
		expect(result.onNodeDoubleClick).toBeUndefined();
	});

	it('should handle all selection modes', () => {
		const modes: TreeViewProps['selectionMode'][] = ['none', 'single', 'multiple'];

		for (const mode of modes) {
			const props: TreeViewProps = {
				nodes: mockNodes,
				...(mode !== undefined && { selectionMode: mode }),
			};

			const result = extractSetupProps(props);

			expect(result.selectionMode).toBe(mode);
		}
	});

	it('should preserve all callback functions', () => {
		const onSelectionChange = vi.fn();
		const onExpansionChange = vi.fn();
		const onNodeClick = vi.fn();
		const onNodeDoubleClick = vi.fn();

		const props: TreeViewProps = {
			nodes: mockNodes,
			onSelectionChange,
			onExpansionChange,
			onNodeClick,
			onNodeDoubleClick,
		};

		const result = extractSetupProps(props);

		expect(result.onSelectionChange).toBe(onSelectionChange);
		expect(result.onExpansionChange).toBe(onExpansionChange);
		expect(result.onNodeClick).toBe(onNodeClick);
		expect(result.onNodeDoubleClick).toBe(onNodeDoubleClick);
	});

	it('should handle empty nodes array', () => {
		const props: TreeViewProps = {
			nodes: [],
		};

		const result = extractSetupProps(props);

		expect(result.nodes).toEqual([]);
		expect(result.selectionMode).toBe('none');
	});

	it('should handle props with only nodes', () => {
		const props: TreeViewProps = {
			nodes: mockNodes,
		};

		const result = extractSetupProps(props);

		expect(result).toEqual({
			nodes: mockNodes,
			selectionMode: 'none',
			controlledSelectedIds: undefined,
			controlledExpandedIds: undefined,
			defaultSelectedNodeIds: undefined,
			defaultExpandedNodeIds: undefined,
			onSelectionChange: undefined,
			onExpansionChange: undefined,
			onNodeClick: undefined,
			onNodeDoubleClick: undefined,
		});
	});

	it('should handle readonly props', () => {
		const props: Readonly<TreeViewProps> = {
			nodes: mockNodes,
			selectionMode: 'single',
		} as const;

		const result = extractSetupProps(props);

		expect(result.nodes).toBe(mockNodes);
		expect(result.selectionMode).toBe('single');
	});
});
