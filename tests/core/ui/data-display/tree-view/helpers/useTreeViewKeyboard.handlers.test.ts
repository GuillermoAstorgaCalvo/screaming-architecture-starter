/**
 * Tests for useTreeViewKeyboard.handlers
 *
 * Tests keyboard event handlers for tree view navigation:
 * - ArrowRight: expand node or move to first child
 * - ArrowLeft: collapse node or move to previous node
 * - ArrowDown: move to next visible node
 * - ArrowUp: move to previous visible node
 * - Home: move to first node
 * - End: move to last node
 * - Enter/Space: toggle node
 * - createKeyboardHandler: keyboard event handler factory
 */

import {
	createKeyboardHandler,
	handleArrowDown,
	handleArrowLeft,
	handleArrowRight,
	handleArrowUp,
	handleEnd,
	handleHome,
	handleToggle,
} from '@core/ui/data-display/tree-view/helpers/useTreeViewKeyboard.handlers';
import type { KeyHandlerContext } from '@core/ui/data-display/tree-view/types/useTreeViewKeyboard.types';
import type { TreeNode } from '@src-types/ui/navigation/treeView';
import type { KeyboardEvent } from 'react';
import { describe, expect, it, vi } from 'vitest';

// Test data
const createMockNode = (
	id: string,
	label: string = `Node ${id}`,
	children?: readonly TreeNode[]
): TreeNode => {
	const node: TreeNode = { id, label };
	if (children !== undefined) {
		node.children = children;
	}
	return node;
};

const createMockContext = (overrides?: Partial<KeyHandlerContext>): KeyHandlerContext => ({
	nodes: [],
	expandedNodeIds: new Set<string>(),
	getNextNodeId: vi.fn(),
	getFirstNodeId: vi.fn(),
	getLastNodeId: vi.fn(),
	onNodeSelect: vi.fn(),
	onNodeExpand: vi.fn(),
	onNodeCollapse: vi.fn(),
	onNodeToggle: vi.fn(),
	...overrides,
});

const createMockKeyboardEvent = (key: string): KeyboardEvent<HTMLDivElement> => {
	return {
		key,
		preventDefault: vi.fn(),
	} as unknown as KeyboardEvent<HTMLDivElement>;
};

