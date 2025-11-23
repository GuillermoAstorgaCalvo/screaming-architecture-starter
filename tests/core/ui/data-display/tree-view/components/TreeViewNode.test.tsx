/**
 * TreeViewNode Component Tests
 *
 * Tests for the TreeViewNode component covering:
 * - Rendering: basic rendering, node content, children
 * - State management: selected, expanded, focused states
 * - Interactions: click, double click, keyboard events
 * - Props: sizes, selection modes, expand icons
 * - Recursive rendering: nested children
 * - Edge cases: no children, disabled nodes, empty children array
 * - Accessibility: ARIA attributes, focus management
 */

import { TreeViewNode } from '@core/ui/data-display/tree-view/components/TreeViewNode';
import type { StandardSize } from '@src-types/ui/base';
import type { TreeNode, TreeViewSelectionMode } from '@src-types/ui/navigation/treeView';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock child components to isolate TreeViewNode testing
vi.mock('@core/ui/data-display/tree-view/components/TreeViewNodeComponents', () => ({
	TreeNodeElement: ({
		node,
		nodeButtonId,
		nodeContentId,
		hasChildren,
		isFocused,
		nodeIsSelected,
		nodeIsExpanded,
		selectionMode,
		size,
		showExpandIcons,
		handleClick,
		handleDoubleClick,
		handleKeyDown,
	}: {
		node: TreeNode;
		nodeButtonId: string;
		nodeContentId: string;
		hasChildren: boolean;
		isFocused: boolean;
		nodeIsSelected: boolean;
		nodeIsExpanded: boolean;
		selectionMode: TreeViewSelectionMode;
		size: StandardSize;
		showExpandIcons: boolean;
		handleClick: () => void;
		handleDoubleClick: () => void;
		handleKeyDown: React.KeyboardEventHandler<HTMLDivElement>;
	}) => (
		<div
			data-testid={`tree-node-${node.id}`}
			data-node-id={node.id}
			data-button-id={nodeButtonId}
			data-content-id={nodeContentId}
			data-has-children={hasChildren}
			data-is-focused={isFocused}
			data-is-selected={nodeIsSelected}
			data-is-expanded={nodeIsExpanded}
			data-selection-mode={selectionMode}
			data-size={size}
			data-show-expand-icons={showExpandIcons}
			onClick={handleClick}
			onDoubleClick={handleDoubleClick}
			onKeyDown={handleKeyDown}
			tabIndex={isFocused ? 0 : -1}
			role="treeitem"
		>
			{node.label}
		</div>
	),
	ChildNodesContainer: ({
		nodeButtonId,
		nodeIsExpanded,
		children,
	}: {
		nodeButtonId: string;
		nodeIsExpanded: boolean;
		children: React.ReactNode;
	}) => (
		<div
			data-testid={`child-nodes-${nodeButtonId}`}
			data-is-expanded={nodeIsExpanded}
			aria-labelledby={nodeButtonId}
		>
			{children}
		</div>
	),
}));

const TREE_VIEW_ID = 'test-tree-view';
const NODE_1_ID = 'node-1';
const NODE_2_ID = 'node-2';
const NODE_3_ID = 'node-3';

const createMockNode = (
	id: string,
	label: React.ReactNode,
	options?: {
		children?: TreeNode[];
		disabled?: boolean;
		icon?: React.ReactNode;
	}
): TreeNode => {
	const node: TreeNode = {
		id,
		label,
	};
	if (options?.children !== undefined) {
		node.children = options.children;
	}
	if (options?.disabled !== undefined) {
		node.disabled = options.disabled;
	}
	if (options?.icon !== undefined) {
		node.icon = options.icon;
	}
	return node;
};

