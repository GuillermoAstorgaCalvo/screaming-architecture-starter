/**
 * Tests for useTreeNodeUtils hook
 *
 * Tests the hook that provides utility functions for tree nodes:
 * - allNodeIds: memoized array of all node IDs
 * - getNodeById: callback to find a node by ID
 * - getAllNodeIds: callback to get all node IDs
 */

import { useTreeNodeUtils } from '@core/ui/data-display/tree-view/hooks/useTreeView.hooks';
import type { TreeNode } from '@src-types/ui/navigation/treeView';
import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

// Test data helper
const createMockNode = (id: string, label: string = `Node ${id}`): TreeNode => ({
	id,
	label,
});

describe('useTreeNodeUtils', () => {
	describe('allNodeIds', () => {
		it('should return empty array for empty nodes', () => {
			const { result } = renderHook(() => useTreeNodeUtils([]));
			expect(result.current.allNodeIds).toEqual([]);
		});

		it('should return IDs from single node', () => {
			const nodes: TreeNode[] = [createMockNode('node-1')];
			const { result } = renderHook(() => useTreeNodeUtils(nodes));
			expect(result.current.allNodeIds).toEqual(['node-1']);
		});

		it('should return IDs from multiple root nodes', () => {
			const nodes: TreeNode[] = [
				createMockNode('node-1'),
				createMockNode('node-2'),
				createMockNode('node-3'),
			];
			const { result } = renderHook(() => useTreeNodeUtils(nodes));
			expect(result.current.allNodeIds).toEqual(['node-1', 'node-2', 'node-3']);
		});

		it('should flatten IDs from nested tree structure', () => {
			const nodes: TreeNode[] = [
				{
					id: 'node-1',
					label: 'Node 1',
					children: [
						createMockNode('node-1-1'),
						{
							id: 'node-1-2',
							label: 'Node 1.2',
							children: [createMockNode('node-1-2-1')],
						},
					],
				},
				createMockNode('node-2'),
			];
			const { result } = renderHook(() => useTreeNodeUtils(nodes));
			expect(result.current.allNodeIds).toEqual([
				'node-1',
				'node-1-1',
				'node-1-2',
				'node-1-2-1',
				'node-2',
			]);
		});

		it('should handle deeply nested structures', () => {
			const nodes: TreeNode[] = [
				{
					id: 'level-1',
					label: 'Level 1',
					children: [
						{
							id: 'level-2',
							label: 'Level 2',
							children: [
								{
									id: 'level-3',
									label: 'Level 3',
									children: [createMockNode('level-4')],
								},
							],
						},
					],
				},
			];
			const { result } = renderHook(() => useTreeNodeUtils(nodes));
			expect(result.current.allNodeIds).toEqual(['level-1', 'level-2', 'level-3', 'level-4']);
		});

		it('should memoize allNodeIds when nodes do not change', () => {
			const nodes: TreeNode[] = [createMockNode('node-1'), createMockNode('node-2')];
			const { result, rerender } = renderHook(() => useTreeNodeUtils(nodes));

			const firstResult = result.current.allNodeIds;
			rerender();
			const secondResult = result.current.allNodeIds;

			expect(firstResult).toBe(secondResult);
		});

		it('should update allNodeIds when nodes change', () => {
			const initialNodes: TreeNode[] = [createMockNode('node-1')];
			const { result, rerender } = renderHook(({ nodes }) => useTreeNodeUtils(nodes), {
				initialProps: { nodes: initialNodes },
			});

			expect(result.current.allNodeIds).toEqual(['node-1']);

			const updatedNodes: TreeNode[] = [createMockNode('node-1'), createMockNode('node-2')];
			rerender({ nodes: updatedNodes });

			expect(result.current.allNodeIds).toEqual(['node-1', 'node-2']);
		});
	});

	describe('getNodeById', () => {
		it('should return undefined for empty nodes', () => {
			const { result } = renderHook(() => useTreeNodeUtils([]));
			expect(result.current.getNodeById('non-existent')).toBeUndefined();
		});

		it('should find a root node by ID', () => {
			const nodes: TreeNode[] = [createMockNode('node-1'), createMockNode('node-2')];
			const { result } = renderHook(() => useTreeNodeUtils(nodes));
			const found = result.current.getNodeById('node-1');
			expect(found).toBeDefined();
			expect(found?.id).toBe('node-1');
		});

		it('should find a nested node by ID', () => {
			const nodes: TreeNode[] = [
				{
					id: 'node-1',
					label: 'Node 1',
					children: [
						createMockNode('node-1-1'),
						{
							id: 'node-1-2',
							label: 'Node 1.2',
							children: [createMockNode('node-1-2-1')],
						},
					],
				},
			];
			const { result } = renderHook(() => useTreeNodeUtils(nodes));
			const found = result.current.getNodeById('node-1-2-1');
			expect(found).toBeDefined();
			expect(found?.id).toBe('node-1-2-1');
		});

		it('should return undefined for non-existent node ID', () => {
			const nodes: TreeNode[] = [createMockNode('node-1')];
			const { result } = renderHook(() => useTreeNodeUtils(nodes));
			expect(result.current.getNodeById('non-existent')).toBeUndefined();
		});

		it('should find nodes at different nesting levels', () => {
			const nodes: TreeNode[] = [
				{
					id: 'root-1',
					label: 'Root 1',
					children: [
						{
							id: 'level-2',
							label: 'Level 2',
							children: [createMockNode('level-3')],
						},
					],
				},
			];
			const { result } = renderHook(() => useTreeNodeUtils(nodes));

			const rootNode = result.current.getNodeById('root-1');
			expect(rootNode?.id).toBe('root-1');

			const level2Node = result.current.getNodeById('level-2');
			expect(level2Node?.id).toBe('level-2');

			const level3Node = result.current.getNodeById('level-3');
			expect(level3Node?.id).toBe('level-3');
		});

		it('should return the same node reference when called multiple times', () => {
			const nodes: TreeNode[] = [
				{
					id: 'node-1',
					label: 'Node 1',
					children: [createMockNode('node-1-1')],
				},
			];
			const { result } = renderHook(() => useTreeNodeUtils(nodes));

			const firstCall = result.current.getNodeById('node-1-1');
			const secondCall = result.current.getNodeById('node-1-1');

			expect(firstCall).toBe(secondCall);
		});

		it('should maintain callback stability when nodes do not change', () => {
			const nodes: TreeNode[] = [createMockNode('node-1')];
			const { result, rerender } = renderHook(() => useTreeNodeUtils(nodes));

			const firstCallback = result.current.getNodeById;
			rerender();
			const secondCallback = result.current.getNodeById;

			expect(firstCallback).toBe(secondCallback);
		});

		it('should update callback when nodes change', () => {
			const initialNodes: TreeNode[] = [createMockNode('node-1')];
			const { result, rerender } = renderHook(({ nodes }) => useTreeNodeUtils(nodes), {
				initialProps: { nodes: initialNodes },
			});

			const initialCallback = result.current.getNodeById;
			expect(initialCallback('node-1')).toBeDefined();

			const updatedNodes: TreeNode[] = [createMockNode('node-2')];
			rerender({ nodes: updatedNodes });

			expect(result.current.getNodeById('node-1')).toBeUndefined();
			expect(result.current.getNodeById('node-2')).toBeDefined();
		});
	});

	describe('getAllNodeIds', () => {
		it('should return empty array for empty nodes', () => {
			const { result } = renderHook(() => useTreeNodeUtils([]));
			expect(result.current.getAllNodeIds()).toEqual([]);
		});

		it('should return all node IDs', () => {
			const nodes: TreeNode[] = [createMockNode('node-1'), createMockNode('node-2')];
			const { result } = renderHook(() => useTreeNodeUtils(nodes));
			expect(result.current.getAllNodeIds()).toEqual(['node-1', 'node-2']);
		});

		it('should return all node IDs from nested structure', () => {
			const nodes: TreeNode[] = [
				{
					id: 'node-1',
					label: 'Node 1',
					children: [
						createMockNode('node-1-1'),
						{
							id: 'node-1-2',
							label: 'Node 1.2',
							children: [createMockNode('node-1-2-1')],
						},
					],
				},
			];
			const { result } = renderHook(() => useTreeNodeUtils(nodes));
			expect(result.current.getAllNodeIds()).toEqual([
				'node-1',
				'node-1-1',
				'node-1-2',
				'node-1-2-1',
			]);
		});

		it('should return the same array reference as allNodeIds', () => {
			const nodes: TreeNode[] = [createMockNode('node-1')];
			const { result } = renderHook(() => useTreeNodeUtils(nodes));
			expect(result.current.getAllNodeIds()).toBe(result.current.allNodeIds);
		});

		it('should maintain callback stability when nodes do not change', () => {
			const nodes: TreeNode[] = [createMockNode('node-1')];
			const { result, rerender } = renderHook(() => useTreeNodeUtils(nodes));

			const firstCallback = result.current.getAllNodeIds;
			rerender();
			const secondCallback = result.current.getAllNodeIds;

			expect(firstCallback).toBe(secondCallback);
		});

		it('should update callback when nodes change', () => {
			const initialNodes: TreeNode[] = [createMockNode('node-1')];
			const { result, rerender } = renderHook(({ nodes }) => useTreeNodeUtils(nodes), {
				initialProps: { nodes: initialNodes },
			});

			expect(result.current.getAllNodeIds()).toEqual(['node-1']);

			const updatedNodes: TreeNode[] = [createMockNode('node-1'), createMockNode('node-2')];
			rerender({ nodes: updatedNodes });

			expect(result.current.getAllNodeIds()).toEqual(['node-1', 'node-2']);
		});
	});

	describe('Integration', () => {
		it('should work correctly with complex tree structure', () => {
			const nodes: TreeNode[] = [
				{
					id: 'root-1',
					label: 'Root 1',
					children: [
						createMockNode('child-1-1'),
						{
							id: 'child-1-2',
							label: 'Child 1.2',
							children: [createMockNode('grandchild-1-2-1'), createMockNode('grandchild-1-2-2')],
						},
					],
				},
				{
					id: 'root-2',
					label: 'Root 2',
					children: [createMockNode('child-2-1')],
				},
			];

			const { result } = renderHook(() => useTreeNodeUtils(nodes));

			// Test allNodeIds
			expect(result.current.allNodeIds).toEqual([
				'root-1',
				'child-1-1',
				'child-1-2',
				'grandchild-1-2-1',
				'grandchild-1-2-2',
				'root-2',
				'child-2-1',
			]);

			// Test getNodeById for various nodes
			expect(result.current.getNodeById('root-1')?.id).toBe('root-1');
			expect(result.current.getNodeById('child-1-1')?.id).toBe('child-1-1');
			expect(result.current.getNodeById('grandchild-1-2-1')?.id).toBe('grandchild-1-2-1');
			expect(result.current.getNodeById('root-2')?.id).toBe('root-2');
			expect(result.current.getNodeById('non-existent')).toBeUndefined();

			// Test getAllNodeIds
			expect(result.current.getAllNodeIds()).toEqual(result.current.allNodeIds);
		});

		it('should handle readonly nodes array', () => {
			const nodes: readonly TreeNode[] = [
				createMockNode('node-1'),
				createMockNode('node-2'),
			] as const;
			const { result } = renderHook(() => useTreeNodeUtils(nodes));

			expect(result.current.allNodeIds).toEqual(['node-1', 'node-2']);
			expect(result.current.getNodeById('node-1')?.id).toBe('node-1');
			expect(result.current.getAllNodeIds()).toEqual(['node-1', 'node-2']);
		});
	});
});
