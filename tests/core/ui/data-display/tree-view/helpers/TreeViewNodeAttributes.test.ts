/**
 * TreeViewNodeAttributes Tests
 *
 * Tests for TreeViewNodeAttributes helper functions:
 * - getTreeItemAriaAttributes: Returns correct ARIA attributes based on node state
 * - getTreeNodeElementAttributes: Returns correct HTML element attributes
 */

import {
	getTreeItemAriaAttributes,
	getTreeNodeElementAttributes,
} from '@core/ui/data-display/tree-view/helpers/TreeViewNodeAttributes';
import type { TreeViewSelectionMode } from '@src-types/ui/navigation/treeView';
import type React from 'react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';

describe('getTreeItemAriaAttributes', () => {
	it('should be a function', () => {
		expect(typeof getTreeItemAriaAttributes).toBe('function');
	});

	describe('aria-expanded attribute', () => {
		it('returns undefined when node has no children', () => {
			const result = getTreeItemAriaAttributes({
				hasChildren: false,
				nodeIsExpanded: false,
				selectionMode: 'none',
				nodeIsSelected: false,
				nodeDisabled: undefined,
			});

			expect(result['aria-expanded']).toBeUndefined();
		});

		it('returns undefined when node has no children even if expanded', () => {
			const result = getTreeItemAriaAttributes({
				hasChildren: false,
				nodeIsExpanded: true,
				selectionMode: 'none',
				nodeIsSelected: false,
				nodeDisabled: undefined,
			});

			expect(result['aria-expanded']).toBeUndefined();
		});

		it('returns false when node has children but is not expanded', () => {
			const result = getTreeItemAriaAttributes({
				hasChildren: true,
				nodeIsExpanded: false,
				selectionMode: 'none',
				nodeIsSelected: false,
				nodeDisabled: undefined,
			});

			expect(result['aria-expanded']).toBe(false);
		});

		it('returns true when node has children and is expanded', () => {
			const result = getTreeItemAriaAttributes({
				hasChildren: true,
				nodeIsExpanded: true,
				selectionMode: 'none',
				nodeIsSelected: false,
				nodeDisabled: undefined,
			});

			expect(result['aria-expanded']).toBe(true);
		});
	});

	describe('aria-selected attribute', () => {
		it('returns false when selectionMode is "none" regardless of selection state', () => {
			const result1 = getTreeItemAriaAttributes({
				hasChildren: false,
				nodeIsExpanded: false,
				selectionMode: 'none',
				nodeIsSelected: true,
				nodeDisabled: undefined,
			});

			const result2 = getTreeItemAriaAttributes({
				hasChildren: false,
				nodeIsExpanded: false,
				selectionMode: 'none',
				nodeIsSelected: false,
				nodeDisabled: undefined,
			});

			expect(result1['aria-selected']).toBe(false);
			expect(result2['aria-selected']).toBe(false);
		});

		it('returns true when selectionMode is "single" and node is selected', () => {
			const result = getTreeItemAriaAttributes({
				hasChildren: false,
				nodeIsExpanded: false,
				selectionMode: 'single',
				nodeIsSelected: true,
				nodeDisabled: undefined,
			});

			expect(result['aria-selected']).toBe(true);
		});

		it('returns false when selectionMode is "single" and node is not selected', () => {
			const result = getTreeItemAriaAttributes({
				hasChildren: false,
				nodeIsExpanded: false,
				selectionMode: 'single',
				nodeIsSelected: false,
				nodeDisabled: undefined,
			});

			expect(result['aria-selected']).toBe(false);
		});

		it('returns true when selectionMode is "multiple" and node is selected', () => {
			const result = getTreeItemAriaAttributes({
				hasChildren: false,
				nodeIsExpanded: false,
				selectionMode: 'multiple',
				nodeIsSelected: true,
				nodeDisabled: undefined,
			});

			expect(result['aria-selected']).toBe(true);
		});

		it('returns false when selectionMode is "multiple" and node is not selected', () => {
			const result = getTreeItemAriaAttributes({
				hasChildren: false,
				nodeIsExpanded: false,
				selectionMode: 'multiple',
				nodeIsSelected: false,
				nodeDisabled: undefined,
			});

			expect(result['aria-selected']).toBe(false);
		});

		it('handles all selection modes correctly', () => {
			const modes: TreeViewSelectionMode[] = ['none', 'single', 'multiple'];

			for (const mode of modes) {
				const selectedResult = getTreeItemAriaAttributes({
					hasChildren: false,
					nodeIsExpanded: false,
					selectionMode: mode,
					nodeIsSelected: true,
					nodeDisabled: undefined,
				});

				const unselectedResult = getTreeItemAriaAttributes({
					hasChildren: false,
					nodeIsExpanded: false,
					selectionMode: mode,
					nodeIsSelected: false,
					nodeDisabled: undefined,
				});

				if (mode === 'none') {
					expect(selectedResult['aria-selected']).toBe(false);
					expect(unselectedResult['aria-selected']).toBe(false);
				} else {
					expect(selectedResult['aria-selected']).toBe(true);
					expect(unselectedResult['aria-selected']).toBe(false);
				}
			}
		});
	});

	describe('aria-disabled attribute', () => {
		it('returns undefined when nodeDisabled is undefined', () => {
			const result = getTreeItemAriaAttributes({
				hasChildren: false,
				nodeIsExpanded: false,
				selectionMode: 'none',
				nodeIsSelected: false,
				nodeDisabled: undefined,
			});

			expect(result['aria-disabled']).toBeUndefined();
		});

		it('returns false when nodeDisabled is false', () => {
			const result = getTreeItemAriaAttributes({
				hasChildren: false,
				nodeIsExpanded: false,
				selectionMode: 'none',
				nodeIsSelected: false,
				nodeDisabled: false,
			});

			expect(result['aria-disabled']).toBe(false);
		});

		it('returns true when nodeDisabled is true', () => {
			const result = getTreeItemAriaAttributes({
				hasChildren: false,
				nodeIsExpanded: false,
				selectionMode: 'none',
				nodeIsSelected: false,
				nodeDisabled: true,
			});

			expect(result['aria-disabled']).toBe(true);
		});
	});

	describe('combined attributes', () => {
		it('returns all attributes correctly for expanded, selected, enabled node with children', () => {
			const result = getTreeItemAriaAttributes({
				hasChildren: true,
				nodeIsExpanded: true,
				selectionMode: 'single',
				nodeIsSelected: true,
				nodeDisabled: false,
			});

			expect(result['aria-expanded']).toBe(true);
			expect(result['aria-selected']).toBe(true);
			expect(result['aria-disabled']).toBe(false);
		});

		it('returns all attributes correctly for collapsed, unselected, disabled node with children', () => {
			const result = getTreeItemAriaAttributes({
				hasChildren: true,
				nodeIsExpanded: false,
				selectionMode: 'multiple',
				nodeIsSelected: false,
				nodeDisabled: true,
			});

			expect(result['aria-expanded']).toBe(false);
			expect(result['aria-selected']).toBe(false);
			expect(result['aria-disabled']).toBe(true);
		});

		it('returns all attributes correctly for leaf node with selection mode none', () => {
			const result = getTreeItemAriaAttributes({
				hasChildren: false,
				nodeIsExpanded: false,
				selectionMode: 'none',
				nodeIsSelected: false,
				nodeDisabled: undefined,
			});

			expect(result['aria-expanded']).toBeUndefined();
			expect(result['aria-selected']).toBe(false);
			expect(result['aria-disabled']).toBeUndefined();
		});
	});
});

