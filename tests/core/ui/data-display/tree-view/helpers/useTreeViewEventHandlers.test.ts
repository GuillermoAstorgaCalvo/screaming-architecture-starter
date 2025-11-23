/**
 * Tests for useTreeViewEventHandlers hook
 *
 * Tests event handlers for tree nodes:
 * - Click handlers (single and double click)
 * - Toggle selection handler
 * - Expansion/collapse handlers
 * - Combined event handlers
 */

import { useTreeViewEventHandlers } from '@core/ui/data-display/tree-view/helpers/useTreeViewEventHandlers';
import type { TreeNode } from '@src-types/ui/navigation/treeView';
import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

// Test data
const createMockNode = (id: string, label: string = `Node ${id}`): TreeNode => ({
	id,
	label,
});

describe('useTreeViewEventHandlers', () => {
	describe('Click Handlers', () => {
		it('should call onNodeClick when handleNodeClick is invoked', () => {
			const onNodeClick = vi.fn();
			const node = createMockNode('node-1');
			const nodeId = 'node-1';

			const { result } = renderHook(() =>
				useTreeViewEventHandlers({
					onNodeClick,
					selectionMode: 'none',
					toggleSelection: vi.fn(),
					expandNode: vi.fn(),
					collapseNode: vi.fn(),
				})
			);

			result.current.handleNodeClick(nodeId, node);

			expect(onNodeClick).toHaveBeenCalledTimes(1);
			expect(onNodeClick).toHaveBeenCalledWith(nodeId, node);
		});

		it('should not call onNodeClick when it is not provided', () => {
			const node = createMockNode('node-1');
			const nodeId = 'node-1';

			const { result } = renderHook(() =>
				useTreeViewEventHandlers({
					selectionMode: 'none',
					toggleSelection: vi.fn(),
					expandNode: vi.fn(),
					collapseNode: vi.fn(),
				})
			);

			expect(() => result.current.handleNodeClick(nodeId, node)).not.toThrow();
		});

		it('should call onNodeDoubleClick when handleNodeDoubleClick is invoked', () => {
			const onNodeDoubleClick = vi.fn();
			const node = createMockNode('node-1');
			const nodeId = 'node-1';

			const { result } = renderHook(() =>
				useTreeViewEventHandlers({
					onNodeDoubleClick,
					selectionMode: 'none',
					toggleSelection: vi.fn(),
					expandNode: vi.fn(),
					collapseNode: vi.fn(),
				})
			);

			result.current.handleNodeDoubleClick(nodeId, node);

			expect(onNodeDoubleClick).toHaveBeenCalledTimes(1);
			expect(onNodeDoubleClick).toHaveBeenCalledWith(nodeId, node);
		});

		it('should not call onNodeDoubleClick when it is not provided', () => {
			const node = createMockNode('node-1');
			const nodeId = 'node-1';

			const { result } = renderHook(() =>
				useTreeViewEventHandlers({
					selectionMode: 'none',
					toggleSelection: vi.fn(),
					expandNode: vi.fn(),
					collapseNode: vi.fn(),
				})
			);

			expect(() => result.current.handleNodeDoubleClick(nodeId, node)).not.toThrow();
		});

		it('should handle multiple click events correctly', () => {
			const onNodeClick = vi.fn();
			const onNodeDoubleClick = vi.fn();
			const node1 = createMockNode('node-1');
			const node2 = createMockNode('node-2');

			const { result } = renderHook(() =>
				useTreeViewEventHandlers({
					onNodeClick,
					onNodeDoubleClick,
					selectionMode: 'none',
					toggleSelection: vi.fn(),
					expandNode: vi.fn(),
					collapseNode: vi.fn(),
				})
			);

			result.current.handleNodeClick('node-1', node1);
			result.current.handleNodeClick('node-2', node2);
			result.current.handleNodeDoubleClick('node-1', node1);

			expect(onNodeClick).toHaveBeenCalledTimes(2);
			expect(onNodeClick).toHaveBeenNthCalledWith(1, 'node-1', node1);
			expect(onNodeClick).toHaveBeenNthCalledWith(2, 'node-2', node2);
			expect(onNodeDoubleClick).toHaveBeenCalledTimes(1);
			expect(onNodeDoubleClick).toHaveBeenCalledWith('node-1', node1);
		});
	});

	describe('Toggle Handler', () => {
		it('should call toggleSelection when selectionMode is not "none"', () => {
			const toggleSelection = vi.fn();
			const nodeId = 'node-1';

			const { result } = renderHook(() =>
				useTreeViewEventHandlers({
					selectionMode: 'single',
					toggleSelection,
					expandNode: vi.fn(),
					collapseNode: vi.fn(),
				})
			);

			result.current.handleNodeToggle(nodeId);

			expect(toggleSelection).toHaveBeenCalledTimes(1);
			expect(toggleSelection).toHaveBeenCalledWith(nodeId);
		});

		it('should call toggleSelection when selectionMode is "multiple"', () => {
			const toggleSelection = vi.fn();
			const nodeId = 'node-1';

			const { result } = renderHook(() =>
				useTreeViewEventHandlers({
					selectionMode: 'multiple',
					toggleSelection,
					expandNode: vi.fn(),
					collapseNode: vi.fn(),
				})
			);

			result.current.handleNodeToggle(nodeId);

			expect(toggleSelection).toHaveBeenCalledTimes(1);
			expect(toggleSelection).toHaveBeenCalledWith(nodeId);
		});

		it('should not call toggleSelection when selectionMode is "none"', () => {
			const toggleSelection = vi.fn();
			const nodeId = 'node-1';

			const { result } = renderHook(() =>
				useTreeViewEventHandlers({
					selectionMode: 'none',
					toggleSelection,
					expandNode: vi.fn(),
					collapseNode: vi.fn(),
				})
			);

			result.current.handleNodeToggle(nodeId);

			expect(toggleSelection).not.toHaveBeenCalled();
		});

		it('should handle multiple toggle calls correctly', () => {
			const toggleSelection = vi.fn();

			const { result } = renderHook(() =>
				useTreeViewEventHandlers({
					selectionMode: 'single',
					toggleSelection,
					expandNode: vi.fn(),
					collapseNode: vi.fn(),
				})
			);

			result.current.handleNodeToggle('node-1');
			result.current.handleNodeToggle('node-2');
			result.current.handleNodeToggle('node-3');

			expect(toggleSelection).toHaveBeenCalledTimes(3);
			expect(toggleSelection).toHaveBeenNthCalledWith(1, 'node-1');
			expect(toggleSelection).toHaveBeenNthCalledWith(2, 'node-2');
			expect(toggleSelection).toHaveBeenNthCalledWith(3, 'node-3');
		});
	});

	describe('Expansion Handlers', () => {
		it('should call expandNode when handleNodeExpand is invoked', () => {
			const expandNode = vi.fn();
			const nodeId = 'node-1';

			const { result } = renderHook(() =>
				useTreeViewEventHandlers({
					selectionMode: 'none',
					toggleSelection: vi.fn(),
					expandNode,
					collapseNode: vi.fn(),
				})
			);

			result.current.handleNodeExpand(nodeId);

			expect(expandNode).toHaveBeenCalledTimes(1);
			expect(expandNode).toHaveBeenCalledWith(nodeId);
		});

		it('should call collapseNode when handleNodeCollapse is invoked', () => {
			const collapseNode = vi.fn();
			const nodeId = 'node-1';

			const { result } = renderHook(() =>
				useTreeViewEventHandlers({
					selectionMode: 'none',
					toggleSelection: vi.fn(),
					expandNode: vi.fn(),
					collapseNode,
				})
			);

			result.current.handleNodeCollapse(nodeId);

			expect(collapseNode).toHaveBeenCalledTimes(1);
			expect(collapseNode).toHaveBeenCalledWith(nodeId);
		});

		it('should handle multiple expansion/collapse calls correctly', () => {
			const expandNode = vi.fn();
			const collapseNode = vi.fn();

			const { result } = renderHook(() =>
				useTreeViewEventHandlers({
					selectionMode: 'none',
					toggleSelection: vi.fn(),
					expandNode,
					collapseNode,
				})
			);

			result.current.handleNodeExpand('node-1');
			result.current.handleNodeExpand('node-2');
			result.current.handleNodeCollapse('node-1');
			result.current.handleNodeCollapse('node-3');

			expect(expandNode).toHaveBeenCalledTimes(2);
			expect(expandNode).toHaveBeenNthCalledWith(1, 'node-1');
			expect(expandNode).toHaveBeenNthCalledWith(2, 'node-2');
			expect(collapseNode).toHaveBeenCalledTimes(2);
			expect(collapseNode).toHaveBeenNthCalledWith(1, 'node-1');
			expect(collapseNode).toHaveBeenNthCalledWith(2, 'node-3');
		});
	});

	describe('Combined Event Handlers', () => {
		it('should return all handlers when all callbacks are provided', () => {
			const onNodeClick = vi.fn();
			const onNodeDoubleClick = vi.fn();
			const toggleSelection = vi.fn();
			const expandNode = vi.fn();
			const collapseNode = vi.fn();

			const { result } = renderHook(() =>
				useTreeViewEventHandlers({
					onNodeClick,
					onNodeDoubleClick,
					selectionMode: 'single',
					toggleSelection,
					expandNode,
					collapseNode,
				})
			);

			expect(result.current).toHaveProperty('handleNodeClick');
			expect(result.current).toHaveProperty('handleNodeDoubleClick');
			expect(result.current).toHaveProperty('handleNodeToggle');
			expect(result.current).toHaveProperty('handleNodeExpand');
			expect(result.current).toHaveProperty('handleNodeCollapse');

			expect(typeof result.current.handleNodeClick).toBe('function');
			expect(typeof result.current.handleNodeDoubleClick).toBe('function');
			expect(typeof result.current.handleNodeToggle).toBe('function');
			expect(typeof result.current.handleNodeExpand).toBe('function');
			expect(typeof result.current.handleNodeCollapse).toBe('function');
		});

		it('should work correctly with all handlers together', () => {
			const onNodeClick = vi.fn();
			const onNodeDoubleClick = vi.fn();
			const toggleSelection = vi.fn();
			const expandNode = vi.fn();
			const collapseNode = vi.fn();
			const node = createMockNode('node-1');
			const nodeId = 'node-1';

			const { result } = renderHook(() =>
				useTreeViewEventHandlers({
					onNodeClick,
					onNodeDoubleClick,
					selectionMode: 'multiple',
					toggleSelection,
					expandNode,
					collapseNode,
				})
			);

			result.current.handleNodeClick(nodeId, node);
			result.current.handleNodeDoubleClick(nodeId, node);
			result.current.handleNodeToggle(nodeId);
			result.current.handleNodeExpand(nodeId);
			result.current.handleNodeCollapse(nodeId);

			expect(onNodeClick).toHaveBeenCalledTimes(1);
			expect(onNodeDoubleClick).toHaveBeenCalledTimes(1);
			expect(toggleSelection).toHaveBeenCalledTimes(1);
			expect(expandNode).toHaveBeenCalledTimes(1);
			expect(collapseNode).toHaveBeenCalledTimes(1);
		});

		it('should update handlers when params change', () => {
			const toggleSelection1 = vi.fn();
			const toggleSelection2 = vi.fn();

			const { result, rerender } = renderHook(
				({ toggleSelection }) =>
					useTreeViewEventHandlers({
						selectionMode: 'single',
						toggleSelection,
						expandNode: vi.fn(),
						collapseNode: vi.fn(),
					}),
				{
					initialProps: { toggleSelection: toggleSelection1 },
				}
			);

			const firstRenderHandler = result.current.handleNodeToggle;

			rerender({ toggleSelection: toggleSelection2 });

			// Handler should be a new reference when params change
			expect(result.current.handleNodeToggle).not.toBe(firstRenderHandler);

			// New handler should call the new function
			result.current.handleNodeToggle('node-1');
			expect(toggleSelection2).toHaveBeenCalledTimes(1);
			expect(toggleSelection1).not.toHaveBeenCalled();
		});
	});

	describe('Edge Cases', () => {
		it('should handle empty nodeId strings', () => {
			const onNodeClick = vi.fn();
			const toggleSelection = vi.fn();
			const expandNode = vi.fn();
			const collapseNode = vi.fn();
			const node = createMockNode('');

			const { result } = renderHook(() =>
				useTreeViewEventHandlers({
					onNodeClick,
					selectionMode: 'single',
					toggleSelection,
					expandNode,
					collapseNode,
				})
			);

			result.current.handleNodeClick('', node);
			result.current.handleNodeToggle('');
			result.current.handleNodeExpand('');
			result.current.handleNodeCollapse('');

			expect(onNodeClick).toHaveBeenCalledWith('', node);
			expect(toggleSelection).toHaveBeenCalledWith('');
			expect(expandNode).toHaveBeenCalledWith('');
			expect(collapseNode).toHaveBeenCalledWith('');
		});

		it('should handle nodes with complex data', () => {
			const onNodeClick = vi.fn();
			const complexNode: TreeNode = {
				id: 'node-1',
				label: 'Complex Node',
				icon: 'Icon',
				children: [createMockNode('child-1')],
				data: { custom: 'data', nested: { value: 123 } },
			};

			const { result } = renderHook(() =>
				useTreeViewEventHandlers({
					onNodeClick,
					selectionMode: 'none',
					toggleSelection: vi.fn(),
					expandNode: vi.fn(),
					collapseNode: vi.fn(),
				})
			);

			result.current.handleNodeClick('node-1', complexNode);

			expect(onNodeClick).toHaveBeenCalledWith('node-1', complexNode);
		});

		it('should handle rapid successive calls', () => {
			const onNodeClick = vi.fn();
			const toggleSelection = vi.fn();
			const node = createMockNode('node-1');

			const { result } = renderHook(() =>
				useTreeViewEventHandlers({
					onNodeClick,
					selectionMode: 'multiple',
					toggleSelection,
					expandNode: vi.fn(),
					collapseNode: vi.fn(),
				})
			);

			// Rapid successive calls
			for (let i = 0; i < 10; i++) {
				result.current.handleNodeClick('node-1', node);
				result.current.handleNodeToggle('node-1');
			}

			expect(onNodeClick).toHaveBeenCalledTimes(10);
			expect(toggleSelection).toHaveBeenCalledTimes(10);
		});
	});
});
