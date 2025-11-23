/**
 * TreeViewNodeHandlers Tests
 *
 * Tests for TreeViewNodeHandlers utility functions:
 * - createClickHandler: Handles click events with expansion/collapse and selection
 * - createDoubleClickHandler: Handles double click events
 * - createKeyDownHandler: Handles keyboard events
 * - createNodeHandlers: Creates all event handlers for a tree node
 */

import {
	createClickHandler,
	createNodeHandlers,
} from '@core/ui/data-display/tree-view/helpers/TreeViewNodeHandlers';
import type { TreeNode } from '@src-types/ui/navigation/treeView';
import type { KeyboardEvent, MouseEvent } from 'react';
import { describe, expect, it, vi } from 'vitest';

// ============================================================================
// Test Helpers
// ============================================================================

function createMockNode(overrides?: Partial<TreeNode>): TreeNode {
	return {
		id: 'node-1',
		label: 'Test Node',
		...overrides,
	};
}

function createMockMouseEvent(
	overrides?: Partial<MouseEvent<HTMLDivElement>>
): MouseEvent<HTMLDivElement> {
	return {
		stopPropagation: vi.fn(),
		preventDefault: vi.fn(),
		...overrides,
	} as unknown as MouseEvent<HTMLDivElement>;
}

function createMockKeyboardEvent(
	overrides?: Partial<KeyboardEvent<HTMLDivElement>>
): KeyboardEvent<HTMLDivElement> {
	return {
		stopPropagation: vi.fn(),
		preventDefault: vi.fn(),
		key: 'Enter',
		...overrides,
	} as unknown as KeyboardEvent<HTMLDivElement>;
}

// ============================================================================
// createClickHandler Tests
// ============================================================================

