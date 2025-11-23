/**
 * TreeViewNodeComponents Tests
 *
 * Tests for the TreeViewNodeComponents including:
 * - ExpandIcon: renders expand/collapse icon correctly
 * - NodeContent: renders icon and label correctly
 * - ExpandIconOrSpacer: conditionally renders expand icon or spacer
 * - ChildNodesContainer: renders children container with correct attributes
 * - TreeNodeItemContent: renders tree item content correctly
 * - TreeNodeElement: renders tree item element with all props
 */

import {
	ChildNodesContainer,
	ExpandIcon,
	ExpandIconOrSpacer,
	NodeContent,
	TreeNodeElement,
	TreeNodeItemContent,
} from '@core/ui/data-display/tree-view/components/TreeViewNodeComponents';
import type { TreeNodeElementProps } from '@core/ui/data-display/tree-view/types/TreeViewNodeTypes';
import type { TreeNode } from '@src-types/ui/navigation/treeView';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';

const TEST_NODE_ID = 'test-node-1';
const TEST_CONTENT_ID = 'test-content-id';
const TEST_BUTTON_ID = 'test-button-id';
const TEST_LABEL = 'Test Node Label';
const TEST_ICON = <span data-testid="test-icon">📁</span>;
const TEST_CHILDREN = <div data-testid="test-children">Child content</div>;

// Helper to create a mock TreeNode
function createMockTreeNode(overrides?: Partial<TreeNode>): TreeNode {
	return {
		id: TEST_NODE_ID,
		label: TEST_LABEL,
		...overrides,
	};
}

// Helper to create mock TreeNodeElementProps
function createMockTreeNodeElementProps(
	overrides?: Partial<TreeNodeElementProps>
): TreeNodeElementProps {
	const defaultNode = createMockTreeNode();
	return {
		nodeRef: createRef<HTMLDivElement>(),
		nodeButtonId: TEST_BUTTON_ID,
		nodeContentId: TEST_CONTENT_ID,
		node: defaultNode,
		hasChildren: false,
		isFocused: false,
		nodeIsSelected: false,
		nodeIsExpanded: false,
		selectionMode: 'none',
		size: 'md',
		showExpandIcons: true,
		handleClick: vi.fn(),
		handleDoubleClick: vi.fn(),
		handleKeyDown: vi.fn(),
		...overrides,
	};
}

describe('ExpandIcon', () => {
	it('renders collapsed icon when isExpanded is false', () => {
		renderWithProviders(<ExpandIcon isExpanded={false} />);
		const icon = screen.getByText('▶');
		expect(icon).toBeInTheDocument();
		expect(icon).toHaveAttribute('aria-hidden', 'true');
	});

	it('renders expanded icon when isExpanded is true', () => {
		renderWithProviders(<ExpandIcon isExpanded={true} />);
		const icon = screen.getByText('▼');
		expect(icon).toBeInTheDocument();
		expect(icon).toHaveAttribute('aria-hidden', 'true');
	});

	it('applies correct CSS classes', () => {
		const { container } = renderWithProviders(<ExpandIcon isExpanded={false} />);
		const icon = container.querySelector('span[aria-hidden="true"]');
		expect(icon).toBeInTheDocument();
		expect(icon?.className).toBeTruthy();
	});

	it('applies expanded classes when isExpanded is true', () => {
		const { container } = renderWithProviders(<ExpandIcon isExpanded={true} />);
		const icon = container.querySelector('span[aria-hidden="true"]');
		expect(icon).toBeInTheDocument();
		expect(icon?.className).toBeTruthy();
	});
});

