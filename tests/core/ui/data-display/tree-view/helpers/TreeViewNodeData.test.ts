/**
 * Tests for TreeViewNodeData helper functions
 *
 * Tests helper functions:
 * - createSharedProps
 * - prepareTreeNodeElementData
 */

import {
	getTreeItemAriaAttributes,
	getTreeNodeElementAttributes,
} from '@core/ui/data-display/tree-view/helpers/TreeViewNodeAttributes';
import {
	createSharedProps,
	prepareTreeNodeElementData,
} from '@core/ui/data-display/tree-view/helpers/TreeViewNodeData';
import { getTreeNodeElementClasses } from '@core/ui/data-display/tree-view/helpers/TreeViewNodeStyles';
import type {
	TreeNodeElementProps,
	TreeViewNodeSharedProps,
} from '@core/ui/data-display/tree-view/types/TreeViewNodeTypes';
import type { TreeNode, TreeViewSelectionMode } from '@src-types/ui/navigation/treeView';
import type { KeyboardEvent, MouseEvent } from 'react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';

// Mock dependencies
vi.mock('@core/ui/data-display/tree-view/helpers/TreeViewNodeAttributes', () => ({
	getTreeItemAriaAttributes: vi.fn(),
	getTreeNodeElementAttributes: vi.fn(),
}));

vi.mock('@core/ui/data-display/tree-view/helpers/TreeViewNodeStyles', () => ({
	getTreeNodeElementClasses: vi.fn(),
}));

// Helper to create a mock TreeNode
const createMockTreeNode = (overrides?: Partial<TreeNode>): TreeNode => ({
	id: 'node-1',
	label: 'Test Node',
	...overrides,
});

// Helper to create mock shared props
const createMockSharedProps = (
	overrides?: Partial<TreeViewNodeSharedProps>
): TreeViewNodeSharedProps => ({
	treeViewId: 'tree-view-1',
	size: 'md',
	selectionMode: 'none',
	isSelected: vi.fn(() => false),
	isExpanded: vi.fn(() => false),
	showExpandIcons: true,
	focusedNodeId: null,
	onNodeClick: vi.fn(),
	onNodeDoubleClick: vi.fn(),
	onNodeToggle: vi.fn(),
	onNodeExpand: vi.fn(),
	onNodeCollapse: vi.fn(),
	onKeyDown: vi.fn(),
	...overrides,
});

// Helper to create mock TreeNodeElementProps
const createMockElementProps = (
	overrides?: Partial<TreeNodeElementProps>
): TreeNodeElementProps => {
	const nodeRef = createRef<HTMLDivElement>();
	const node = createMockTreeNode(overrides?.node);

	return {
		nodeRef,
		nodeButtonId: 'node-button-1',
		nodeContentId: 'node-content-1',
		node,
		hasChildren: false,
		isFocused: false,
		nodeIsSelected: false,
		nodeIsExpanded: false,
		selectionMode: 'none',
		size: 'md',
		showExpandIcons: true,
		handleClick: vi.fn((e: MouseEvent<HTMLDivElement>) => {}),
		handleDoubleClick: vi.fn((e: MouseEvent<HTMLDivElement>) => {}),
		handleKeyDown: vi.fn((e: KeyboardEvent<HTMLDivElement>) => {}),
		...overrides,
	};
};

describe('TreeViewNodeData - createSharedProps', () => {
	it('should return the input props as readonly', () => {
		const inputProps = createMockSharedProps();
		const result = createSharedProps(inputProps);

		expect(result).toBe(inputProps);
		expect(result).toEqual(inputProps);
	});

	it('should preserve all shared props', () => {
		const inputProps = createMockSharedProps({
			treeViewId: 'custom-tree-id',
			size: 'lg',
			selectionMode: 'multiple',
			showExpandIcons: false,
			focusedNodeId: 'node-2',
		});

		const result = createSharedProps(inputProps);

		expect(result.treeViewId).toBe('custom-tree-id');
		expect(result.size).toBe('lg');
		expect(result.selectionMode).toBe('multiple');
		expect(result.showExpandIcons).toBe(false);
		expect(result.focusedNodeId).toBe('node-2');
	});

	it('should preserve function references', () => {
		const isSelected = vi.fn(() => true);
		const onNodeClick = vi.fn();
		const inputProps = createMockSharedProps({
			isSelected,
			onNodeClick,
		});

		const result = createSharedProps(inputProps);

		expect(result.isSelected).toBe(isSelected);
		expect(result.onNodeClick).toBe(onNodeClick);
	});

	it('should handle different selection modes', () => {
		const modes: TreeViewSelectionMode[] = ['none', 'single', 'multiple'];

		for (const mode of modes) {
			const inputProps = createMockSharedProps({ selectionMode: mode });
			const result = createSharedProps(inputProps);
			expect(result.selectionMode).toBe(mode);
		}
	});

	it('should handle different sizes', () => {
		const sizes = ['sm', 'md', 'lg'] as const;

		for (const size of sizes) {
			const inputProps = createMockSharedProps({ size });
			const result = createSharedProps(inputProps);
			expect(result.size).toBe(size);
		}
	});
});