describe('createClickHandler', () => {
	it('should be a function', () => {
		expect(typeof createClickHandler).toBe('function');
	});

	it('should stop event propagation', () => {
		const node = createMockNode();
		const event = createMockMouseEvent();
		const onNodeClick = vi.fn();
		const onNodeToggle = vi.fn();
		const onNodeExpand = vi.fn();
		const onNodeCollapse = vi.fn();

		const handler = createClickHandler({
			node,
			hasChildren: false,
			nodeIsExpanded: false,
			selectionMode: 'none',
			onNodeClick,
			onNodeToggle,
			onNodeExpand,
			onNodeCollapse,
		});

		handler(event);

		expect(event.stopPropagation).toHaveBeenCalledTimes(1);
	});

	it('should not call any handlers when node is disabled', () => {
		const node = createMockNode({ disabled: true });
		const event = createMockMouseEvent();
		const onNodeClick = vi.fn();
		const onNodeToggle = vi.fn();
		const onNodeExpand = vi.fn();
		const onNodeCollapse = vi.fn();

		const handler = createClickHandler({
			node,
			hasChildren: true,
			nodeIsExpanded: false,
			selectionMode: 'single',
			onNodeClick,
			onNodeToggle,
			onNodeExpand,
			onNodeCollapse,
		});

		handler(event);

		expect(onNodeClick).not.toHaveBeenCalled();
		expect(onNodeToggle).not.toHaveBeenCalled();
		expect(onNodeExpand).not.toHaveBeenCalled();
		expect(onNodeCollapse).not.toHaveBeenCalled();
	});

	it('should call onNodeExpand when node has children and is collapsed', () => {
		const node = createMockNode();
		const event = createMockMouseEvent();
		const onNodeClick = vi.fn();
		const onNodeToggle = vi.fn();
		const onNodeExpand = vi.fn();
		const onNodeCollapse = vi.fn();

		const handler = createClickHandler({
			node,
			hasChildren: true,
			nodeIsExpanded: false,
			selectionMode: 'none',
			onNodeClick,
			onNodeToggle,
			onNodeExpand,
			onNodeCollapse,
		});

		handler(event);

		expect(onNodeExpand).toHaveBeenCalledTimes(1);
		expect(onNodeExpand).toHaveBeenCalledWith(node.id);
		expect(onNodeCollapse).not.toHaveBeenCalled();
	});

	it('should call onNodeCollapse when node has children and is expanded', () => {
		const node = createMockNode();
		const event = createMockMouseEvent();
		const onNodeClick = vi.fn();
		const onNodeToggle = vi.fn();
		const onNodeExpand = vi.fn();
		const onNodeCollapse = vi.fn();

		const handler = createClickHandler({
			node,
			hasChildren: true,
			nodeIsExpanded: true,
			selectionMode: 'none',
			onNodeClick,
			onNodeToggle,
			onNodeExpand,
			onNodeCollapse,
		});

		handler(event);

		expect(onNodeCollapse).toHaveBeenCalledTimes(1);
		expect(onNodeCollapse).toHaveBeenCalledWith(node.id);
		expect(onNodeExpand).not.toHaveBeenCalled();
	});

	it('should not call expand/collapse when node has no children', () => {
		const node = createMockNode();
		const event = createMockMouseEvent();
		const onNodeClick = vi.fn();
		const onNodeToggle = vi.fn();
		const onNodeExpand = vi.fn();
		const onNodeCollapse = vi.fn();

		const handler = createClickHandler({
			node,
			hasChildren: false,
			nodeIsExpanded: false,
			selectionMode: 'none',
			onNodeClick,
			onNodeToggle,
			onNodeExpand,
			onNodeCollapse,
		});

		handler(event);

		expect(onNodeExpand).not.toHaveBeenCalled();
		expect(onNodeCollapse).not.toHaveBeenCalled();
	});

	it('should call onNodeToggle when selectionMode is "single"', () => {
		const node = createMockNode();
		const event = createMockMouseEvent();
		const onNodeClick = vi.fn();
		const onNodeToggle = vi.fn();
		const onNodeExpand = vi.fn();
		const onNodeCollapse = vi.fn();

		const handler = createClickHandler({
			node,
			hasChildren: false,
			nodeIsExpanded: false,
			selectionMode: 'single',
			onNodeClick,
			onNodeToggle,
			onNodeExpand,
			onNodeCollapse,
		});

		handler(event);

		expect(onNodeToggle).toHaveBeenCalledTimes(1);
		expect(onNodeToggle).toHaveBeenCalledWith(node.id);
	});

	it('should call onNodeToggle when selectionMode is "multiple"', () => {
		const node = createMockNode();
		const event = createMockMouseEvent();
		const onNodeClick = vi.fn();
		const onNodeToggle = vi.fn();
		const onNodeExpand = vi.fn();
		const onNodeCollapse = vi.fn();

		const handler = createClickHandler({
			node,
			hasChildren: false,
			nodeIsExpanded: false,
			selectionMode: 'multiple',
			onNodeClick,
			onNodeToggle,
			onNodeExpand,
			onNodeCollapse,
		});

		handler(event);

		expect(onNodeToggle).toHaveBeenCalledTimes(1);
		expect(onNodeToggle).toHaveBeenCalledWith(node.id);
	});

	it('should not call onNodeToggle when selectionMode is "none"', () => {
		const node = createMockNode();
		const event = createMockMouseEvent();
		const onNodeClick = vi.fn();
		const onNodeToggle = vi.fn();
		const onNodeExpand = vi.fn();
		const onNodeCollapse = vi.fn();

		const handler = createClickHandler({
			node,
			hasChildren: false,
			nodeIsExpanded: false,
			selectionMode: 'none',
			onNodeClick,
			onNodeToggle,
			onNodeExpand,
			onNodeCollapse,
		});

		handler(event);

		expect(onNodeToggle).not.toHaveBeenCalled();
	});

	it('should always call onNodeClick regardless of other conditions', () => {
		const node = createMockNode();
		const event = createMockMouseEvent();
		const onNodeClick = vi.fn();
		const onNodeToggle = vi.fn();
		const onNodeExpand = vi.fn();
		const onNodeCollapse = vi.fn();

		const handler = createClickHandler({
			node,
			hasChildren: false,
			nodeIsExpanded: false,
			selectionMode: 'none',
			onNodeClick,
			onNodeToggle,
			onNodeExpand,
			onNodeCollapse,
		});

		handler(event);

		expect(onNodeClick).toHaveBeenCalledTimes(1);
		expect(onNodeClick).toHaveBeenCalledWith(node.id, node);
	});

	it('should handle all actions together: expand, toggle, and click', () => {
		const node = createMockNode();
		const event = createMockMouseEvent();
		const onNodeClick = vi.fn();
		const onNodeToggle = vi.fn();
		const onNodeExpand = vi.fn();
		const onNodeCollapse = vi.fn();

		const handler = createClickHandler({
			node,
			hasChildren: true,
			nodeIsExpanded: false,
			selectionMode: 'single',
			onNodeClick,
			onNodeToggle,
			onNodeExpand,
			onNodeCollapse,
		});

		handler(event);

		expect(onNodeExpand).toHaveBeenCalledTimes(1);
		expect(onNodeToggle).toHaveBeenCalledTimes(1);
		expect(onNodeClick).toHaveBeenCalledTimes(1);
		expect(onNodeCollapse).not.toHaveBeenCalled();
	});

	it('should handle all actions together: collapse, toggle, and click', () => {
		const node = createMockNode();
		const event = createMockMouseEvent();
		const onNodeClick = vi.fn();
		const onNodeToggle = vi.fn();
		const onNodeExpand = vi.fn();
		const onNodeCollapse = vi.fn();

		const handler = createClickHandler({
			node,
			hasChildren: true,
			nodeIsExpanded: true,
			selectionMode: 'multiple',
			onNodeClick,
			onNodeToggle,
			onNodeExpand,
			onNodeCollapse,
		});

		handler(event);

		expect(onNodeCollapse).toHaveBeenCalledTimes(1);
		expect(onNodeToggle).toHaveBeenCalledTimes(1);
		expect(onNodeClick).toHaveBeenCalledTimes(1);
		expect(onNodeExpand).not.toHaveBeenCalled();
	});
});

