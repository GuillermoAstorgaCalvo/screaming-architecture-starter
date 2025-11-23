/**
 * Tests for useTreeViewKeyboard hook
 *
 * Tests keyboard navigation functionality:
 * - Navigation functions (getNextNodeId, getFirstNodeId, getLastNodeId)
 * - Keyboard event handlers (ArrowRight, ArrowLeft, ArrowDown, ArrowUp, Home, End, Enter, Space)
 * - Edge cases (empty nodes, no expanded nodes, etc.)
 */

import { useTreeViewKeyboard } from '@core/ui/data-display/tree-view/hooks/useTreeViewKeyboard';
import type { TreeNode } from '@src-types/ui/navigation/treeView';
import { renderHook } from '@testing-library/react';
import type { KeyboardEvent } from 'react';
import { describe, expect, it, vi } from 'vitest';

// Test data
const createMockNode = (
	id: string,
	label: string = `Node ${id}`,
	children?: TreeNode[]
): TreeNode => ({
	id,
	label,
	...(children && { children }),
});

const createMockKeyboardEvent = (key: string): KeyboardEvent<HTMLDivElement> => {
	return {
		key,
		preventDefault: vi.fn(),
		stopPropagation: vi.fn(),
	} as unknown as KeyboardEvent<HTMLDivElement>;
};