describe('useTreeViewKeyboard.handlers', () => {
	describe('handleArrowRight', () => {
		it('should expand node when node has children and is collapsed', () => {
			const nodes: TreeNode[] = [createMockNode('node-1', 'Node 1', [createMockNode('child-1')])];
			const expandedNodeIds = new Set<string>();
			const onNodeExpand = vi.fn();
			const context = createMockContext({
				nodes,
				expandedNodeIds,
				onNodeExpand,
			});

			handleArrowRight('node-1', context);

			expect(onNodeExpand).toHaveBeenCalledTimes(1);
			expect(onNodeExpand).toHaveBeenCalledWith('node-1');
		});

		it('should move to first child when node has children and is expanded', () => {
			const nodes: TreeNode[] = [createMockNode('node-1', 'Node 1', [createMockNode('child-1')])];
			const expandedNodeIds = new Set(['node-1']);
			const onNodeSelect = vi.fn();
			const getNextNodeId = vi.fn().mockReturnValue('child-1');
			const context = createMockContext({
				nodes,
				expandedNodeIds,
				onNodeSelect,
				getNextNodeId,
			});

			handleArrowRight('node-1', context);

			expect(getNextNodeId).toHaveBeenCalledTimes(1);
			expect(getNextNodeId).toHaveBeenCalledWith('node-1', 'next');
			expect(onNodeSelect).toHaveBeenCalledTimes(1);
			expect(onNodeSelect).toHaveBeenCalledWith('child-1');
		});

		it('should do nothing when node has no children', () => {
			const nodes: TreeNode[] = [createMockNode('node-1', 'Node 1')];
			const onNodeExpand = vi.fn();
			const onNodeSelect = vi.fn();
			const context = createMockContext({
				nodes,
				onNodeExpand,
				onNodeSelect,
			});

			handleArrowRight('node-1', context);

			expect(onNodeExpand).not.toHaveBeenCalled();
			expect(onNodeSelect).not.toHaveBeenCalled();
		});

		it('should do nothing when expanded node has no next node', () => {
			const nodes: TreeNode[] = [createMockNode('node-1', 'Node 1', [createMockNode('child-1')])];
			const expandedNodeIds = new Set(['node-1']);
			const onNodeSelect = vi.fn();
			const getNextNodeId = vi.fn().mockReturnValue(null);
			const context = createMockContext({
				nodes,
				expandedNodeIds,
				onNodeSelect,
				getNextNodeId,
			});

			handleArrowRight('node-1', context);

			expect(getNextNodeId).toHaveBeenCalledTimes(1);
			expect(onNodeSelect).not.toHaveBeenCalled();
		});
	});

	describe('handleArrowLeft', () => {
		it('should collapse node when node has children and is expanded', () => {
			const nodes: TreeNode[] = [createMockNode('node-1', 'Node 1', [createMockNode('child-1')])];
			const expandedNodeIds = new Set(['node-1']);
			const onNodeCollapse = vi.fn();
			const context = createMockContext({
				nodes,
				expandedNodeIds,
				onNodeCollapse,
			});

			handleArrowLeft('node-1', context);

			expect(onNodeCollapse).toHaveBeenCalledTimes(1);
			expect(onNodeCollapse).toHaveBeenCalledWith('node-1');
		});

		it('should move to previous node when node has no children', () => {
			const nodes: TreeNode[] = [createMockNode('node-1'), createMockNode('node-2')];
			const onNodeSelect = vi.fn();
			const getNextNodeId = vi.fn().mockReturnValue('node-1');
			const context = createMockContext({
				nodes,
				onNodeSelect,
				getNextNodeId,
			});

			handleArrowLeft('node-2', context);

			expect(getNextNodeId).toHaveBeenCalledTimes(1);
			expect(getNextNodeId).toHaveBeenCalledWith('node-2', 'previous');
			expect(onNodeSelect).toHaveBeenCalledTimes(1);
			expect(onNodeSelect).toHaveBeenCalledWith('node-1');
		});

		it('should move to previous node when node has children but is collapsed', () => {
			const nodes: TreeNode[] = [createMockNode('node-1', 'Node 1', [createMockNode('child-1')])];
			const expandedNodeIds = new Set<string>();
			const onNodeSelect = vi.fn();
			const getNextNodeId = vi.fn().mockReturnValue('root');
			const context = createMockContext({
				nodes,
				expandedNodeIds,
				onNodeSelect,
				getNextNodeId,
			});

			handleArrowLeft('node-1', context);

			expect(getNextNodeId).toHaveBeenCalledTimes(1);
			expect(getNextNodeId).toHaveBeenCalledWith('node-1', 'previous');
			expect(onNodeSelect).toHaveBeenCalledTimes(1);
			expect(onNodeSelect).toHaveBeenCalledWith('root');
		});

		it('should do nothing when there is no previous node', () => {
			const nodes: TreeNode[] = [createMockNode('node-1')];
			const onNodeSelect = vi.fn();
			const getNextNodeId = vi.fn().mockReturnValue(null);
			const context = createMockContext({
				nodes,
				onNodeSelect,
				getNextNodeId,
			});

			handleArrowLeft('node-1', context);

			expect(getNextNodeId).toHaveBeenCalledTimes(1);
			expect(onNodeSelect).not.toHaveBeenCalled();
		});
	});

	describe('handleArrowDown', () => {
		it('should move to next visible node', () => {
			const onNodeSelect = vi.fn();
			const getNextNodeId = vi.fn().mockReturnValue('node-2');
			const context = createMockContext({
				onNodeSelect,
				getNextNodeId,
			});

			handleArrowDown('node-1', context);

			expect(getNextNodeId).toHaveBeenCalledTimes(1);
			expect(getNextNodeId).toHaveBeenCalledWith('node-1', 'next');
			expect(onNodeSelect).toHaveBeenCalledTimes(1);
			expect(onNodeSelect).toHaveBeenCalledWith('node-2');
		});

		it('should do nothing when there is no next node', () => {
			const onNodeSelect = vi.fn();
			const getNextNodeId = vi.fn().mockReturnValue(null);
			const context = createMockContext({
				onNodeSelect,
				getNextNodeId,
			});

			handleArrowDown('node-1', context);

			expect(getNextNodeId).toHaveBeenCalledTimes(1);
			expect(onNodeSelect).not.toHaveBeenCalled();
		});

		it('should handle multiple consecutive calls', () => {
			const onNodeSelect = vi.fn();
			const getNextNodeId = vi
				.fn()
				.mockReturnValueOnce('node-2')
				.mockReturnValueOnce('node-3')
				.mockReturnValueOnce('node-4');
			const context = createMockContext({
				onNodeSelect,
				getNextNodeId,
			});

			handleArrowDown('node-1', context);
			handleArrowDown('node-2', context);
			handleArrowDown('node-3', context);

			expect(getNextNodeId).toHaveBeenCalledTimes(3);
			expect(onNodeSelect).toHaveBeenCalledTimes(3);
			expect(onNodeSelect).toHaveBeenNthCalledWith(1, 'node-2');
			expect(onNodeSelect).toHaveBeenNthCalledWith(2, 'node-3');
			expect(onNodeSelect).toHaveBeenNthCalledWith(3, 'node-4');
		});
	});

	describe('handleArrowUp', () => {
		it('should move to previous visible node', () => {
			const onNodeSelect = vi.fn();
			const getNextNodeId = vi.fn().mockReturnValue('node-1');
			const context = createMockContext({
				onNodeSelect,
				getNextNodeId,
			});

			handleArrowUp('node-2', context);

			expect(getNextNodeId).toHaveBeenCalledTimes(1);
			expect(getNextNodeId).toHaveBeenCalledWith('node-2', 'previous');
			expect(onNodeSelect).toHaveBeenCalledTimes(1);
			expect(onNodeSelect).toHaveBeenCalledWith('node-1');
		});

		it('should do nothing when there is no previous node', () => {
			const onNodeSelect = vi.fn();
			const getNextNodeId = vi.fn().mockReturnValue(null);
			const context = createMockContext({
				onNodeSelect,
				getNextNodeId,
			});

			handleArrowUp('node-1', context);

			expect(getNextNodeId).toHaveBeenCalledTimes(1);
			expect(onNodeSelect).not.toHaveBeenCalled();
		});

		it('should handle multiple consecutive calls', () => {
			const onNodeSelect = vi.fn();
			const getNextNodeId = vi
				.fn()
				.mockReturnValueOnce('node-2')
				.mockReturnValueOnce('node-1')
				.mockReturnValueOnce(null);
			const context = createMockContext({
				onNodeSelect,
				getNextNodeId,
			});

			handleArrowUp('node-3', context);
			handleArrowUp('node-2', context);
			handleArrowUp('node-1', context);

			expect(getNextNodeId).toHaveBeenCalledTimes(3);
			expect(onNodeSelect).toHaveBeenCalledTimes(2);
			expect(onNodeSelect).toHaveBeenNthCalledWith(1, 'node-2');
			expect(onNodeSelect).toHaveBeenNthCalledWith(2, 'node-1');
		});
	});

	describe('handleHome', () => {
		it('should move to first node', () => {
			const onNodeSelect = vi.fn();
			const getFirstNodeId = vi.fn().mockReturnValue('node-1');
			const context = createMockContext({
				onNodeSelect,
				getFirstNodeId,
			});

			handleHome(context);

			expect(getFirstNodeId).toHaveBeenCalledTimes(1);
			expect(onNodeSelect).toHaveBeenCalledTimes(1);
			expect(onNodeSelect).toHaveBeenCalledWith('node-1');
		});

		it('should do nothing when there is no first node', () => {
			const onNodeSelect = vi.fn();
			const getFirstNodeId = vi.fn().mockReturnValue(null);
			const context = createMockContext({
				onNodeSelect,
				getFirstNodeId,
			});

			handleHome(context);

			expect(getFirstNodeId).toHaveBeenCalledTimes(1);
			expect(onNodeSelect).not.toHaveBeenCalled();
		});

		it('should always move to first node regardless of current node', () => {
			const onNodeSelect = vi.fn();
			const getFirstNodeId = vi.fn().mockReturnValue('node-1');
			const context = createMockContext({
				onNodeSelect,
				getFirstNodeId,
			});

			handleHome(context);
			handleHome(context);
			handleHome(context);

			expect(getFirstNodeId).toHaveBeenCalledTimes(3);
			expect(onNodeSelect).toHaveBeenCalledTimes(3);
			expect(onNodeSelect).toHaveBeenNthCalledWith(1, 'node-1');
			expect(onNodeSelect).toHaveBeenNthCalledWith(2, 'node-1');
			expect(onNodeSelect).toHaveBeenNthCalledWith(3, 'node-1');
		});
	});

	describe('handleEnd', () => {
		it('should move to last node', () => {
			const onNodeSelect = vi.fn();
			const getLastNodeId = vi.fn().mockReturnValue('node-10');
			const context = createMockContext({
				onNodeSelect,
				getLastNodeId,
			});

			handleEnd(context);

			expect(getLastNodeId).toHaveBeenCalledTimes(1);
			expect(onNodeSelect).toHaveBeenCalledTimes(1);
			expect(onNodeSelect).toHaveBeenCalledWith('node-10');
		});

		it('should do nothing when there is no last node', () => {
			const onNodeSelect = vi.fn();
			const getLastNodeId = vi.fn().mockReturnValue(null);
			const context = createMockContext({
				onNodeSelect,
				getLastNodeId,
			});

			handleEnd(context);

			expect(getLastNodeId).toHaveBeenCalledTimes(1);
			expect(onNodeSelect).not.toHaveBeenCalled();
		});

		it('should always move to last node regardless of current node', () => {
			const onNodeSelect = vi.fn();
			const getLastNodeId = vi.fn().mockReturnValue('node-10');
			const context = createMockContext({
				onNodeSelect,
				getLastNodeId,
			});

			handleEnd(context);
			handleEnd(context);
			handleEnd(context);

			expect(getLastNodeId).toHaveBeenCalledTimes(3);
			expect(onNodeSelect).toHaveBeenCalledTimes(3);
			expect(onNodeSelect).toHaveBeenNthCalledWith(1, 'node-10');
			expect(onNodeSelect).toHaveBeenNthCalledWith(2, 'node-10');
			expect(onNodeSelect).toHaveBeenNthCalledWith(3, 'node-10');
		});
	});

	describe('handleToggle', () => {
		it('should toggle node', () => {
			const onNodeToggle = vi.fn();
			const context = createMockContext({
				onNodeToggle,
			});

			handleToggle('node-1', context);

			expect(onNodeToggle).toHaveBeenCalledTimes(1);
			expect(onNodeToggle).toHaveBeenCalledWith('node-1');
		});

		it('should handle multiple toggle calls', () => {
			const onNodeToggle = vi.fn();
			const context = createMockContext({
				onNodeToggle,
			});

			handleToggle('node-1', context);
			handleToggle('node-2', context);
			handleToggle('node-3', context);

			expect(onNodeToggle).toHaveBeenCalledTimes(3);
			expect(onNodeToggle).toHaveBeenNthCalledWith(1, 'node-1');
			expect(onNodeToggle).toHaveBeenNthCalledWith(2, 'node-2');
			expect(onNodeToggle).toHaveBeenNthCalledWith(3, 'node-3');
		});
	});

	describe('createKeyboardHandler', () => {
		it('should create a keyboard handler that handles ArrowRight', () => {
			const onNodeExpand = vi.fn();
			const nodes: TreeNode[] = [createMockNode('node-1', 'Node 1', [createMockNode('child-1')])];
			const expandedNodeIds = new Set<string>();
			const context = createMockContext({
				nodes,
				expandedNodeIds,
				onNodeExpand,
			});

			const handler = createKeyboardHandler(context);
			const event = createMockKeyboardEvent('ArrowRight');

			handler(event, 'node-1');

			expect(event.preventDefault).toHaveBeenCalledTimes(1);
			expect(onNodeExpand).toHaveBeenCalledTimes(1);
			expect(onNodeExpand).toHaveBeenCalledWith('node-1');
		});

		it('should create a keyboard handler that handles ArrowLeft', () => {
			const onNodeCollapse = vi.fn();
			const nodes: TreeNode[] = [createMockNode('node-1', 'Node 1', [createMockNode('child-1')])];
			const expandedNodeIds = new Set(['node-1']);
			const context = createMockContext({
				nodes,
				expandedNodeIds,
				onNodeCollapse,
			});

			const handler = createKeyboardHandler(context);
			const event = createMockKeyboardEvent('ArrowLeft');

			handler(event, 'node-1');

			expect(event.preventDefault).toHaveBeenCalledTimes(1);
			expect(onNodeCollapse).toHaveBeenCalledTimes(1);
			expect(onNodeCollapse).toHaveBeenCalledWith('node-1');
		});

		it('should create a keyboard handler that handles ArrowDown', () => {
			const onNodeSelect = vi.fn();
			const getNextNodeId = vi.fn().mockReturnValue('node-2');
			const context = createMockContext({
				onNodeSelect,
				getNextNodeId,
			});

			const handler = createKeyboardHandler(context);
			const event = createMockKeyboardEvent('ArrowDown');

			handler(event, 'node-1');

			expect(event.preventDefault).toHaveBeenCalledTimes(1);
			expect(onNodeSelect).toHaveBeenCalledTimes(1);
			expect(onNodeSelect).toHaveBeenCalledWith('node-2');
		});

		it('should create a keyboard handler that handles ArrowUp', () => {
			const onNodeSelect = vi.fn();
			const getNextNodeId = vi.fn().mockReturnValue('node-1');
			const context = createMockContext({
				onNodeSelect,
				getNextNodeId,
			});

			const handler = createKeyboardHandler(context);
			const event = createMockKeyboardEvent('ArrowUp');

			handler(event, 'node-2');

			expect(event.preventDefault).toHaveBeenCalledTimes(1);
			expect(onNodeSelect).toHaveBeenCalledTimes(1);
			expect(onNodeSelect).toHaveBeenCalledWith('node-1');
		});

		it('should create a keyboard handler that handles Home', () => {
			const onNodeSelect = vi.fn();
			const getFirstNodeId = vi.fn().mockReturnValue('node-1');
			const context = createMockContext({
				onNodeSelect,
				getFirstNodeId,
			});

			const handler = createKeyboardHandler(context);
			const event = createMockKeyboardEvent('Home');

			handler(event, 'node-5');

			expect(event.preventDefault).toHaveBeenCalledTimes(1);
			expect(onNodeSelect).toHaveBeenCalledTimes(1);
			expect(onNodeSelect).toHaveBeenCalledWith('node-1');
		});

		it('should create a keyboard handler that handles End', () => {
			const onNodeSelect = vi.fn();
			const getLastNodeId = vi.fn().mockReturnValue('node-10');
			const context = createMockContext({
				onNodeSelect,
				getLastNodeId,
			});

			const handler = createKeyboardHandler(context);
			const event = createMockKeyboardEvent('End');

			handler(event, 'node-5');

			expect(event.preventDefault).toHaveBeenCalledTimes(1);
			expect(onNodeSelect).toHaveBeenCalledTimes(1);
			expect(onNodeSelect).toHaveBeenCalledWith('node-10');
		});

		it('should create a keyboard handler that handles Enter', () => {
			const onNodeToggle = vi.fn();
			const context = createMockContext({
				onNodeToggle,
			});

			const handler = createKeyboardHandler(context);
			const event = createMockKeyboardEvent('Enter');

			handler(event, 'node-1');

			expect(event.preventDefault).toHaveBeenCalledTimes(1);
			expect(onNodeToggle).toHaveBeenCalledTimes(1);
			expect(onNodeToggle).toHaveBeenCalledWith('node-1');
		});

		it('should create a keyboard handler that handles Space', () => {
			const onNodeToggle = vi.fn();
			const context = createMockContext({
				onNodeToggle,
			});

			const handler = createKeyboardHandler(context);
			const event = createMockKeyboardEvent(' ');

			handler(event, 'node-1');

			expect(event.preventDefault).toHaveBeenCalledTimes(1);
			expect(onNodeToggle).toHaveBeenCalledTimes(1);
			expect(onNodeToggle).toHaveBeenCalledWith('node-1');
		});

		it('should ignore unknown keys', () => {
			const onNodeSelect = vi.fn();
			const onNodeExpand = vi.fn();
			const onNodeCollapse = vi.fn();
			const onNodeToggle = vi.fn();
			const context = createMockContext({
				onNodeSelect,
				onNodeExpand,
				onNodeCollapse,
				onNodeToggle,
			});

			const handler = createKeyboardHandler(context);
			const event = createMockKeyboardEvent('a');

			handler(event, 'node-1');

			expect(event.preventDefault).not.toHaveBeenCalled();
			expect(onNodeSelect).not.toHaveBeenCalled();
			expect(onNodeExpand).not.toHaveBeenCalled();
			expect(onNodeCollapse).not.toHaveBeenCalled();
			expect(onNodeToggle).not.toHaveBeenCalled();
		});

		it('should handle all supported keys in sequence', () => {
			const onNodeSelect = vi.fn();
			const onNodeExpand = vi.fn();
			const onNodeCollapse = vi.fn();
			const onNodeToggle = vi.fn();
			const getNextNodeId = vi
				.fn()
				.mockReturnValueOnce('node-2')
				.mockReturnValueOnce('node-1')
				.mockReturnValueOnce('node-3');
			const getFirstNodeId = vi.fn().mockReturnValue('node-1');
			const getLastNodeId = vi.fn().mockReturnValue('node-10');
			const nodes: TreeNode[] = [createMockNode('node-1', 'Node 1', [createMockNode('child-1')])];
			const expandedNodeIds = new Set<string>();

			const context = createMockContext({
				nodes,
				expandedNodeIds,
				onNodeSelect,
				onNodeExpand,
				onNodeCollapse,
				onNodeToggle,
				getNextNodeId,
				getFirstNodeId,
				getLastNodeId,
			});

			const handler = createKeyboardHandler(context);

			// ArrowRight - expand
			handler(createMockKeyboardEvent('ArrowRight'), 'node-1');
			// ArrowDown - next
			handler(createMockKeyboardEvent('ArrowDown'), 'node-1');
			// ArrowUp - previous
			handler(createMockKeyboardEvent('ArrowUp'), 'node-2');
			// Home - first
			handler(createMockKeyboardEvent('Home'), 'node-3');
			// End - last
			handler(createMockKeyboardEvent('End'), 'node-1');
			// Enter - toggle
			handler(createMockKeyboardEvent('Enter'), 'node-1');
			// Space - toggle
			handler(createMockKeyboardEvent(' '), 'node-1');

			expect(onNodeExpand).toHaveBeenCalledTimes(1);
			expect(onNodeSelect).toHaveBeenCalledTimes(4);
			expect(onNodeToggle).toHaveBeenCalledTimes(2);
		});
	});

	describe('Edge Cases', () => {
		it('should handle empty node IDs', () => {
			const onNodeToggle = vi.fn();
			const context = createMockContext({
				onNodeToggle,
			});

			handleToggle('', context);

			expect(onNodeToggle).toHaveBeenCalledWith('');
		});

		it('should handle complex node structures', () => {
			const nodes: TreeNode[] = [
				createMockNode('root', 'Root', [
					createMockNode('child-1', 'Child 1', [createMockNode('grandchild-1')]),
					createMockNode('child-2', 'Child 2'),
				]),
			];
			const expandedNodeIds = new Set(['root']);
			const onNodeSelect = vi.fn();
			const getNextNodeId = vi.fn().mockReturnValue('child-1');
			const context = createMockContext({
				nodes,
				expandedNodeIds,
				onNodeSelect,
				getNextNodeId,
			});

			handleArrowRight('root', context);

			expect(getNextNodeId).toHaveBeenCalledWith('root', 'next');
			expect(onNodeSelect).toHaveBeenCalledWith('child-1');
		});

		it('should handle rapid successive keyboard events', () => {
			const onNodeSelect = vi.fn();
			const getNextNodeId = vi.fn().mockReturnValue('node-2');
			const context = createMockContext({
				onNodeSelect,
				getNextNodeId,
			});

			const handler = createKeyboardHandler(context);

			for (let i = 0; i < 10; i++) {
				handler(createMockKeyboardEvent('ArrowDown'), 'node-1');
			}

			expect(getNextNodeId).toHaveBeenCalledTimes(10);
			expect(onNodeSelect).toHaveBeenCalledTimes(10);
		});

		it('should handle keyboard events with different node IDs', () => {
			const onNodeToggle = vi.fn();
			const context = createMockContext({
				onNodeToggle,
			});

			const handler = createKeyboardHandler(context);

			handler(createMockKeyboardEvent('Enter'), 'node-1');
			handler(createMockKeyboardEvent('Enter'), 'node-2');
			handler(createMockKeyboardEvent('Enter'), 'node-3');

			expect(onNodeToggle).toHaveBeenCalledTimes(3);
			expect(onNodeToggle).toHaveBeenNthCalledWith(1, 'node-1');
			expect(onNodeToggle).toHaveBeenNthCalledWith(2, 'node-2');
			expect(onNodeToggle).toHaveBeenNthCalledWith(3, 'node-3');
		});
	});
});