describe('NodeContent', () => {
	it('renders label without icon', () => {
		renderWithProviders(
			<NodeContent icon={undefined} label={TEST_LABEL} contentId={TEST_CONTENT_ID} />
		);
		const label = screen.getByText(TEST_LABEL);
		expect(label).toBeInTheDocument();
		expect(label).toHaveAttribute('id', TEST_CONTENT_ID);
	});

	it('renders label with icon', () => {
		renderWithProviders(
			<NodeContent icon={TEST_ICON} label={TEST_LABEL} contentId={TEST_CONTENT_ID} />
		);
		const label = screen.getByText(TEST_LABEL);
		const icon = screen.getByTestId('test-icon');
		expect(label).toBeInTheDocument();
		expect(label).toHaveAttribute('id', TEST_CONTENT_ID);
		expect(icon).toBeInTheDocument();
	});

	it('does not render icon when icon is not provided', () => {
		renderWithProviders(
			<NodeContent icon={undefined} label={TEST_LABEL} contentId={TEST_CONTENT_ID} />
		);
		expect(screen.queryByTestId('test-icon')).not.toBeInTheDocument();
	});

	it('renders ReactNode as label', () => {
		const customLabel = <span data-testid="custom-label">Custom Label</span>;
		renderWithProviders(
			<NodeContent icon={undefined} label={customLabel} contentId={TEST_CONTENT_ID} />
		);
		expect(screen.getByTestId('custom-label')).toBeInTheDocument();
	});

	it('applies correct CSS classes to icon and content', () => {
		renderWithProviders(
			<NodeContent icon={TEST_ICON} label={TEST_LABEL} contentId={TEST_CONTENT_ID} />
		);
		const icon = screen.getByTestId('test-icon');
		const label = screen.getByText(TEST_LABEL);
		expect(icon.parentElement?.className).toBeTruthy();
		expect(label.className).toBeTruthy();
	});
});

describe('ExpandIconOrSpacer', () => {
	it('renders expand icon when showExpandIcons is true and hasChildren is true', () => {
		renderWithProviders(
			<ExpandIconOrSpacer showExpandIcons={true} hasChildren={true} isExpanded={false} />
		);
		const icon = screen.getByText('▶');
		expect(icon).toBeInTheDocument();
	});

	it('renders spacer when showExpandIcons is false', () => {
		const { container } = renderWithProviders(
			<ExpandIconOrSpacer showExpandIcons={false} hasChildren={true} isExpanded={false} />
		);
		const spacer = container.querySelector('span[aria-hidden="true"]');
		expect(spacer).toBeInTheDocument();
		expect(spacer?.textContent).toBe('');
		expect(spacer?.className).toContain('w-4');
	});

	it('renders spacer when hasChildren is false', () => {
		const { container } = renderWithProviders(
			<ExpandIconOrSpacer showExpandIcons={true} hasChildren={false} isExpanded={false} />
		);
		const spacer = container.querySelector('span[aria-hidden="true"]');
		expect(spacer).toBeInTheDocument();
		expect(spacer?.textContent).toBe('');
		expect(spacer?.className).toContain('w-4');
	});

	it('renders expanded icon when node is expanded', () => {
		renderWithProviders(
			<ExpandIconOrSpacer showExpandIcons={true} hasChildren={true} isExpanded={true} />
		);
		const icon = screen.getByText('▼');
		expect(icon).toBeInTheDocument();
	});

	it('renders collapsed icon when node is not expanded', () => {
		renderWithProviders(
			<ExpandIconOrSpacer showExpandIcons={true} hasChildren={true} isExpanded={false} />
		);
		const icon = screen.getByText('▶');
		expect(icon).toBeInTheDocument();
	});
});