describe('getTreeNodeElementAttributes', () => {
	const createMockHandlers = () => {
		return {
			handleClick: vi.fn() as React.MouseEventHandler<HTMLDivElement>,
			handleDoubleClick: vi.fn() as React.MouseEventHandler<HTMLDivElement>,
			handleKeyDown: vi.fn() as React.KeyboardEventHandler<HTMLDivElement>,
		};
	};

	const createMockAriaAttrs = (
		overrides?: Partial<ReturnType<typeof getTreeItemAriaAttributes>>
	) => {
		return {
			'aria-expanded': undefined,
			'aria-selected': false,
			'aria-disabled': undefined,
			...overrides,
		};
	};

	it('should be a function', () => {
		expect(typeof getTreeNodeElementAttributes).toBe('function');
	});

	describe('ref attribute', () => {
		it('returns the provided nodeRef', () => {
			const nodeRef = createRef<HTMLDivElement>();
			const handlers = createMockHandlers();
			const ariaAttrs = createMockAriaAttrs();

			const result = getTreeNodeElementAttributes({
				nodeRef,
				nodeButtonId: 'test-id',
				isFocused: false,
				ariaAttrs,
				...handlers,
			});

			expect(result.ref).toBe(nodeRef);
		});

		it('handles different ref instances', () => {
			const nodeRef1 = createRef<HTMLDivElement>();
			const nodeRef2 = createRef<HTMLDivElement>();
			const handlers = createMockHandlers();
			const ariaAttrs = createMockAriaAttrs();

			const result1 = getTreeNodeElementAttributes({
				nodeRef: nodeRef1,
				nodeButtonId: 'test-id',
				isFocused: false,
				ariaAttrs,
				...handlers,
			});

			const result2 = getTreeNodeElementAttributes({
				nodeRef: nodeRef2,
				nodeButtonId: 'test-id',
				isFocused: false,
				ariaAttrs,
				...handlers,
			});

			expect(result1.ref).toBe(nodeRef1);
			expect(result2.ref).toBe(nodeRef2);
			expect(result1.ref).not.toBe(result2.ref);
		});
	});

	describe('role attribute', () => {
		it('always returns "treeitem" role', () => {
			const nodeRef = createRef<HTMLDivElement>();
			const handlers = createMockHandlers();
			const ariaAttrs = createMockAriaAttrs();

			const result = getTreeNodeElementAttributes({
				nodeRef,
				nodeButtonId: 'test-id',
				isFocused: false,
				ariaAttrs,
				...handlers,
			});

			expect(result.role).toBe('treeitem');
		});
	});

	describe('tabIndex attribute', () => {
		it('returns 0 when node is focused', () => {
			const nodeRef = createRef<HTMLDivElement>();
			const handlers = createMockHandlers();
			const ariaAttrs = createMockAriaAttrs();

			const result = getTreeNodeElementAttributes({
				nodeRef,
				nodeButtonId: 'test-id',
				isFocused: true,
				ariaAttrs,
				...handlers,
			});

			expect(result.tabIndex).toBe(0);
		});

		it('returns -1 when node is not focused', () => {
			const nodeRef = createRef<HTMLDivElement>();
			const handlers = createMockHandlers();
			const ariaAttrs = createMockAriaAttrs();

			const result = getTreeNodeElementAttributes({
				nodeRef,
				nodeButtonId: 'test-id',
				isFocused: false,
				ariaAttrs,
				...handlers,
			});

			expect(result.tabIndex).toBe(-1);
		});
	});

	describe('id attribute', () => {
		it('returns the provided nodeButtonId', () => {
			const nodeRef = createRef<HTMLDivElement>();
			const handlers = createMockHandlers();
			const ariaAttrs = createMockAriaAttrs();

			const result = getTreeNodeElementAttributes({
				nodeRef,
				nodeButtonId: 'custom-button-id',
				isFocused: false,
				ariaAttrs,
				...handlers,
			});

			expect(result.id).toBe('custom-button-id');
		});

		it('handles different nodeButtonId values', () => {
			const nodeRef = createRef<HTMLDivElement>();
			const handlers = createMockHandlers();
			const ariaAttrs = createMockAriaAttrs();

			const result1 = getTreeNodeElementAttributes({
				nodeRef,
				nodeButtonId: 'id-1',
				isFocused: false,
				ariaAttrs,
				...handlers,
			});

			const result2 = getTreeNodeElementAttributes({
				nodeRef,
				nodeButtonId: 'id-2',
				isFocused: false,
				ariaAttrs,
				...handlers,
			});

			expect(result1.id).toBe('id-1');
			expect(result2.id).toBe('id-2');
		});
	});

	describe('ARIA attributes forwarding', () => {
		it('forwards aria-expanded from ariaAttrs', () => {
			const nodeRef = createRef<HTMLDivElement>();
			const handlers = createMockHandlers();
			const ariaAttrs = createMockAriaAttrs({ 'aria-expanded': true });

			const result = getTreeNodeElementAttributes({
				nodeRef,
				nodeButtonId: 'test-id',
				isFocused: false,
				ariaAttrs,
				...handlers,
			});

			expect(result['aria-expanded']).toBe(true);
		});

		it('forwards undefined aria-expanded from ariaAttrs', () => {
			const nodeRef = createRef<HTMLDivElement>();
			const handlers = createMockHandlers();
			const ariaAttrs = createMockAriaAttrs({ 'aria-expanded': undefined });

			const result = getTreeNodeElementAttributes({
				nodeRef,
				nodeButtonId: 'test-id',
				isFocused: false,
				ariaAttrs,
				...handlers,
			});

			expect(result['aria-expanded']).toBeUndefined();
		});

		it('forwards aria-selected from ariaAttrs', () => {
			const nodeRef = createRef<HTMLDivElement>();
			const handlers = createMockHandlers();
			const ariaAttrs = createMockAriaAttrs({ 'aria-selected': true });

			const result = getTreeNodeElementAttributes({
				nodeRef,
				nodeButtonId: 'test-id',
				isFocused: false,
				ariaAttrs,
				...handlers,
			});

			expect(result['aria-selected']).toBe(true);
		});

		it('forwards aria-disabled from ariaAttrs', () => {
			const nodeRef = createRef<HTMLDivElement>();
			const handlers = createMockHandlers();
			const ariaAttrs = createMockAriaAttrs({ 'aria-disabled': true });

			const result = getTreeNodeElementAttributes({
				nodeRef,
				nodeButtonId: 'test-id',
				isFocused: false,
				ariaAttrs,
				...handlers,
			});

			expect(result['aria-disabled']).toBe(true);
		});

		it('forwards all ARIA attributes correctly', () => {
			const nodeRef = createRef<HTMLDivElement>();
			const handlers = createMockHandlers();
			const ariaAttrs = createMockAriaAttrs({
				'aria-expanded': true,
				'aria-selected': true,
				'aria-disabled': false,
			});

			const result = getTreeNodeElementAttributes({
				nodeRef,
				nodeButtonId: 'test-id',
				isFocused: false,
				ariaAttrs,
				...handlers,
			});

			expect(result['aria-expanded']).toBe(true);
			expect(result['aria-selected']).toBe(true);
			expect(result['aria-disabled']).toBe(false);
		});
	});

	describe('event handlers', () => {
		it('returns the provided handleClick handler', () => {
			const nodeRef = createRef<HTMLDivElement>();
			const handlers = createMockHandlers();
			const ariaAttrs = createMockAriaAttrs();

			const result = getTreeNodeElementAttributes({
				nodeRef,
				nodeButtonId: 'test-id',
				isFocused: false,
				ariaAttrs,
				...handlers,
			});

			expect(result.onClick).toBe(handlers.handleClick);
		});

		it('returns the provided handleDoubleClick handler', () => {
			const nodeRef = createRef<HTMLDivElement>();
			const handlers = createMockHandlers();
			const ariaAttrs = createMockAriaAttrs();

			const result = getTreeNodeElementAttributes({
				nodeRef,
				nodeButtonId: 'test-id',
				isFocused: false,
				ariaAttrs,
				...handlers,
			});

			expect(result.onDoubleClick).toBe(handlers.handleDoubleClick);
		});

		it('returns the provided handleKeyDown handler', () => {
			const nodeRef = createRef<HTMLDivElement>();
			const handlers = createMockHandlers();
			const ariaAttrs = createMockAriaAttrs();

			const result = getTreeNodeElementAttributes({
				nodeRef,
				nodeButtonId: 'test-id',
				isFocused: false,
				ariaAttrs,
				...handlers,
			});

			expect(result.onKeyDown).toBe(handlers.handleKeyDown);
		});

		it('handles different handler instances', () => {
			const nodeRef = createRef<HTMLDivElement>();
			const handlers1 = createMockHandlers();
			const handlers2 = createMockHandlers();
			const ariaAttrs = createMockAriaAttrs();

			const result1 = getTreeNodeElementAttributes({
				nodeRef,
				nodeButtonId: 'test-id',
				isFocused: false,
				ariaAttrs,
				...handlers1,
			});

			const result2 = getTreeNodeElementAttributes({
				nodeRef,
				nodeButtonId: 'test-id',
				isFocused: false,
				ariaAttrs,
				...handlers2,
			});

			expect(result1.onClick).toBe(handlers1.handleClick);
			expect(result2.onClick).toBe(handlers2.handleClick);
			expect(result1.onClick).not.toBe(result2.onClick);
		});
	});

	describe('combined attributes', () => {
		it('returns all attributes correctly for focused, expanded, selected node', () => {
			const nodeRef = createRef<HTMLDivElement>();
			const handlers = createMockHandlers();
			const ariaAttrs = createMockAriaAttrs({
				'aria-expanded': true,
				'aria-selected': true,
				'aria-disabled': undefined,
			});

			const result = getTreeNodeElementAttributes({
				nodeRef,
				nodeButtonId: 'focused-node',
				isFocused: true,
				ariaAttrs,
				...handlers,
			});

			expect(result.ref).toBe(nodeRef);
			expect(result.role).toBe('treeitem');
			expect(result.tabIndex).toBe(0);
			expect(result.id).toBe('focused-node');
			expect(result['aria-expanded']).toBe(true);
			expect(result['aria-selected']).toBe(true);
			expect(result['aria-disabled']).toBeUndefined();
			expect(result.onClick).toBe(handlers.handleClick);
			expect(result.onDoubleClick).toBe(handlers.handleDoubleClick);
			expect(result.onKeyDown).toBe(handlers.handleKeyDown);
		});

		it('returns all attributes correctly for unfocused, collapsed, unselected, disabled node', () => {
			const nodeRef = createRef<HTMLDivElement>();
			const handlers = createMockHandlers();
			const ariaAttrs = createMockAriaAttrs({
				'aria-expanded': false,
				'aria-selected': false,
				'aria-disabled': true,
			});

			const result = getTreeNodeElementAttributes({
				nodeRef,
				nodeButtonId: 'unfocused-node',
				isFocused: false,
				ariaAttrs,
				...handlers,
			});

			expect(result.ref).toBe(nodeRef);
			expect(result.role).toBe('treeitem');
			expect(result.tabIndex).toBe(-1);
			expect(result.id).toBe('unfocused-node');
			expect(result['aria-expanded']).toBe(false);
			expect(result['aria-selected']).toBe(false);
			expect(result['aria-disabled']).toBe(true);
			expect(result.onClick).toBe(handlers.handleClick);
			expect(result.onDoubleClick).toBe(handlers.handleDoubleClick);
			expect(result.onKeyDown).toBe(handlers.handleKeyDown);
		});
	});
});