// ============================================================================
// createNodeHandlers Tests
// ============================================================================

describe('createNodeHandlers', () => {
	it('should be a function', () => {
		expect(typeof createNodeHandlers).toBe('function');
	});

	it('should return an object with handleClick, handleDoubleClick, and handleKeyDown', () => {
		const node = createMockNode();
		const handlers = createNodeHandlers({
			node,
			hasChildren: false,
			nodeIsExpanded: false,
			selectionMode: 'none',
			onNodeClick: vi.fn(),
			onNodeDoubleClick: vi.fn(),
			onNodeToggle: vi.fn(),
			onNodeExpand: vi.fn(),
			onNodeCollapse: vi.fn(),
			onKeyDown: vi.fn(),
		});

		expect(handlers).toHaveProperty('handleClick');
		expect(handlers).toHaveProperty('handleDoubleClick');
		expect(handlers).toHaveProperty('handleKeyDown');
		expect(typeof handlers.handleClick).toBe('function');
		expect(typeof handlers.handleDoubleClick).toBe('function');
		expect(typeof handlers.handleKeyDown).toBe('function');
	});

	it('should create a click handler that works correctly', () => {
		const node = createMockNode();
		const onNodeClick = vi.fn();
		const onNodeToggle = vi.fn();
		const onNodeExpand = vi.fn();
		const onNodeCollapse = vi.fn();

		const { handleClick } = createNodeHandlers({
			node,
			hasChildren: true,
			nodeIsExpanded: false,
			selectionMode: 'single',
			onNodeClick,
			onNodeDoubleClick: vi.fn(),
			onNodeToggle,
			onNodeExpand,
			onNodeCollapse,
			onKeyDown: vi.fn(),
		});

		const event = createMockMouseEvent();
		handleClick(event);

		expect(onNodeExpand).toHaveBeenCalledWith(node.id);
		expect(onNodeToggle).toHaveBeenCalledWith(node.id);
		expect(onNodeClick).toHaveBeenCalledWith(node.id, node);
	});

	it('should create a double click handler that works correctly', () => {
		const node = createMockNode();
		const onNodeDoubleClick = vi.fn();

		const { handleDoubleClick } = createNodeHandlers({
			node,
			hasChildren: false,
			nodeIsExpanded: false,
			selectionMode: 'none',
			onNodeClick: vi.fn(),
			onNodeDoubleClick,
			onNodeToggle: vi.fn(),
			onNodeExpand: vi.fn(),
			onNodeCollapse: vi.fn(),
			onKeyDown: vi.fn(),
		});

		const event = createMockMouseEvent();
		handleDoubleClick(event);

		expect(event.stopPropagation).toHaveBeenCalledTimes(1);
		expect(onNodeDoubleClick).toHaveBeenCalledTimes(1);
		expect(onNodeDoubleClick).toHaveBeenCalledWith(node.id, node);
	});

	it('should not call onNodeDoubleClick when node is disabled', () => {
		const node = createMockNode({ disabled: true });
		const onNodeDoubleClick = vi.fn();

		const { handleDoubleClick } = createNodeHandlers({
			node,
			hasChildren: false,
			nodeIsExpanded: false,
			selectionMode: 'none',
			onNodeClick: vi.fn(),
			onNodeDoubleClick,
			onNodeToggle: vi.fn(),
			onNodeExpand: vi.fn(),
			onNodeCollapse: vi.fn(),
			onKeyDown: vi.fn(),
		});

		const event = createMockMouseEvent();
		handleDoubleClick(event);

		expect(onNodeDoubleClick).not.toHaveBeenCalled();
	});

	it('should create a key down handler that works correctly', () => {
		const node = createMockNode();
		const onKeyDown = vi.fn();

		const { handleKeyDown } = createNodeHandlers({
			node,
			hasChildren: false,
			nodeIsExpanded: false,
			selectionMode: 'none',
			onNodeClick: vi.fn(),
			onNodeDoubleClick: vi.fn(),
			onNodeToggle: vi.fn(),
			onNodeExpand: vi.fn(),
			onNodeCollapse: vi.fn(),
			onKeyDown,
		});

		const event = createMockKeyboardEvent();
		handleKeyDown(event);

		expect(onKeyDown).toHaveBeenCalledTimes(1);
		expect(onKeyDown).toHaveBeenCalledWith(event, node.id);
	});

	it('should not call onKeyDown when node is disabled', () => {
		const node = createMockNode({ disabled: true });
		const onKeyDown = vi.fn();

		const { handleKeyDown } = createNodeHandlers({
			node,
			hasChildren: false,
			nodeIsExpanded: false,
			selectionMode: 'none',
			onNodeClick: vi.fn(),
			onNodeDoubleClick: vi.fn(),
			onNodeToggle: vi.fn(),
			onNodeExpand: vi.fn(),
			onNodeCollapse: vi.fn(),
			onKeyDown,
		});

		const event = createMockKeyboardEvent();
		handleKeyDown(event);

		expect(onKeyDown).not.toHaveBeenCalled();
	});

	it('should create all handlers that work independently', () => {
		const node = createMockNode();
		const onNodeClick = vi.fn();
		const onNodeDoubleClick = vi.fn();
		const onKeyDown = vi.fn();

		const { handleClick, handleDoubleClick, handleKeyDown } = createNodeHandlers({
			node,
			hasChildren: false,
			nodeIsExpanded: false,
			selectionMode: 'none',
			onNodeClick,
			onNodeDoubleClick,
			onNodeToggle: vi.fn(),
			onNodeExpand: vi.fn(),
			onNodeCollapse: vi.fn(),
			onKeyDown,
		});

		const mouseEvent = createMockMouseEvent();
		const keyboardEvent = createMockKeyboardEvent();

		handleClick(mouseEvent);
		handleDoubleClick(mouseEvent);
		handleKeyDown(keyboardEvent);

		expect(onNodeClick).toHaveBeenCalledTimes(1);
		expect(onNodeDoubleClick).toHaveBeenCalledTimes(1);
		expect(onKeyDown).toHaveBeenCalledTimes(1);
	});

	it('should handle multiple nodes with different configurations', () => {
		const node1 = createMockNode({ id: 'node-1' });
		const node2 = createMockNode({ id: 'node-2', disabled: true });
		const node3 = createMockNode({ id: 'node-3' });

		const onNodeClick1 = vi.fn();
		const onNodeClick2 = vi.fn();
		const onNodeClick3 = vi.fn();

		const handlers1 = createNodeHandlers({
			node: node1,
			hasChildren: true,
			nodeIsExpanded: false,
			selectionMode: 'single',
			onNodeClick: onNodeClick1,
			onNodeDoubleClick: vi.fn(),
			onNodeToggle: vi.fn(),
			onNodeExpand: vi.fn(),
			onNodeCollapse: vi.fn(),
			onKeyDown: vi.fn(),
		});

		const handlers2 = createNodeHandlers({
			node: node2,
			hasChildren: false,
			nodeIsExpanded: false,
			selectionMode: 'none',
			onNodeClick: onNodeClick2,
			onNodeDoubleClick: vi.fn(),
			onNodeToggle: vi.fn(),
			onNodeExpand: vi.fn(),
			onNodeCollapse: vi.fn(),
			onKeyDown: vi.fn(),
		});

		const handlers3 = createNodeHandlers({
			node: node3,
			hasChildren: false,
			nodeIsExpanded: false,
			selectionMode: 'multiple',
			onNodeClick: onNodeClick3,
			onNodeDoubleClick: vi.fn(),
			onNodeToggle: vi.fn(),
			onNodeExpand: vi.fn(),
			onNodeCollapse: vi.fn(),
			onKeyDown: vi.fn(),
		});

		handlers1.handleClick(createMockMouseEvent());
		handlers2.handleClick(createMockMouseEvent());
		handlers3.handleClick(createMockMouseEvent());

		expect(onNodeClick1).toHaveBeenCalledWith('node-1', node1);
		expect(onNodeClick2).not.toHaveBeenCalled(); // disabled
		expect(onNodeClick3).toHaveBeenCalledWith('node-3', node3);
	});
});