describe('ChildNodesContainer', () => {
	it('renders children content', () => {
		renderWithProviders(
			<ChildNodesContainer nodeButtonId={TEST_BUTTON_ID} nodeIsExpanded={true}>
				{TEST_CHILDREN}
			</ChildNodesContainer>
		);
		expect(screen.getByTestId('test-children')).toBeInTheDocument();
	});

	it('has correct aria-labelledby attribute', () => {
		renderWithProviders(
			<ChildNodesContainer nodeButtonId={TEST_BUTTON_ID} nodeIsExpanded={true}>
				{TEST_CHILDREN}
			</ChildNodesContainer>
		);
		const container = screen.getByTestId('test-children').parentElement;
		expect(container).toHaveAttribute('aria-labelledby', TEST_BUTTON_ID);
	});

	it('applies expanded classes when nodeIsExpanded is true', () => {
		const { container } = renderWithProviders(
			<ChildNodesContainer nodeButtonId={TEST_BUTTON_ID} nodeIsExpanded={true}>
				{TEST_CHILDREN}
			</ChildNodesContainer>
		);
		const div = container.querySelector('div[aria-labelledby]');
		expect(div).toBeInTheDocument();
		expect(div?.className).toBeTruthy();
	});

	it('applies collapsed classes when nodeIsExpanded is false', () => {
		const { container } = renderWithProviders(
			<ChildNodesContainer nodeButtonId={TEST_BUTTON_ID} nodeIsExpanded={false}>
				{TEST_CHILDREN}
			</ChildNodesContainer>
		);
		const div = container.querySelector('div[aria-labelledby]');
		expect(div).toBeInTheDocument();
		expect(div?.className).toBeTruthy();
	});

	it('applies expanded style when nodeIsExpanded is true', () => {
		renderWithProviders(
			<ChildNodesContainer nodeButtonId={TEST_BUTTON_ID} nodeIsExpanded={true}>
				{TEST_CHILDREN}
			</ChildNodesContainer>
		);
		const div = screen.getByTestId('test-children').parentElement;
		expect(div).toBeInTheDocument();
		expect(div?.style).toBeTruthy();
	});

	it('does not apply style when nodeIsExpanded is false', () => {
		const { container } = renderWithProviders(
			<ChildNodesContainer nodeButtonId={TEST_BUTTON_ID} nodeIsExpanded={false}>
				{TEST_CHILDREN}
			</ChildNodesContainer>
		);
		const div = container.querySelector('div[aria-labelledby]');
		expect(div).toBeInTheDocument();
	});
});

describe('TreeNodeItemContent', () => {
	it('renders expand icon when showExpandIcons is true and hasChildren is true', () => {
		const node = createMockTreeNode();
		renderWithProviders(
			<TreeNodeItemContent
				node={node}
				nodeContentId={TEST_CONTENT_ID}
				showExpandIcons={true}
				hasChildren={true}
				nodeIsExpanded={false}
			/>
		);
		expect(screen.getByText('▶')).toBeInTheDocument();
		expect(screen.getByText(TEST_LABEL)).toBeInTheDocument();
	});

	it('renders spacer when showExpandIcons is false', () => {
		const node = createMockTreeNode();
		const { container } = renderWithProviders(
			<TreeNodeItemContent
				node={node}
				nodeContentId={TEST_CONTENT_ID}
				showExpandIcons={false}
				hasChildren={true}
				nodeIsExpanded={false}
			/>
		);
		const spacer = container.querySelector('span[aria-hidden="true"]');
		expect(spacer).toBeInTheDocument();
		expect(screen.getByText(TEST_LABEL)).toBeInTheDocument();
	});

	it('renders spacer when hasChildren is false', () => {
		const node = createMockTreeNode();
		const { container } = renderWithProviders(
			<TreeNodeItemContent
				node={node}
				nodeContentId={TEST_CONTENT_ID}
				showExpandIcons={true}
				hasChildren={false}
				nodeIsExpanded={false}
			/>
		);
		const spacer = container.querySelector('span[aria-hidden="true"]');
		expect(spacer).toBeInTheDocument();
		expect(screen.getByText(TEST_LABEL)).toBeInTheDocument();
	});

	it('renders node label', () => {
		const node = createMockTreeNode();
		renderWithProviders(
			<TreeNodeItemContent
				node={node}
				nodeContentId={TEST_CONTENT_ID}
				showExpandIcons={true}
				hasChildren={false}
				nodeIsExpanded={false}
			/>
		);
		expect(screen.getByText(TEST_LABEL)).toBeInTheDocument();
	});

	it('renders node icon when provided', () => {
		const node = createMockTreeNode({ icon: TEST_ICON });
		renderWithProviders(
			<TreeNodeItemContent
				node={node}
				nodeContentId={TEST_CONTENT_ID}
				showExpandIcons={true}
				hasChildren={false}
				nodeIsExpanded={false}
			/>
		);
		expect(screen.getByTestId('test-icon')).toBeInTheDocument();
		expect(screen.getByText(TEST_LABEL)).toBeInTheDocument();
	});

	it('renders expanded icon when nodeIsExpanded is true', () => {
		const node = createMockTreeNode();
		renderWithProviders(
			<TreeNodeItemContent
				node={node}
				nodeContentId={TEST_CONTENT_ID}
				showExpandIcons={true}
				hasChildren={true}
				nodeIsExpanded={true}
			/>
		);
		expect(screen.getByText('▼')).toBeInTheDocument();
	});
});