const createDefaultProps = (
	node: TreeNode,
	overrides?: Partial<TreeViewNodeProps>
): TreeViewNodeProps => ({
	node,
	treeViewId: TREE_VIEW_ID,
	size: 'md',
	selectionMode: 'none',
	isSelected: () => false,
	isExpanded: () => false,
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

type TreeViewNodeProps = Parameters<typeof TreeViewNode>[0];

beforeEach(() => {
	vi.clearAllMocks();
});

describe('TreeViewNode - Rendering', () => {
	it('should render without crashing', () => {
		const node = createMockNode(NODE_1_ID, 'Node 1');
		const props = createDefaultProps(node);
		expect(() => {
			renderWithProviders(<TreeViewNode {...props} />);
		}).not.toThrow();
	});

	it('should render node label', () => {
		const node = createMockNode(NODE_1_ID, 'Node 1');
		const props = createDefaultProps(node);
		renderWithProviders(<TreeViewNode {...props} />);
		expect(screen.getByText('Node 1')).toBeInTheDocument();
	});

	it('should render node with correct ID', () => {
		const node = createMockNode(NODE_1_ID, 'Node 1');
		const props = createDefaultProps(node);
		renderWithProviders(<TreeViewNode {...props} />);
		const nodeElement = screen.getByTestId(`tree-node-${NODE_1_ID}`);
		expect(nodeElement).toHaveAttribute('data-node-id', NODE_1_ID);
	});

	it('should generate correct button and content IDs', () => {
		const node = createMockNode(NODE_1_ID, 'Node 1');
		const props = createDefaultProps(node);
		renderWithProviders(<TreeViewNode {...props} />);
		const nodeElement = screen.getByTestId(`tree-node-${NODE_1_ID}`);
		expect(nodeElement).toHaveAttribute(
			'data-button-id',
			`${TREE_VIEW_ID}-node-${NODE_1_ID}-button`
		);
		expect(nodeElement).toHaveAttribute(
			'data-content-id',
			`${TREE_VIEW_ID}-node-${NODE_1_ID}-content`
		);
	});

	it('should render with wrapper div', () => {
		const node = createMockNode(NODE_1_ID, 'Node 1');
		const props = createDefaultProps(node);
		const { container } = renderWithProviders(<TreeViewNode {...props} />);
		const wrapper = container.querySelector('.w-full');
		expect(wrapper).toBeInTheDocument();
	});
});

describe('TreeViewNode - Node State', () => {
	it('should render as not selected by default', () => {
		const node = createMockNode(NODE_1_ID, 'Node 1');
		const props = createDefaultProps(node);
		renderWithProviders(<TreeViewNode {...props} />);
		const nodeElement = screen.getByTestId(`tree-node-${NODE_1_ID}`);
		expect(nodeElement).toHaveAttribute('data-is-selected', 'false');
	});

	it('should render as selected when isSelected returns true', () => {
		const node = createMockNode(NODE_1_ID, 'Node 1');
		const props = createDefaultProps(node, {
			isSelected: nodeId => nodeId === NODE_1_ID,
		});
		renderWithProviders(<TreeViewNode {...props} />);
		const nodeElement = screen.getByTestId(`tree-node-${NODE_1_ID}`);
		expect(nodeElement).toHaveAttribute('data-is-selected', 'true');
	});

	it('should render as not expanded by default', () => {
		const node = createMockNode(NODE_1_ID, 'Node 1', {
			children: [createMockNode(NODE_2_ID, 'Node 2')],
		});
		const props = createDefaultProps(node);
		renderWithProviders(<TreeViewNode {...props} />);
		const nodeElement = screen.getByTestId(`tree-node-${NODE_1_ID}`);
		expect(nodeElement).toHaveAttribute('data-is-expanded', 'false');
	});

	it('should render as expanded when isExpanded returns true', () => {
		const node = createMockNode(NODE_1_ID, 'Node 1', {
			children: [createMockNode(NODE_2_ID, 'Node 2')],
		});
		const props = createDefaultProps(node, {
			isExpanded: nodeId => nodeId === NODE_1_ID,
		});
		renderWithProviders(<TreeViewNode {...props} />);
		const nodeElement = screen.getByTestId(`tree-node-${NODE_1_ID}`);
		expect(nodeElement).toHaveAttribute('data-is-expanded', 'true');
	});

	it('should render as not focused by default', () => {
		const node = createMockNode(NODE_1_ID, 'Node 1');
		const props = createDefaultProps(node);
		renderWithProviders(<TreeViewNode {...props} />);
		const nodeElement = screen.getByTestId(`tree-node-${NODE_1_ID}`);
		expect(nodeElement).toHaveAttribute('data-is-focused', 'false');
		expect(nodeElement).toHaveAttribute('tabIndex', '-1');
	});

	it('should render as focused when focusedNodeId matches', () => {
		const node = createMockNode(NODE_1_ID, 'Node 1');
		const props = createDefaultProps(node, {
			focusedNodeId: NODE_1_ID,
		});
		renderWithProviders(<TreeViewNode {...props} />);
		const nodeElement = screen.getByTestId(`tree-node-${NODE_1_ID}`);
		expect(nodeElement).toHaveAttribute('data-is-focused', 'true');
		expect(nodeElement).toHaveAttribute('tabIndex', '0');
	});

	it('should focus node element when focusedNodeId changes', async () => {
		const node = createMockNode(NODE_1_ID, 'Node 1');
		const props = createDefaultProps(node, {
			focusedNodeId: null,
		});
		const { rerender } = renderWithProviders(<TreeViewNode {...props} />);
		const nodeElement = screen.getByTestId(`tree-node-${NODE_1_ID}`);

		// Initially not focused
		expect(nodeElement).toHaveAttribute('data-is-focused', 'false');

		// Update to focused
		rerender(<TreeViewNode {...props} focusedNodeId={NODE_1_ID} />);
		await waitFor(() => {
			expect(nodeElement).toHaveAttribute('data-is-focused', 'true');
		});
	});
});

describe('TreeViewNode - Children Rendering', () => {
	it('should not render children container when node has no children', () => {
		const node = createMockNode(NODE_1_ID, 'Node 1');
		const props = createDefaultProps(node);
		renderWithProviders(<TreeViewNode {...props} />);
		expect(screen.queryByTestId(/child-nodes-/)).not.toBeInTheDocument();
	});

	it('should not render children container when children is undefined', () => {
		const node = createMockNode(NODE_1_ID, 'Node 1');
		const props = createDefaultProps(node);
		renderWithProviders(<TreeViewNode {...props} />);
		expect(screen.queryByTestId(/child-nodes-/)).not.toBeInTheDocument();
	});

	it('should not render children container when children is empty array', () => {
		const node = createMockNode(NODE_1_ID, 'Node 1', { children: [] });
		const props = createDefaultProps(node);
		renderWithProviders(<TreeViewNode {...props} />);
		expect(screen.queryByTestId(/child-nodes-/)).not.toBeInTheDocument();
	});

	it('should render children container when node has children', () => {
		const node = createMockNode(NODE_1_ID, 'Node 1', {
			children: [createMockNode(NODE_2_ID, 'Node 2')],
		});
		const props = createDefaultProps(node);
		renderWithProviders(<TreeViewNode {...props} />);
		const buttonId = `${TREE_VIEW_ID}-node-${NODE_1_ID}-button`;
		expect(screen.getByTestId(`child-nodes-${buttonId}`)).toBeInTheDocument();
	});

	it('should render child nodes recursively', () => {
		const node = createMockNode(NODE_1_ID, 'Node 1', {
			children: [createMockNode(NODE_2_ID, 'Node 2')],
		});
		const props = createDefaultProps(node);
		renderWithProviders(<TreeViewNode {...props} />);
		expect(screen.getByText('Node 1')).toBeInTheDocument();
		expect(screen.getByText('Node 2')).toBeInTheDocument();
	});

	it('should render nested children recursively', () => {
		const node = createMockNode(NODE_1_ID, 'Node 1', {
			children: [
				createMockNode(NODE_2_ID, 'Node 2', {
					children: [createMockNode(NODE_3_ID, 'Node 3')],
				}),
			],
		});
		const props = createDefaultProps(node);
		renderWithProviders(<TreeViewNode {...props} />);
		expect(screen.getByText('Node 1')).toBeInTheDocument();
		expect(screen.getByText('Node 2')).toBeInTheDocument();
		expect(screen.getByText('Node 3')).toBeInTheDocument();
	});

	it('should pass shared props to child nodes', () => {
		const onNodeClick = vi.fn();
		const node = createMockNode(NODE_1_ID, 'Node 1', {
			children: [createMockNode(NODE_2_ID, 'Node 2')],
		});
		const props = createDefaultProps(node, { onNodeClick });
		renderWithProviders(<TreeViewNode {...props} />);
		const childNode = screen.getByTestId(`tree-node-${NODE_2_ID}`);
		fireEvent.click(childNode);
		expect(onNodeClick).toHaveBeenCalledWith(NODE_2_ID, expect.objectContaining({ id: NODE_2_ID }));
	});

	it('should render children container with correct expanded state', () => {
		const node = createMockNode(NODE_1_ID, 'Node 1', {
			children: [createMockNode(NODE_2_ID, 'Node 2')],
		});
		const props = createDefaultProps(node, {
			isExpanded: nodeId => nodeId === NODE_1_ID,
		});
		renderWithProviders(<TreeViewNode {...props} />);
		const buttonId = `${TREE_VIEW_ID}-node-${NODE_1_ID}-button`;
		const childrenContainer = screen.getByTestId(`child-nodes-${buttonId}`);
		expect(childrenContainer).toHaveAttribute('data-is-expanded', 'true');
	});

	it('should render children container with correct collapsed state', () => {
		const node = createMockNode(NODE_1_ID, 'Node 1', {
			children: [createMockNode(NODE_2_ID, 'Node 2')],
		});
		const props = createDefaultProps(node, {
			isExpanded: () => false,
		});
		renderWithProviders(<TreeViewNode {...props} />);
		const buttonId = `${TREE_VIEW_ID}-node-${NODE_1_ID}-button`;
		const childrenContainer = screen.getByTestId(`child-nodes-${buttonId}`);
		expect(childrenContainer).toHaveAttribute('data-is-expanded', 'false');
	});
});

describe('TreeViewNode - Event Handlers', () => {
	it('should call onNodeClick when node is clicked', () => {
		const onNodeClick = vi.fn();
		const node = createMockNode(NODE_1_ID, 'Node 1');
		const props = createDefaultProps(node, { onNodeClick });
		renderWithProviders(<TreeViewNode {...props} />);
		const nodeElement = screen.getByTestId(`tree-node-${NODE_1_ID}`);
		fireEvent.click(nodeElement);
		expect(onNodeClick).toHaveBeenCalledTimes(1);
		expect(onNodeClick).toHaveBeenCalledWith(NODE_1_ID, expect.objectContaining({ id: NODE_1_ID }));
	});

	it('should call onNodeDoubleClick when node is double-clicked', () => {
		const onNodeDoubleClick = vi.fn();
		const node = createMockNode(NODE_1_ID, 'Node 1');
		const props = createDefaultProps(node, { onNodeDoubleClick });
		renderWithProviders(<TreeViewNode {...props} />);
		const nodeElement = screen.getByTestId(`tree-node-${NODE_1_ID}`);
		fireEvent.doubleClick(nodeElement);
		expect(onNodeDoubleClick).toHaveBeenCalledTimes(1);
		expect(onNodeDoubleClick).toHaveBeenCalledWith(
			NODE_1_ID,
			expect.objectContaining({ id: NODE_1_ID })
		);
	});

	it('should call onKeyDown when key is pressed', () => {
		const onKeyDown = vi.fn();
		const node = createMockNode(NODE_1_ID, 'Node 1');
		const props = createDefaultProps(node, { onKeyDown });
		renderWithProviders(<TreeViewNode {...props} />);
		const nodeElement = screen.getByTestId(`tree-node-${NODE_1_ID}`);
		const keyboardEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' });
		fireEvent.keyDown(nodeElement, keyboardEvent);
		expect(onKeyDown).toHaveBeenCalledTimes(1);
		expect(onKeyDown).toHaveBeenCalledWith(expect.any(Object), NODE_1_ID);
	});

	it('should call onNodeToggle when node with selection mode is clicked', () => {
		const onNodeToggle = vi.fn();
		const node = createMockNode(NODE_1_ID, 'Node 1');
		const props = createDefaultProps(node, {
			onNodeToggle,
			selectionMode: 'single',
		});
		renderWithProviders(<TreeViewNode {...props} />);
		const nodeElement = screen.getByTestId(`tree-node-${NODE_1_ID}`);
		fireEvent.click(nodeElement);
		expect(onNodeToggle).toHaveBeenCalledWith(NODE_1_ID);
	});

	it('should call onNodeExpand when node with children is clicked and collapsed', () => {
		const onNodeExpand = vi.fn();
		const node = createMockNode(NODE_1_ID, 'Node 1', {
			children: [createMockNode(NODE_2_ID, 'Node 2')],
		});
		const props = createDefaultProps(node, {
			onNodeExpand,
			isExpanded: () => false,
		});
		renderWithProviders(<TreeViewNode {...props} />);
		const nodeElement = screen.getByTestId(`tree-node-${NODE_1_ID}`);
		fireEvent.click(nodeElement);
		expect(onNodeExpand).toHaveBeenCalledWith(NODE_1_ID);
	});

	it('should call onNodeCollapse when node with children is clicked and expanded', () => {
		const onNodeCollapse = vi.fn();
		const node = createMockNode(NODE_1_ID, 'Node 1', {
			children: [createMockNode(NODE_2_ID, 'Node 2')],
		});
		const props = createDefaultProps(node, {
			onNodeCollapse,
			isExpanded: nodeId => nodeId === NODE_1_ID,
		});
		renderWithProviders(<TreeViewNode {...props} />);
		const nodeElement = screen.getByTestId(`tree-node-${NODE_1_ID}`);
		fireEvent.click(nodeElement);
		expect(onNodeCollapse).toHaveBeenCalledWith(NODE_1_ID);
	});

	it('should not call onNodeToggle when selection mode is none', () => {
		const onNodeToggle = vi.fn();
		const node = createMockNode(NODE_1_ID, 'Node 1');
		const props = createDefaultProps(node, {
			onNodeToggle,
			selectionMode: 'none',
		});
		renderWithProviders(<TreeViewNode {...props} />);
		const nodeElement = screen.getByTestId(`tree-node-${NODE_1_ID}`);
		fireEvent.click(nodeElement);
		expect(onNodeToggle).not.toHaveBeenCalled();
	});

	it('should not call expand/collapse handlers when node has no children', () => {
		const onNodeExpand = vi.fn();
		const onNodeCollapse = vi.fn();
		const node = createMockNode(NODE_1_ID, 'Node 1');
		const props = createDefaultProps(node, {
			onNodeExpand,
			onNodeCollapse,
		});
		renderWithProviders(<TreeViewNode {...props} />);
		const nodeElement = screen.getByTestId(`tree-node-${NODE_1_ID}`);
		fireEvent.click(nodeElement);
		expect(onNodeExpand).not.toHaveBeenCalled();
		expect(onNodeCollapse).not.toHaveBeenCalled();
	});
});

describe('TreeViewNode - Props', () => {
	describe('Size', () => {
		it.each(['sm', 'md', 'lg'] as StandardSize[])('should render with %s size', size => {
			const node = createMockNode(NODE_1_ID, 'Node 1');
			const props = createDefaultProps(node, { size });
			renderWithProviders(<TreeViewNode {...props} />);
			const nodeElement = screen.getByTestId(`tree-node-${NODE_1_ID}`);
			expect(nodeElement).toHaveAttribute('data-size', size);
		});
	});

	describe('Selection Mode', () => {
		it.each(['none', 'single', 'multiple'] as TreeViewSelectionMode[])(
			'should render with %s selection mode',
			selectionMode => {
				const node = createMockNode(NODE_1_ID, 'Node 1');
				const props = createDefaultProps(node, { selectionMode });
				renderWithProviders(<TreeViewNode {...props} />);
				const nodeElement = screen.getByTestId(`tree-node-${NODE_1_ID}`);
				expect(nodeElement).toHaveAttribute('data-selection-mode', selectionMode);
			}
		);
	});

	describe('Show Expand Icons', () => {
		it('should pass showExpandIcons=true to TreeNodeElement', () => {
			const node = createMockNode(NODE_1_ID, 'Node 1');
			const props = createDefaultProps(node, { showExpandIcons: true });
			renderWithProviders(<TreeViewNode {...props} />);
			const nodeElement = screen.getByTestId(`tree-node-${NODE_1_ID}`);
			expect(nodeElement).toHaveAttribute('data-show-expand-icons', 'true');
		});

		it('should pass showExpandIcons=false to TreeNodeElement', () => {
			const node = createMockNode(NODE_1_ID, 'Node 1');
			const props = createDefaultProps(node, { showExpandIcons: false });
			renderWithProviders(<TreeViewNode {...props} />);
			const nodeElement = screen.getByTestId(`tree-node-${NODE_1_ID}`);
			expect(nodeElement).toHaveAttribute('data-show-expand-icons', 'false');
		});
	});

	it('should pass treeViewId to child nodes', () => {
		const node = createMockNode(NODE_1_ID, 'Node 1', {
			children: [createMockNode(NODE_2_ID, 'Node 2')],
		});
		const props = createDefaultProps(node, { treeViewId: 'custom-tree-id' });
		renderWithProviders(<TreeViewNode {...props} />);
		const childNode = screen.getByTestId(`tree-node-${NODE_2_ID}`);
		expect(childNode).toHaveAttribute('data-button-id', `custom-tree-id-node-${NODE_2_ID}-button`);
	});
});

describe('TreeViewNode - Edge Cases', () => {
	it('should handle node with disabled property', () => {
		const node = createMockNode(NODE_1_ID, 'Node 1', { disabled: true });
		const props = createDefaultProps(node);
		renderWithProviders(<TreeViewNode {...props} />);
		const nodeElement = screen.getByTestId(`tree-node-${NODE_1_ID}`);
		expect(nodeElement).toBeInTheDocument();
	});

	it('should handle node with icon', () => {
		const node = createMockNode(NODE_1_ID, 'Node 1', { icon: <span>Icon</span> });
		const props = createDefaultProps(node);
		renderWithProviders(<TreeViewNode {...props} />);
		const nodeElement = screen.getByTestId(`tree-node-${NODE_1_ID}`);
		expect(nodeElement).toBeInTheDocument();
	});

	it('should handle multiple children', () => {
		const node = createMockNode(NODE_1_ID, 'Node 1', {
			children: [createMockNode(NODE_2_ID, 'Node 2'), createMockNode(NODE_3_ID, 'Node 3')],
		});
		const props = createDefaultProps(node);
		renderWithProviders(<TreeViewNode {...props} />);
		expect(screen.getByText('Node 1')).toBeInTheDocument();
		expect(screen.getByText('Node 2')).toBeInTheDocument();
		expect(screen.getByText('Node 3')).toBeInTheDocument();
	});

	it('should handle deeply nested children', () => {
		const node = createMockNode('1', 'Level 1', {
			children: [
				createMockNode('1-1', 'Level 2', {
					children: [
						createMockNode('1-1-1', 'Level 3', {
							children: [createMockNode('1-1-1-1', 'Level 4')],
						}),
					],
				}),
			],
		});
		const props = createDefaultProps(node, {
			isExpanded: () => true,
		});
		renderWithProviders(<TreeViewNode {...props} />);
		expect(screen.getByText('Level 1')).toBeInTheDocument();
		expect(screen.getByText('Level 2')).toBeInTheDocument();
		expect(screen.getByText('Level 3')).toBeInTheDocument();
		expect(screen.getByText('Level 4')).toBeInTheDocument();
	});

	it('should handle node with ReactNode label', () => {
		const node = createMockNode(NODE_1_ID, <span data-testid="custom-label">Custom Label</span>);
		const props = createDefaultProps(node);
		renderWithProviders(<TreeViewNode {...props} />);
		expect(screen.getByTestId('custom-label')).toBeInTheDocument();
		expect(screen.getByText('Custom Label')).toBeInTheDocument();
	});
});

describe('TreeViewNode - State Updates', () => {
	it('should update selected state when isSelected changes', () => {
		const node = createMockNode(NODE_1_ID, 'Node 1');
		const props = createDefaultProps(node, {
			isSelected: () => false,
		});
		const { rerender } = renderWithProviders(<TreeViewNode {...props} />);
		let nodeElement = screen.getByTestId(`tree-node-${NODE_1_ID}`);
		expect(nodeElement).toHaveAttribute('data-is-selected', 'false');

		rerender(<TreeViewNode {...props} isSelected={() => true} />);
		nodeElement = screen.getByTestId(`tree-node-${NODE_1_ID}`);
		expect(nodeElement).toHaveAttribute('data-is-selected', 'true');
	});

	it('should update expanded state when isExpanded changes', () => {
		const node = createMockNode(NODE_1_ID, 'Node 1', {
			children: [createMockNode(NODE_2_ID, 'Node 2')],
		});
		const props = createDefaultProps(node, {
			isExpanded: () => false,
		});
		const { rerender } = renderWithProviders(<TreeViewNode {...props} />);
		let nodeElement = screen.getByTestId(`tree-node-${NODE_1_ID}`);
		expect(nodeElement).toHaveAttribute('data-is-expanded', 'false');

		rerender(<TreeViewNode {...props} isExpanded={() => true} />);
		nodeElement = screen.getByTestId(`tree-node-${NODE_1_ID}`);
		expect(nodeElement).toHaveAttribute('data-is-expanded', 'true');
	});

	it('should update focused state when focusedNodeId changes', () => {
		const node = createMockNode(NODE_1_ID, 'Node 1');
		const props = createDefaultProps(node, {
			focusedNodeId: null,
		});
		const { rerender } = renderWithProviders(<TreeViewNode {...props} />);
		let nodeElement = screen.getByTestId(`tree-node-${NODE_1_ID}`);
		expect(nodeElement).toHaveAttribute('data-is-focused', 'false');

		rerender(<TreeViewNode {...props} focusedNodeId={NODE_1_ID} />);
		nodeElement = screen.getByTestId(`tree-node-${NODE_1_ID}`);
		expect(nodeElement).toHaveAttribute('data-is-focused', 'true');
	});
});

describe('TreeViewNode - Accessibility', () => {
	it('should have no accessibility violations', async () => {
		const node = createMockNode(NODE_1_ID, 'Node 1');
		const props = createDefaultProps(node);
		const { container } = renderWithProviders(
			<div role="tree">
				<TreeViewNode {...props} />
			</div>
		);
		await expectA11y(container);
	});

	it('should have role="treeitem" on node element', () => {
		const node = createMockNode(NODE_1_ID, 'Node 1');
		const props = createDefaultProps(node);
		renderWithProviders(<TreeViewNode {...props} />);
		const nodeElement = screen.getByTestId(`tree-node-${NODE_1_ID}`);
		expect(nodeElement).toHaveAttribute('role', 'treeitem');
	});

	it('should have correct tabIndex when focused', () => {
		const node = createMockNode(NODE_1_ID, 'Node 1');
		const props = createDefaultProps(node, {
			focusedNodeId: NODE_1_ID,
		});
		renderWithProviders(<TreeViewNode {...props} />);
		const nodeElement = screen.getByTestId(`tree-node-${NODE_1_ID}`);
		expect(nodeElement).toHaveAttribute('tabIndex', '0');
	});

	it('should have correct tabIndex when not focused', () => {
		const node = createMockNode(NODE_1_ID, 'Node 1');
		const props = createDefaultProps(node, {
			focusedNodeId: null,
		});
		renderWithProviders(<TreeViewNode {...props} />);
		const nodeElement = screen.getByTestId(`tree-node-${NODE_1_ID}`);
		expect(nodeElement).toHaveAttribute('tabIndex', '-1');
	});

	it('should have aria-labelledby on children container', () => {
		const node = createMockNode(NODE_1_ID, 'Node 1', {
			children: [createMockNode(NODE_2_ID, 'Node 2')],
		});
		const props = createDefaultProps(node);
		renderWithProviders(<TreeViewNode {...props} />);
		const buttonId = `${TREE_VIEW_ID}-node-${NODE_1_ID}-button`;
		const childrenContainer = screen.getByTestId(`child-nodes-${buttonId}`);
		expect(childrenContainer).toHaveAttribute('aria-labelledby', buttonId);
	});
});

describe('TreeViewNode - Complex Scenarios', () => {
	it('should handle all props together', () => {
		const onNodeClick = vi.fn();
		const onNodeDoubleClick = vi.fn();
		const onKeyDown = vi.fn();
		const node = createMockNode(NODE_1_ID, 'Node 1', {
			children: [createMockNode(NODE_2_ID, 'Node 2')],
		});
		const props = createDefaultProps(node, {
			size: 'lg',
			selectionMode: 'multiple',
			showExpandIcons: true,
			isSelected: () => true,
			isExpanded: () => true,
			focusedNodeId: NODE_1_ID,
			onNodeClick,
			onNodeDoubleClick,
			onKeyDown,
		});
		renderWithProviders(<TreeViewNode {...props} />);
		const nodeElement = screen.getByTestId(`tree-node-${NODE_1_ID}`);
		expect(nodeElement).toHaveAttribute('data-size', 'lg');
		expect(nodeElement).toHaveAttribute('data-selection-mode', 'multiple');
		expect(nodeElement).toHaveAttribute('data-is-selected', 'true');
		expect(nodeElement).toHaveAttribute('data-is-expanded', 'true');
		expect(nodeElement).toHaveAttribute('data-is-focused', 'true');

		fireEvent.click(nodeElement);
		expect(onNodeClick).toHaveBeenCalled();

		fireEvent.doubleClick(nodeElement);
		expect(onNodeDoubleClick).toHaveBeenCalled();

		fireEvent.keyDown(nodeElement, { key: 'Enter' });
		expect(onKeyDown).toHaveBeenCalled();
	});

	it('should handle node with all optional properties', () => {
		const node: TreeNode = {
			id: NODE_1_ID,
			label: 'Node 1',
			icon: <span>Icon</span>,
			children: [createMockNode(NODE_2_ID, 'Node 2')],
			disabled: false,
			defaultExpanded: true,
			defaultSelected: false,
			data: { custom: 'data' },
		};
		const props = createDefaultProps(node);
		renderWithProviders(<TreeViewNode {...props} />);
		expect(screen.getByText('Node 1')).toBeInTheDocument();
		expect(screen.getByText('Node 2')).toBeInTheDocument();
	});
});