describe('TreeViewNodeData - prepareTreeNodeElementData', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should call getTreeNodeElementClasses with correct parameters', () => {
		const mockClasses = 'tree-node-class';
		vi.mocked(getTreeNodeElementClasses).mockReturnValue(mockClasses);

		const props = createMockElementProps({
			size: 'md',
			nodeIsSelected: true,
			node: createMockTreeNode({ disabled: false }),
		});

		prepareTreeNodeElementData(props);

		expect(getTreeNodeElementClasses).toHaveBeenCalledWith('md', true, false);
	});

	it('should call getTreeItemAriaAttributes with correct parameters', () => {
		const props = createMockElementProps({
			hasChildren: true,
			nodeIsExpanded: true,
			selectionMode: 'single',
			nodeIsSelected: true,
			node: createMockTreeNode({ disabled: false }),
		});

		const mockAriaAttrs = {
			'aria-expanded': true,
			'aria-selected': true,
			'aria-disabled': undefined,
		};
		vi.mocked(getTreeItemAriaAttributes).mockReturnValue(mockAriaAttrs);
		vi.mocked(getTreeNodeElementClasses).mockReturnValue('classes');
		vi.mocked(getTreeNodeElementAttributes).mockReturnValue({
			ref: props.nodeRef,
			role: 'treeitem',
			tabIndex: -1,
			'aria-expanded': true,
			'aria-selected': true,
			'aria-disabled': undefined,
			id: 'node-button-1',
			onClick: props.handleClick,
			onDoubleClick: props.handleDoubleClick,
			onKeyDown: props.handleKeyDown,
		} as any);

		prepareTreeNodeElementData(props);

		expect(getTreeItemAriaAttributes).toHaveBeenCalledWith({
			hasChildren: true,
			nodeIsExpanded: true,
			selectionMode: 'single',
			nodeIsSelected: true,
			nodeDisabled: false,
		});
	});

	it('should call getTreeNodeElementAttributes with correct parameters', () => {
		const mockAriaAttrs = {
			'aria-expanded': undefined,
			'aria-selected': false,
			'aria-disabled': undefined,
		};
		const mockElementAttrs = {
			ref: createRef<HTMLDivElement>(),
			role: 'treeitem' as const,
			tabIndex: -1,
			'aria-expanded': undefined,
			'aria-selected': false,
			'aria-disabled': undefined,
			id: 'node-button-1',
			onClick: vi.fn(),
			onDoubleClick: vi.fn(),
			onKeyDown: vi.fn(),
		};

		vi.mocked(getTreeItemAriaAttributes).mockReturnValue(mockAriaAttrs);
		vi.mocked(getTreeNodeElementClasses).mockReturnValue('classes');
		vi.mocked(getTreeNodeElementAttributes).mockReturnValue(mockElementAttrs);

		const props = createMockElementProps({
			nodeRef: createRef<HTMLDivElement>(),
			nodeButtonId: 'custom-button-id',
			isFocused: false,
		});

		prepareTreeNodeElementData(props);

		expect(getTreeNodeElementAttributes).toHaveBeenCalledWith({
			nodeRef: props.nodeRef,
			nodeButtonId: 'custom-button-id',
			isFocused: false,
			ariaAttrs: mockAriaAttrs,
			handleClick: props.handleClick,
			handleDoubleClick: props.handleDoubleClick,
			handleKeyDown: props.handleKeyDown,
		});
	});

	it('should return nodeClasses and elementAttrs', () => {
		const mockClasses = 'tree-node-classes';
		const mockElementAttrs = {
			ref: createRef<HTMLDivElement>(),
			role: 'treeitem' as const,
			tabIndex: -1,
			'aria-expanded': undefined,
			'aria-selected': false,
			'aria-disabled': undefined,
			id: 'node-button-1',
			onClick: vi.fn(),
			onDoubleClick: vi.fn(),
			onKeyDown: vi.fn(),
		};

		vi.mocked(getTreeNodeElementClasses).mockReturnValue(mockClasses);
		vi.mocked(getTreeItemAriaAttributes).mockReturnValue({
			'aria-expanded': undefined,
			'aria-selected': false,
			'aria-disabled': undefined,
		});
		vi.mocked(getTreeNodeElementAttributes).mockReturnValue(mockElementAttrs);

		const props = createMockElementProps();
		const result = prepareTreeNodeElementData(props);

		expect(result).toEqual({
			nodeClasses: mockClasses,
			elementAttrs: mockElementAttrs,
		});
	});

	it('should handle disabled nodes correctly', () => {
		vi.mocked(getTreeNodeElementClasses).mockReturnValue('classes');
		vi.mocked(getTreeItemAriaAttributes).mockReturnValue({
			'aria-expanded': undefined,
			'aria-selected': false,
			'aria-disabled': true,
		});
		vi.mocked(getTreeNodeElementAttributes).mockReturnValue({
			ref: createRef<HTMLDivElement>(),
			role: 'treeitem' as const,
			tabIndex: -1,
			'aria-expanded': undefined,
			'aria-selected': false,
			'aria-disabled': true,
			id: 'node-button-1',
			onClick: vi.fn(),
			onDoubleClick: vi.fn(),
			onKeyDown: vi.fn(),
		} as any);

		const props = createMockElementProps({
			node: createMockTreeNode({ disabled: true }),
		});

		prepareTreeNodeElementData(props);

		expect(getTreeNodeElementClasses).toHaveBeenCalledWith('md', false, true);
		expect(getTreeItemAriaAttributes).toHaveBeenCalledWith(
			expect.objectContaining({
				nodeDisabled: true,
			})
		);
	});

	it('should handle nodes with children correctly', () => {
		vi.mocked(getTreeNodeElementClasses).mockReturnValue('classes');
		vi.mocked(getTreeItemAriaAttributes).mockReturnValue({
			'aria-expanded': true,
			'aria-selected': false,
			'aria-disabled': undefined,
		});
		vi.mocked(getTreeNodeElementAttributes).mockReturnValue({
			ref: createRef<HTMLDivElement>(),
			role: 'treeitem' as const,
			tabIndex: -1,
			'aria-expanded': true,
			'aria-selected': false,
			'aria-disabled': undefined,
			id: 'node-button-1',
			onClick: vi.fn(),
			onDoubleClick: vi.fn(),
			onKeyDown: vi.fn(),
		} as any);

		const props = createMockElementProps({
			hasChildren: true,
			nodeIsExpanded: true,
		});

		prepareTreeNodeElementData(props);

		expect(getTreeItemAriaAttributes).toHaveBeenCalledWith(
			expect.objectContaining({
				hasChildren: true,
				nodeIsExpanded: true,
			})
		);
	});

	it('should handle different selection modes', () => {
		const selectionModes: TreeViewSelectionMode[] = ['none', 'single', 'multiple'];

		for (const mode of selectionModes) {
			vi.clearAllMocks();
			vi.mocked(getTreeNodeElementClasses).mockReturnValue('classes');
			vi.mocked(getTreeItemAriaAttributes).mockReturnValue({
				'aria-expanded': undefined,
				'aria-selected': mode !== 'none',
				'aria-disabled': undefined,
			});
			vi.mocked(getTreeNodeElementAttributes).mockReturnValue({
				ref: createRef<HTMLDivElement>(),
				role: 'treeitem' as const,
				tabIndex: -1,
				'aria-expanded': undefined,
				'aria-selected': mode !== 'none',
				'aria-disabled': undefined,
				id: 'node-button-1',
				onClick: vi.fn(),
				onDoubleClick: vi.fn(),
				onKeyDown: vi.fn(),
			} as any);

			const props = createMockElementProps({
				selectionMode: mode,
				nodeIsSelected: true,
			});

			prepareTreeNodeElementData(props);

			expect(getTreeItemAriaAttributes).toHaveBeenCalledWith(
				expect.objectContaining({
					selectionMode: mode,
					nodeIsSelected: true,
				})
			);
		}
	});

	it('should handle different sizes', () => {
		const sizes = ['sm', 'md', 'lg'] as const;

		for (const size of sizes) {
			vi.clearAllMocks();
			vi.mocked(getTreeNodeElementClasses).mockReturnValue('classes');
			vi.mocked(getTreeItemAriaAttributes).mockReturnValue({
				'aria-expanded': undefined,
				'aria-selected': false,
				'aria-disabled': undefined,
			});
			vi.mocked(getTreeNodeElementAttributes).mockReturnValue({
				ref: createRef<HTMLDivElement>(),
				role: 'treeitem' as const,
				tabIndex: -1,
				'aria-expanded': undefined,
				'aria-selected': false,
				'aria-disabled': undefined,
				id: 'node-button-1',
				onClick: vi.fn(),
				onDoubleClick: vi.fn(),
				onKeyDown: vi.fn(),
			} as any);

			const props = createMockElementProps({ size });

			prepareTreeNodeElementData(props);

			expect(getTreeNodeElementClasses).toHaveBeenCalledWith(size, false, undefined);
		}
	});

	it('should handle focused nodes correctly', () => {
		vi.mocked(getTreeNodeElementClasses).mockReturnValue('classes');
		vi.mocked(getTreeItemAriaAttributes).mockReturnValue({
			'aria-expanded': undefined,
			'aria-selected': false,
			'aria-disabled': undefined,
		});
		const mockElementAttrs = {
			ref: createRef<HTMLDivElement>(),
			role: 'treeitem' as const,
			tabIndex: 0,
			'aria-expanded': undefined,
			'aria-selected': false,
			'aria-disabled': undefined,
			id: 'node-button-1',
			onClick: vi.fn(),
			onDoubleClick: vi.fn(),
			onKeyDown: vi.fn(),
		};
		vi.mocked(getTreeNodeElementAttributes).mockReturnValue(mockElementAttrs);

		const props = createMockElementProps({ isFocused: true });

		prepareTreeNodeElementData(props);

		expect(getTreeNodeElementAttributes).toHaveBeenCalledWith(
			expect.objectContaining({
				isFocused: true,
			})
		);
	});

	it('should pass all event handlers correctly', () => {
		const handleClick = vi.fn();
		const handleDoubleClick = vi.fn();
		const handleKeyDown = vi.fn();

		vi.mocked(getTreeNodeElementClasses).mockReturnValue('classes');
		vi.mocked(getTreeItemAriaAttributes).mockReturnValue({
			'aria-expanded': undefined,
			'aria-selected': false,
			'aria-disabled': undefined,
		});
		vi.mocked(getTreeNodeElementAttributes).mockReturnValue({
			ref: createRef<HTMLDivElement>(),
			role: 'treeitem' as const,
			tabIndex: -1,
			'aria-expanded': undefined,
			'aria-selected': false,
			'aria-disabled': undefined,
			id: 'node-button-1',
			onClick: handleClick,
			onDoubleClick: handleDoubleClick,
			onKeyDown: handleKeyDown,
		} as any);

		const props = createMockElementProps({
			handleClick,
			handleDoubleClick,
			handleKeyDown,
		});

		prepareTreeNodeElementData(props);

		expect(getTreeNodeElementAttributes).toHaveBeenCalledWith(
			expect.objectContaining({
				handleClick,
				handleDoubleClick,
				handleKeyDown,
			})
		);
	});

	it('should handle node with undefined disabled property', () => {
		vi.mocked(getTreeNodeElementClasses).mockReturnValue('classes');
		vi.mocked(getTreeItemAriaAttributes).mockReturnValue({
			'aria-expanded': undefined,
			'aria-selected': false,
			'aria-disabled': undefined,
		});
		vi.mocked(getTreeNodeElementAttributes).mockReturnValue({
			ref: createRef<HTMLDivElement>(),
			role: 'treeitem' as const,
			tabIndex: -1,
			'aria-expanded': undefined,
			'aria-selected': false,
			'aria-disabled': undefined,
			id: 'node-button-1',
			onClick: vi.fn(),
			onDoubleClick: vi.fn(),
			onKeyDown: vi.fn(),
		} as any);

		const props = createMockElementProps({
			node: createMockTreeNode({}),
		});

		prepareTreeNodeElementData(props);

		expect(getTreeNodeElementClasses).toHaveBeenCalledWith('md', false, undefined);
		expect(getTreeItemAriaAttributes).toHaveBeenCalledWith(
			expect.objectContaining({
				nodeDisabled: undefined,
			})
		);
	});
});