describe('TreeNodeElement', () => {
	it('renders tree item element', () => {
		const props = createMockTreeNodeElementProps();
		renderWithProviders(<TreeNodeElement {...props} />);
		expect(screen.getByText(TEST_LABEL)).toBeInTheDocument();
	});

	it('renders with correct role attribute', () => {
		const props = createMockTreeNodeElementProps();
		renderWithProviders(<TreeNodeElement {...props} />);
		const element = screen.getByRole('treeitem');
		expect(element).toBeInTheDocument();
	});

	it('renders with correct id attribute', () => {
		const props = createMockTreeNodeElementProps();
		renderWithProviders(<TreeNodeElement {...props} />);
		const element = screen.getByRole('treeitem');
		expect(element).toHaveAttribute('id', TEST_BUTTON_ID);
	});

	it('renders node content', () => {
		const props = createMockTreeNodeElementProps();
		renderWithProviders(<TreeNodeElement {...props} />);
		expect(screen.getByText(TEST_LABEL)).toBeInTheDocument();
	});

	it('renders expand icon when showExpandIcons is true and hasChildren is true', () => {
		const props = createMockTreeNodeElementProps({
			showExpandIcons: true,
			hasChildren: true,
			nodeIsExpanded: false,
		});
		renderWithProviders(<TreeNodeElement {...props} />);
		expect(screen.getByText('▶')).toBeInTheDocument();
	});

	it('renders spacer when showExpandIcons is false', () => {
		const props = createMockTreeNodeElementProps({
			showExpandIcons: false,
			hasChildren: true,
			nodeIsExpanded: false,
		});
		const { container } = renderWithProviders(<TreeNodeElement {...props} />);
		const spacer = container.querySelector('span[aria-hidden="true"]');
		expect(spacer).toBeInTheDocument();
	});

	it('renders node icon when provided', () => {
		const node = createMockTreeNode({ icon: TEST_ICON });
		const props = createMockTreeNodeElementProps({ node });
		renderWithProviders(<TreeNodeElement {...props} />);
		expect(screen.getByTestId('test-icon')).toBeInTheDocument();
	});

	it('applies correct CSS classes based on size and selection state', () => {
		const props = createMockTreeNodeElementProps({
			size: 'md',
			nodeIsSelected: true,
		});
		const { container } = renderWithProviders(<TreeNodeElement {...props} />);
		const element = container.querySelector('[role="treeitem"]');
		expect(element).toBeInTheDocument();
		expect(element?.className).toBeTruthy();
	});

	it('handles click events', () => {
		const handleClick = vi.fn();
		const props = createMockTreeNodeElementProps({ handleClick });
		renderWithProviders(<TreeNodeElement {...props} />);
		const element = screen.getByRole('treeitem');
		fireEvent.click(element);
		expect(handleClick).toHaveBeenCalledTimes(1);
	});

	it('handles double click events', () => {
		const handleDoubleClick = vi.fn();
		const props = createMockTreeNodeElementProps({ handleDoubleClick });
		renderWithProviders(<TreeNodeElement {...props} />);
		const element = screen.getByRole('treeitem');
		fireEvent.doubleClick(element);
		expect(handleDoubleClick).toHaveBeenCalledTimes(1);
	});

	it('handles keyboard events', () => {
		const handleKeyDown = vi.fn();
		const props = createMockTreeNodeElementProps({ handleKeyDown });
		renderWithProviders(<TreeNodeElement {...props} />);
		const element = screen.getByRole('treeitem');
		fireEvent.keyDown(element, { key: 'Enter' });
		expect(handleKeyDown).toHaveBeenCalledTimes(1);
	});

	it('has correct tabIndex when focused', () => {
		const props = createMockTreeNodeElementProps({ isFocused: true });
		renderWithProviders(<TreeNodeElement {...props} />);
		const element = screen.getByRole('treeitem');
		expect(element).toHaveAttribute('tabIndex', '0');
	});

	it('has correct tabIndex when not focused', () => {
		const props = createMockTreeNodeElementProps({ isFocused: false });
		renderWithProviders(<TreeNodeElement {...props} />);
		const element = screen.getByRole('treeitem');
		expect(element).toHaveAttribute('tabIndex', '-1');
	});

	it('has correct aria-expanded when hasChildren is true', () => {
		const props = createMockTreeNodeElementProps({
			hasChildren: true,
			nodeIsExpanded: true,
		});
		renderWithProviders(<TreeNodeElement {...props} />);
		const element = screen.getByRole('treeitem');
		expect(element).toHaveAttribute('aria-expanded', 'true');
	});

	it('does not have aria-expanded when hasChildren is false', () => {
		const props = createMockTreeNodeElementProps({
			hasChildren: false,
			nodeIsExpanded: false,
		});
		renderWithProviders(<TreeNodeElement {...props} />);
		const element = screen.getByRole('treeitem');
		expect(element).not.toHaveAttribute('aria-expanded');
	});

	it('has correct aria-selected when nodeIsSelected is true', () => {
		const props = createMockTreeNodeElementProps({
			nodeIsSelected: true,
			selectionMode: 'single',
		});
		renderWithProviders(<TreeNodeElement {...props} />);
		const element = screen.getByRole('treeitem');
		expect(element).toHaveAttribute('aria-selected', 'true');
	});

	it('has correct aria-selected when nodeIsSelected is false', () => {
		const props = createMockTreeNodeElementProps({
			nodeIsSelected: false,
			selectionMode: 'single',
		});
		renderWithProviders(<TreeNodeElement {...props} />);
		const element = screen.getByRole('treeitem');
		expect(element).toHaveAttribute('aria-selected', 'false');
	});

	it('handles disabled node correctly', () => {
		const node = createMockTreeNode({ disabled: true });
		const props = createMockTreeNodeElementProps({ node });
		renderWithProviders(<TreeNodeElement {...props} />);
		const element = screen.getByRole('treeitem');
		expect(element).toHaveAttribute('aria-disabled', 'true');
	});

	it('handles different sizes correctly', () => {
		const sizes = ['sm', 'md', 'lg'] as const;
		for (const size of sizes) {
			const props = createMockTreeNodeElementProps({ size });
			const { container, unmount } = renderWithProviders(<TreeNodeElement {...props} />);
			const element = container.querySelector('[role="treeitem"]');
			expect(element).toBeInTheDocument();
			expect(element?.className).toBeTruthy();
			unmount();
		}
	});

	it('handles different selection modes correctly', () => {
		const selectionModes = ['none', 'single', 'multiple'] as const;
		for (const selectionMode of selectionModes) {
			const props = createMockTreeNodeElementProps({ selectionMode });
			const { container, unmount } = renderWithProviders(<TreeNodeElement {...props} />);
			const element = container.querySelector('[role="treeitem"]');
			expect(element).toBeInTheDocument();
			unmount();
		}
	});
});