describe('useTreeViewKeyboard', () => {
	describe('Hook Initialization', () => {
		it('should return all required functions', () => {
			const nodes: TreeNode[] = [createMockNode('node-1')];
			const expandedNodeIds = new Set<string>();

			const { result } = renderHook(() =>
				useTreeViewKeyboard({
					nodes,
					expandedNodeIds,
					onNodeSelect: vi.fn(),
					onNodeExpand: vi.fn(),
					onNodeCollapse: vi.fn(),
					onNodeToggle: vi.fn(),
				})
			);

			expect(result.current.handleKeyDown).toBeDefined();
			expect(typeof result.current.handleKeyDown).toBe('function');
			expect(result.current.getNextNodeId).toBeDefined();
			expect(typeof result.current.getNextNodeId).toBe('function');
			expect(result.current.getFirstNodeId).toBeDefined();
			expect(typeof result.current.getFirstNodeId).toBe('function');
			expect(result.current.getLastNodeId).toBeDefined();
			expect(typeof result.current.getLastNodeId).toBe('function');
		});
	});

	describe('getNextNodeId', () => {
		it('should return next node ID when direction is "next"', () => {
			const nodes: TreeNode[] = [
				createMockNode('node-1'),
				createMockNode('node-2'),
				createMockNode('node-3'),
			];
			const expandedNodeIds = new Set<string>();

			const { result } = renderHook(() =>
				useTreeViewKeyboard({
					nodes,
					expandedNodeIds,
					onNodeSelect: vi.fn(),
					onNodeExpand: vi.fn(),
					onNodeCollapse: vi.fn(),
					onNodeToggle: vi.fn(),
				})
			);

			expect(result.current.getNextNodeId('node-1', 'next')).toBe('node-2');
			expect(result.current.getNextNodeId('node-2', 'next')).toBe('node-3');
		});

		it('should return previous node ID when direction is "previous"', () => {
			const nodes: TreeNode[] = [
				createMockNode('node-1'),
				createMockNode('node-2'),
				createMockNode('node-3'),
			];
			const expandedNodeIds = new Set<string>();

			const { result } = renderHook(() =>
				useTreeViewKeyboard({
					nodes,
					expandedNodeIds,
					onNodeSelect: vi.fn(),
					onNodeExpand: vi.fn(),
					onNodeCollapse: vi.fn(),
					onNodeToggle: vi.fn(),
				})
			);

			expect(result.current.getNextNodeId('node-3', 'previous')).toBe('node-2');
			expect(result.current.getNextNodeId('node-2', 'previous')).toBe('node-1');
		});

		it('should return null when at the last node and direction is "next"', () => {
			const nodes: TreeNode[] = [createMockNode('node-1'), createMockNode('node-2')];
			const expandedNodeIds = new Set<string>();

			const { result } = renderHook(() =>
				useTreeViewKeyboard({
					nodes,
					expandedNodeIds,
					onNodeSelect: vi.fn(),
					onNodeExpand: vi.fn(),
					onNodeCollapse: vi.fn(),
					onNodeToggle: vi.fn(),
				})
			);

			expect(result.current.getNextNodeId('node-2', 'next')).toBeNull();
		});

		it('should return null when at the first node and direction is "previous"', () => {
			const nodes: TreeNode[] = [createMockNode('node-1'), createMockNode('node-2')];
			const expandedNodeIds = new Set<string>();

			const { result } = renderHook(() =>
				useTreeViewKeyboard({
					nodes,
					expandedNodeIds,
					onNodeSelect: vi.fn(),
					onNodeExpand: vi.fn(),
					onNodeCollapse: vi.fn(),
					onNodeToggle: vi.fn(),
				})
			);

			expect(result.current.getNextNodeId('node-1', 'previous')).toBeNull();
		});

		it('should handle nested nodes correctly when expanded', () => {
			const nodes: TreeNode[] = [
				createMockNode('node-1', 'Node 1', [
					createMockNode('node-1-1', 'Node 1.1'),
					createMockNode('node-1-2', 'Node 1.2'),
				]),
				createMockNode('node-2', 'Node 2'),
			];
			const expandedNodeIds = new Set<string>(['node-1']);

			const { result } = renderHook(() =>
				useTreeViewKeyboard({
					nodes,
					expandedNodeIds,
					onNodeSelect: vi.fn(),
					onNodeExpand: vi.fn(),
					onNodeCollapse: vi.fn(),
					onNodeToggle: vi.fn(),
				})
			);

			expect(result.current.getNextNodeId('node-1', 'next')).toBe('node-1-1');
			expect(result.current.getNextNodeId('node-1-1', 'next')).toBe('node-1-2');
			expect(result.current.getNextNodeId('node-1-2', 'next')).toBe('node-2');
		});

		it('should skip collapsed child nodes', () => {
			const nodes: TreeNode[] = [
				createMockNode('node-1', 'Node 1', [createMockNode('node-1-1', 'Node 1.1')]),
				createMockNode('node-2', 'Node 2'),
			];
			const expandedNodeIds = new Set<string>(); // node-1 is collapsed

			const { result } = renderHook(() =>
				useTreeViewKeyboard({
					nodes,
					expandedNodeIds,
					onNodeSelect: vi.fn(),
					onNodeExpand: vi.fn(),
					onNodeCollapse: vi.fn(),
					onNodeToggle: vi.fn(),
				})
			);

			expect(result.current.getNextNodeId('node-1', 'next')).toBe('node-2');
		});

		it('should return first node when current node ID is not found', () => {
			const nodes: TreeNode[] = [createMockNode('node-1'), createMockNode('node-2')];
			const expandedNodeIds = new Set<string>();

			const { result } = renderHook(() =>
				useTreeViewKeyboard({
					nodes,
					expandedNodeIds,
					onNodeSelect: vi.fn(),
					onNodeExpand: vi.fn(),
					onNodeCollapse: vi.fn(),
					onNodeToggle: vi.fn(),
				})
			);

			expect(result.current.getNextNodeId('non-existent', 'next')).toBe('node-1');
		});
	});

	describe('getFirstNodeId', () => {
		it('should return first node ID', () => {
			const nodes: TreeNode[] = [
				createMockNode('node-1'),
				createMockNode('node-2'),
				createMockNode('node-3'),
			];
			const expandedNodeIds = new Set<string>();

			const { result } = renderHook(() =>
				useTreeViewKeyboard({
					nodes,
					expandedNodeIds,
					onNodeSelect: vi.fn(),
					onNodeExpand: vi.fn(),
					onNodeCollapse: vi.fn(),
					onNodeToggle: vi.fn(),
				})
			);

			expect(result.current.getFirstNodeId()).toBe('node-1');
		});

		it('should return null when there are no nodes', () => {
			const nodes: TreeNode[] = [];
			const expandedNodeIds = new Set<string>();

			const { result } = renderHook(() =>
				useTreeViewKeyboard({
					nodes,
					expandedNodeIds,
					onNodeSelect: vi.fn(),
					onNodeExpand: vi.fn(),
					onNodeCollapse: vi.fn(),
					onNodeToggle: vi.fn(),
				})
			);

			expect(result.current.getFirstNodeId()).toBeNull();
		});
	});

	describe('getLastNodeId', () => {
		it('should return last node ID', () => {
			const nodes: TreeNode[] = [
				createMockNode('node-1'),
				createMockNode('node-2'),
				createMockNode('node-3'),
			];
			const expandedNodeIds = new Set<string>();

			const { result } = renderHook(() =>
				useTreeViewKeyboard({
					nodes,
					expandedNodeIds,
					onNodeSelect: vi.fn(),
					onNodeExpand: vi.fn(),
					onNodeCollapse: vi.fn(),
					onNodeToggle: vi.fn(),
				})
			);

			expect(result.current.getLastNodeId()).toBe('node-3');
		});

		it('should return last visible node ID when nodes are expanded', () => {
			const nodes: TreeNode[] = [
				createMockNode('node-1', 'Node 1', [
					createMockNode('node-1-1', 'Node 1.1'),
					createMockNode('node-1-2', 'Node 1.2'),
				]),
				createMockNode('node-2', 'Node 2'),
			];
			const expandedNodeIds = new Set<string>(['node-1']);

			const { result } = renderHook(() =>
				useTreeViewKeyboard({
					nodes,
					expandedNodeIds,
					onNodeSelect: vi.fn(),
					onNodeExpand: vi.fn(),
					onNodeCollapse: vi.fn(),
					onNodeToggle: vi.fn(),
				})
			);

			expect(result.current.getLastNodeId()).toBe('node-2');
		});

		it('should return null when there are no nodes', () => {
			const nodes: TreeNode[] = [];
			const expandedNodeIds = new Set<string>();

			const { result } = renderHook(() =>
				useTreeViewKeyboard({
					nodes,
					expandedNodeIds,
					onNodeSelect: vi.fn(),
					onNodeExpand: vi.fn(),
					onNodeCollapse: vi.fn(),
					onNodeToggle: vi.fn(),
				})
			);

			expect(result.current.getLastNodeId()).toBeNull();
		});
	});

	describe('handleKeyDown - ArrowRight', () => {
		it('should expand node when node is collapsed and has children', () => {
			const nodes: TreeNode[] = [
				createMockNode('node-1', 'Node 1', [createMockNode('node-1-1', 'Node 1.1')]),
			];
			const expandedNodeIds = new Set<string>();
			const onNodeExpand = vi.fn();

			const { result } = renderHook(() =>
				useTreeViewKeyboard({
					nodes,
					expandedNodeIds,
					onNodeSelect: vi.fn(),
					onNodeExpand,
					onNodeCollapse: vi.fn(),
					onNodeToggle: vi.fn(),
				})
			);

			const event = createMockKeyboardEvent('ArrowRight');
			result.current.handleKeyDown(event, 'node-1');

			expect(onNodeExpand).toHaveBeenCalledTimes(1);
			expect(onNodeExpand).toHaveBeenCalledWith('node-1');
			expect(event.preventDefault).toHaveBeenCalled();
		});

		it('should move to first child when node is expanded and has children', () => {
			const nodes: TreeNode[] = [
				createMockNode('node-1', 'Node 1', [
					createMockNode('node-1-1', 'Node 1.1'),
					createMockNode('node-1-2', 'Node 1.2'),
				]),
			];
			const expandedNodeIds = new Set<string>(['node-1']);
			const onNodeSelect = vi.fn();

			const { result } = renderHook(() =>
				useTreeViewKeyboard({
					nodes,
					expandedNodeIds,
					onNodeSelect,
					onNodeExpand: vi.fn(),
					onNodeCollapse: vi.fn(),
					onNodeToggle: vi.fn(),
				})
			);

			const event = createMockKeyboardEvent('ArrowRight');
			result.current.handleKeyDown(event, 'node-1');

			expect(onNodeSelect).toHaveBeenCalledTimes(1);
			expect(onNodeSelect).toHaveBeenCalledWith('node-1-1');
			expect(event.preventDefault).toHaveBeenCalled();
		});

		it('should do nothing when node has no children', () => {
			const nodes: TreeNode[] = [createMockNode('node-1', 'Node 1')];
			const expandedNodeIds = new Set<string>();
			const onNodeExpand = vi.fn();
			const onNodeSelect = vi.fn();

			const { result } = renderHook(() =>
				useTreeViewKeyboard({
					nodes,
					expandedNodeIds,
					onNodeSelect,
					onNodeExpand,
					onNodeCollapse: vi.fn(),
					onNodeToggle: vi.fn(),
				})
			);

			const event = createMockKeyboardEvent('ArrowRight');
			result.current.handleKeyDown(event, 'node-1');

			expect(onNodeExpand).not.toHaveBeenCalled();
			expect(onNodeSelect).not.toHaveBeenCalled();
			expect(event.preventDefault).toHaveBeenCalled();
		});
	});

	describe('handleKeyDown - ArrowLeft', () => {
		it('should collapse node when node is expanded and has children', () => {
			const nodes: TreeNode[] = [
				createMockNode('node-1', 'Node 1', [createMockNode('node-1-1', 'Node 1.1')]),
			];
			const expandedNodeIds = new Set<string>(['node-1']);
			const onNodeCollapse = vi.fn();

			const { result } = renderHook(() =>
				useTreeViewKeyboard({
					nodes,
					expandedNodeIds,
					onNodeSelect: vi.fn(),
					onNodeExpand: vi.fn(),
					onNodeCollapse,
					onNodeToggle: vi.fn(),
				})
			);

			const event = createMockKeyboardEvent('ArrowLeft');
			result.current.handleKeyDown(event, 'node-1');

			expect(onNodeCollapse).toHaveBeenCalledTimes(1);
			expect(onNodeCollapse).toHaveBeenCalledWith('node-1');
			expect(event.preventDefault).toHaveBeenCalled();
		});

		it('should move to parent when node is collapsed or has no children', () => {
			const nodes: TreeNode[] = [
				createMockNode('node-1', 'Node 1', [createMockNode('node-1-1', 'Node 1.1')]),
			];
			const expandedNodeIds = new Set<string>();
			const onNodeSelect = vi.fn();

			const { result } = renderHook(() =>
				useTreeViewKeyboard({
					nodes,
					expandedNodeIds,
					onNodeSelect,
					onNodeExpand: vi.fn(),
					onNodeCollapse: vi.fn(),
					onNodeToggle: vi.fn(),
				})
			);

			const event = createMockKeyboardEvent('ArrowLeft');
			result.current.handleKeyDown(event, 'node-1-1');

			expect(onNodeSelect).toHaveBeenCalledTimes(1);
			expect(onNodeSelect).toHaveBeenCalledWith('node-1');
			expect(event.preventDefault).toHaveBeenCalled();
		});

		it('should do nothing when at root node with no parent', () => {
			const nodes: TreeNode[] = [createMockNode('node-1', 'Node 1')];
			const expandedNodeIds = new Set<string>();
			const onNodeSelect = vi.fn();

			const { result } = renderHook(() =>
				useTreeViewKeyboard({
					nodes,
					expandedNodeIds,
					onNodeSelect,
					onNodeExpand: vi.fn(),
					onNodeCollapse: vi.fn(),
					onNodeToggle: vi.fn(),
				})
			);

			const event = createMockKeyboardEvent('ArrowLeft');
			result.current.handleKeyDown(event, 'node-1');

			expect(onNodeSelect).not.toHaveBeenCalled();
			expect(event.preventDefault).toHaveBeenCalled();
		});
	});

	describe('handleKeyDown - ArrowDown', () => {
		it('should move to next visible node', () => {
			const nodes: TreeNode[] = [
				createMockNode('node-1'),
				createMockNode('node-2'),
				createMockNode('node-3'),
			];
			const expandedNodeIds = new Set<string>();
			const onNodeSelect = vi.fn();

			const { result } = renderHook(() =>
				useTreeViewKeyboard({
					nodes,
					expandedNodeIds,
					onNodeSelect,
					onNodeExpand: vi.fn(),
					onNodeCollapse: vi.fn(),
					onNodeToggle: vi.fn(),
				})
			);

			const event = createMockKeyboardEvent('ArrowDown');
			result.current.handleKeyDown(event, 'node-1');

			expect(onNodeSelect).toHaveBeenCalledTimes(1);
			expect(onNodeSelect).toHaveBeenCalledWith('node-2');
			expect(event.preventDefault).toHaveBeenCalled();
		});

		it('should do nothing when at last node', () => {
			const nodes: TreeNode[] = [createMockNode('node-1'), createMockNode('node-2')];
			const expandedNodeIds = new Set<string>();
			const onNodeSelect = vi.fn();

			const { result } = renderHook(() =>
				useTreeViewKeyboard({
					nodes,
					expandedNodeIds,
					onNodeSelect,
					onNodeExpand: vi.fn(),
					onNodeCollapse: vi.fn(),
					onNodeToggle: vi.fn(),
				})
			);

			const event = createMockKeyboardEvent('ArrowDown');
			result.current.handleKeyDown(event, 'node-2');

			expect(onNodeSelect).not.toHaveBeenCalled();
			expect(event.preventDefault).toHaveBeenCalled();
		});
	});

	describe('handleKeyDown - ArrowUp', () => {
		it('should move to previous visible node', () => {
			const nodes: TreeNode[] = [
				createMockNode('node-1'),
				createMockNode('node-2'),
				createMockNode('node-3'),
			];
			const expandedNodeIds = new Set<string>();
			const onNodeSelect = vi.fn();

			const { result } = renderHook(() =>
				useTreeViewKeyboard({
					nodes,
					expandedNodeIds,
					onNodeSelect,
					onNodeExpand: vi.fn(),
					onNodeCollapse: vi.fn(),
					onNodeToggle: vi.fn(),
				})
			);

			const event = createMockKeyboardEvent('ArrowUp');
			result.current.handleKeyDown(event, 'node-2');

			expect(onNodeSelect).toHaveBeenCalledTimes(1);
			expect(onNodeSelect).toHaveBeenCalledWith('node-1');
			expect(event.preventDefault).toHaveBeenCalled();
		});

		it('should do nothing when at first node', () => {
			const nodes: TreeNode[] = [createMockNode('node-1'), createMockNode('node-2')];
			const expandedNodeIds = new Set<string>();
			const onNodeSelect = vi.fn();

			const { result } = renderHook(() =>
				useTreeViewKeyboard({
					nodes,
					expandedNodeIds,
					onNodeSelect,
					onNodeExpand: vi.fn(),
					onNodeCollapse: vi.fn(),
					onNodeToggle: vi.fn(),
				})
			);

			const event = createMockKeyboardEvent('ArrowUp');
			result.current.handleKeyDown(event, 'node-1');

			expect(onNodeSelect).not.toHaveBeenCalled();
			expect(event.preventDefault).toHaveBeenCalled();
		});
	});

	describe('handleKeyDown - Home', () => {
		it('should move to first visible node', () => {
			const nodes: TreeNode[] = [
				createMockNode('node-1'),
				createMockNode('node-2'),
				createMockNode('node-3'),
			];
			const expandedNodeIds = new Set<string>();
			const onNodeSelect = vi.fn();

			const { result } = renderHook(() =>
				useTreeViewKeyboard({
					nodes,
					expandedNodeIds,
					onNodeSelect,
					onNodeExpand: vi.fn(),
					onNodeCollapse: vi.fn(),
					onNodeToggle: vi.fn(),
				})
			);

			const event = createMockKeyboardEvent('Home');
			result.current.handleKeyDown(event, 'node-3');

			expect(onNodeSelect).toHaveBeenCalledTimes(1);
			expect(onNodeSelect).toHaveBeenCalledWith('node-1');
			expect(event.preventDefault).toHaveBeenCalled();
		});

		it('should do nothing when there are no nodes', () => {
			const nodes: TreeNode[] = [];
			const expandedNodeIds = new Set<string>();
			const onNodeSelect = vi.fn();

			const { result } = renderHook(() =>
				useTreeViewKeyboard({
					nodes,
					expandedNodeIds,
					onNodeSelect,
					onNodeExpand: vi.fn(),
					onNodeCollapse: vi.fn(),
					onNodeToggle: vi.fn(),
				})
			);

			const event = createMockKeyboardEvent('Home');
			result.current.handleKeyDown(event, 'non-existent');

			expect(onNodeSelect).not.toHaveBeenCalled();
			expect(event.preventDefault).toHaveBeenCalled();
		});
	});

	describe('handleKeyDown - End', () => {
		it('should move to last visible node', () => {
			const nodes: TreeNode[] = [
				createMockNode('node-1'),
				createMockNode('node-2'),
				createMockNode('node-3'),
			];
			const expandedNodeIds = new Set<string>();
			const onNodeSelect = vi.fn();

			const { result } = renderHook(() =>
				useTreeViewKeyboard({
					nodes,
					expandedNodeIds,
					onNodeSelect,
					onNodeExpand: vi.fn(),
					onNodeCollapse: vi.fn(),
					onNodeToggle: vi.fn(),
				})
			);

			const event = createMockKeyboardEvent('End');
			result.current.handleKeyDown(event, 'node-1');

			expect(onNodeSelect).toHaveBeenCalledTimes(1);
			expect(onNodeSelect).toHaveBeenCalledWith('node-3');
			expect(event.preventDefault).toHaveBeenCalled();
		});

		it('should do nothing when there are no nodes', () => {
			const nodes: TreeNode[] = [];
			const expandedNodeIds = new Set<string>();
			const onNodeSelect = vi.fn();

			const { result } = renderHook(() =>
				useTreeViewKeyboard({
					nodes,
					expandedNodeIds,
					onNodeSelect,
					onNodeExpand: vi.fn(),
					onNodeCollapse: vi.fn(),
					onNodeToggle: vi.fn(),
				})
			);

			const event = createMockKeyboardEvent('End');
			result.current.handleKeyDown(event, 'non-existent');

			expect(onNodeSelect).not.toHaveBeenCalled();
			expect(event.preventDefault).toHaveBeenCalled();
		});
	});

	describe('handleKeyDown - Enter and Space', () => {
		it('should toggle node when Enter is pressed', () => {
			const nodes: TreeNode[] = [createMockNode('node-1')];
			const expandedNodeIds = new Set<string>();
			const onNodeToggle = vi.fn();

			const { result } = renderHook(() =>
				useTreeViewKeyboard({
					nodes,
					expandedNodeIds,
					onNodeSelect: vi.fn(),
					onNodeExpand: vi.fn(),
					onNodeCollapse: vi.fn(),
					onNodeToggle,
				})
			);

			const event = createMockKeyboardEvent('Enter');
			result.current.handleKeyDown(event, 'node-1');

			expect(onNodeToggle).toHaveBeenCalledTimes(1);
			expect(onNodeToggle).toHaveBeenCalledWith('node-1');
			expect(event.preventDefault).toHaveBeenCalled();
		});

		it('should toggle node when Space is pressed', () => {
			const nodes: TreeNode[] = [createMockNode('node-1')];
			const expandedNodeIds = new Set<string>();
			const onNodeToggle = vi.fn();

			const { result } = renderHook(() =>
				useTreeViewKeyboard({
					nodes,
					expandedNodeIds,
					onNodeSelect: vi.fn(),
					onNodeExpand: vi.fn(),
					onNodeCollapse: vi.fn(),
					onNodeToggle,
				})
			);

			const event = createMockKeyboardEvent(' ');
			result.current.handleKeyDown(event, 'node-1');

			expect(onNodeToggle).toHaveBeenCalledTimes(1);
			expect(onNodeToggle).toHaveBeenCalledWith('node-1');
			expect(event.preventDefault).toHaveBeenCalled();
		});
	});

	describe('handleKeyDown - Unhandled Keys', () => {
		it('should not prevent default for unhandled keys', () => {
			const nodes: TreeNode[] = [createMockNode('node-1')];
			const expandedNodeIds = new Set<string>();

			const { result } = renderHook(() =>
				useTreeViewKeyboard({
					nodes,
					expandedNodeIds,
					onNodeSelect: vi.fn(),
					onNodeExpand: vi.fn(),
					onNodeCollapse: vi.fn(),
					onNodeToggle: vi.fn(),
				})
			);

			const event = createMockKeyboardEvent('a');
			result.current.handleKeyDown(event, 'node-1');

			expect(event.preventDefault).not.toHaveBeenCalled();
		});

		it('should not call any handlers for unhandled keys', () => {
			const nodes: TreeNode[] = [createMockNode('node-1')];
			const expandedNodeIds = new Set<string>();
			const onNodeSelect = vi.fn();
			const onNodeExpand = vi.fn();
			const onNodeCollapse = vi.fn();
			const onNodeToggle = vi.fn();

			const { result } = renderHook(() =>
				useTreeViewKeyboard({
					nodes,
					expandedNodeIds,
					onNodeSelect,
					onNodeExpand,
					onNodeCollapse,
					onNodeToggle,
				})
			);

			const event = createMockKeyboardEvent('Tab');
			result.current.handleKeyDown(event, 'node-1');

			expect(onNodeSelect).not.toHaveBeenCalled();
			expect(onNodeExpand).not.toHaveBeenCalled();
			expect(onNodeCollapse).not.toHaveBeenCalled();
			expect(onNodeToggle).not.toHaveBeenCalled();
		});
	});

	describe('Edge Cases', () => {
		it('should handle empty nodes array', () => {
			const nodes: TreeNode[] = [];
			const expandedNodeIds = new Set<string>();

			const { result } = renderHook(() =>
				useTreeViewKeyboard({
					nodes,
					expandedNodeIds,
					onNodeSelect: vi.fn(),
					onNodeExpand: vi.fn(),
					onNodeCollapse: vi.fn(),
					onNodeToggle: vi.fn(),
				})
			);

			expect(result.current.getFirstNodeId()).toBeNull();
			expect(result.current.getLastNodeId()).toBeNull();
			expect(result.current.getNextNodeId('any', 'next')).toBeNull();
		});

		it('should handle deeply nested tree structures', () => {
			const nodes: TreeNode[] = [
				createMockNode('node-1', 'Node 1', [
					createMockNode('node-1-1', 'Node 1.1', [
						createMockNode('node-1-1-1', 'Node 1.1.1', [
							createMockNode('node-1-1-1-1', 'Node 1.1.1.1'),
						]),
					]),
				]),
			];
			const expandedNodeIds = new Set<string>(['node-1', 'node-1-1', 'node-1-1-1']);

			const { result } = renderHook(() =>
				useTreeViewKeyboard({
					nodes,
					expandedNodeIds,
					onNodeSelect: vi.fn(),
					onNodeExpand: vi.fn(),
					onNodeCollapse: vi.fn(),
					onNodeToggle: vi.fn(),
				})
			);

			expect(result.current.getFirstNodeId()).toBe('node-1');
			expect(result.current.getLastNodeId()).toBe('node-1-1-1-1');
			expect(result.current.getNextNodeId('node-1', 'next')).toBe('node-1-1');
			expect(result.current.getNextNodeId('node-1-1-1-1', 'previous')).toBe('node-1-1-1');
		});

		it('should update handlers when props change', () => {
			const nodes1: TreeNode[] = [createMockNode('node-1')];
			const nodes2: TreeNode[] = [createMockNode('node-2')];
			const expandedNodeIds = new Set<string>();
			const onNodeSelect1 = vi.fn();
			const onNodeSelect2 = vi.fn();

			const { result, rerender } = renderHook(
				({ nodes, onNodeSelect }) =>
					useTreeViewKeyboard({
						nodes,
						expandedNodeIds,
						onNodeSelect,
						onNodeExpand: vi.fn(),
						onNodeCollapse: vi.fn(),
						onNodeToggle: vi.fn(),
					}),
				{
					initialProps: { nodes: nodes1, onNodeSelect: onNodeSelect1 },
				}
			);

			const firstFirstNodeId = result.current.getFirstNodeId();
			expect(firstFirstNodeId).toBe('node-1');

			rerender({ nodes: nodes2, onNodeSelect: onNodeSelect2 });

			expect(result.current.getFirstNodeId()).toBe('node-2');
		});
	});
});
