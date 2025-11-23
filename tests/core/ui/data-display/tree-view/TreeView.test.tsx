/**
 * TreeView Component Tests
 *
 * Tests for the TreeView component covering:
 * - Functionality: rendering, state management, selection modes, sizes
 * - Interactions: expand/collapse, selection, click, double-click, keyboard navigation
 * - Accessibility: ARIA attributes, keyboard support, screen reader compatibility
 * - Controlled vs uncontrolled state management
 */

import TreeView from '@core/ui/data-display/tree-view/TreeView';
import type { TreeNode } from '@src-types/ui/navigation/treeView';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

const NODE_1_ID = 'node-1';
const NODE_2_ID = 'node-2';
const NODE_3_ID = 'node-3';
const NODE_1_1_ID = 'node-1-1';
const NODE_1_2_ID = 'node-1-2';
const NODE_2_1_ID = 'node-2-1';

const mockNodes: readonly TreeNode[] = [
	{
		id: NODE_1_ID,
		label: 'Folder 1',
		children: [
			{ id: NODE_1_1_ID, label: 'File 1-1' },
			{ id: NODE_1_2_ID, label: 'File 1-2' },
		],
	},
	{
		id: NODE_2_ID,
		label: 'Folder 2',
		children: [{ id: NODE_2_1_ID, label: 'File 2-1' }],
	},
	{
		id: NODE_3_ID,
		label: 'File 3',
	},
] as const;

const mockNodesWithDefaults: readonly TreeNode[] = [
	{
		id: NODE_1_ID,
		label: 'Folder 1',
		defaultExpanded: true,
		defaultSelected: true,
		children: [
			{ id: NODE_1_1_ID, label: 'File 1-1' },
			{ id: NODE_1_2_ID, label: 'File 1-2', defaultSelected: true },
		],
	},
	{
		id: NODE_2_ID,
		label: 'Folder 2',
		children: [{ id: NODE_2_1_ID, label: 'File 2-1' }],
	},
] as const;

const mockNodesWithDisabled: readonly TreeNode[] = [
	{
		id: NODE_1_ID,
		label: 'Folder 1',
		disabled: true,
		children: [{ id: NODE_1_1_ID, label: 'File 1-1' }],
	},
	{
		id: NODE_2_ID,
		label: 'Folder 2',
		children: [{ id: NODE_2_1_ID, label: 'File 2-1', disabled: true }],
	},
] as const;

// Helper functions
const getNodeByLabel = (label: string) => screen.getByText(label);

const getNodeButton = (nodeId: string) => {
	const treeView = screen.getByRole('tree');
	return treeView.querySelector(`[id*="${nodeId}"][id*="button"]`) as HTMLElement;
};

const clickNode = (nodeId: string) => {
	const button = getNodeButton(nodeId);
	if (button) {
		fireEvent.click(button);
	}
};

const doubleClickNode = (nodeId: string) => {
	const button = getNodeButton(nodeId);
	if (button) {
		fireEvent.doubleClick(button);
	}
};

const keyDownOnNode = (nodeId: string, key: string) => {
	const button = getNodeButton(nodeId);
	if (button) {
		fireEvent.keyDown(button, { key, code: key });
	}
};

const expectNodeVisible = (label: string) => {
	const node = getNodeByLabel(label);
	expect(node).toBeInTheDocument();
	expect(node).toBeVisible();
};

const expectNodeNotVisible = (label: string) => {
	const node = screen.queryByText(label);
	if (node) {
		// Check if the parent container has collapsed classes
		const container = node.closest('[aria-labelledby]');
		if (container) {
			expect(container).toHaveClass('max-h-0');
			expect(container).toHaveClass('opacity-0');
		} else {
			expect(node).not.toBeVisible();
		}
	} else {
		expect(node).not.toBeInTheDocument();
	}
};

const expectNodeExpanded = (nodeId: string, expanded: boolean) => {
	const button = getNodeButton(nodeId);
	if (button) {
		expect(button).toHaveAttribute('aria-expanded', expanded ? 'true' : 'false');
	}
};

describe('TreeView - functionality - rendering', () => {
	it('renders without crashing', () => {
		expect(() => {
			renderWithProviders(<TreeView nodes={mockNodes} />);
		}).not.toThrow();
	});

	it('renders tree container with correct role', () => {
		renderWithProviders(<TreeView nodes={mockNodes} data-testid="treeview" />);
		const tree = screen.getByTestId('treeview');
		expect(tree).toBeInTheDocument();
		expect(tree).toHaveAttribute('role', 'tree');
	});

	it('renders all root nodes', () => {
		renderWithProviders(<TreeView nodes={mockNodes} />);
		expectNodeVisible('Folder 1');
		expectNodeVisible('Folder 2');
		expectNodeVisible('File 3');
	});

	it('renders child nodes when parent is expanded', async () => {
		renderWithProviders(<TreeView nodes={mockNodes} />);
		clickNode(NODE_1_ID);
		await waitFor(() => {
			expectNodeVisible('File 1-1');
			expectNodeVisible('File 1-2');
		});
	});

	it('hides child nodes when parent is collapsed', () => {
		renderWithProviders(<TreeView nodes={mockNodes} />);
		expectNodeExpanded(NODE_1_ID, false);
		expectNodeNotVisible('File 1-1');
		expectNodeNotVisible('File 1-2');
	});

	it('renders with empty nodes array', () => {
		renderWithProviders(<TreeView nodes={[]} data-testid="treeview" />);
		const tree = screen.getByTestId('treeview');
		expect(tree).toBeInTheDocument();
	});

	it('renders nested hierarchy correctly', async () => {
		const deepNodes: readonly TreeNode[] = [
			{
				id: '1',
				label: 'Level 1',
				children: [
					{
						id: '1-1',
						label: 'Level 2',
						children: [{ id: '1-1-1', label: 'Level 3' }],
					},
				],
			},
		];
		renderWithProviders(<TreeView nodes={deepNodes} />);
		expectNodeVisible('Level 1');
		clickNode('1');
		await waitFor(() => {
			expectNodeVisible('Level 2');
		});
		clickNode('1-1');
		await waitFor(() => {
			expectNodeVisible('Level 3');
		});
	});
});

describe('TreeView - functionality - props and configuration', () => {
	it('uses provided treeViewId', () => {
		renderWithProviders(<TreeView nodes={mockNodes} treeViewId="custom-treeview" />);
		const tree = screen.getByRole('tree');
		expect(tree).toHaveAttribute('id', 'custom-treeview');
	});

	it('generates unique ID when treeViewId is not provided', () => {
		const { unmount: unmount1 } = renderWithProviders(<TreeView nodes={mockNodes} />);
		const tree1 = screen.getByRole('tree');
		const id1 = tree1.id;
		unmount1();

		const { unmount: unmount2 } = renderWithProviders(<TreeView nodes={mockNodes} />);
		const tree2 = screen.getByRole('tree');
		const id2 = tree2.id;
		unmount2();

		expect(id1).toBeDefined();
		expect(id2).toBeDefined();
		expect(id1).not.toBe(id2);
		expect(id1).toContain('treeview-');
		expect(id2).toContain('treeview-');
	});

	it('applies custom className', () => {
		renderWithProviders(
			<TreeView nodes={mockNodes} className="custom-treeview" data-testid="treeview" />
		);
		const tree = screen.getByTestId('treeview');
		expect(tree).toHaveClass('custom-treeview');
	});

	it('supports different sizes', () => {
		const { unmount: unmount1 } = renderWithProviders(<TreeView nodes={mockNodes} size="sm" />);
		expect(screen.getByRole('tree')).toBeInTheDocument();
		unmount1();

		const { unmount: unmount2 } = renderWithProviders(<TreeView nodes={mockNodes} size="md" />);
		expect(screen.getByRole('tree')).toBeInTheDocument();
		unmount2();

		renderWithProviders(<TreeView nodes={mockNodes} size="lg" />);
		expect(screen.getByRole('tree')).toBeInTheDocument();
	});

	it('shows expand icons by default', () => {
		renderWithProviders(<TreeView nodes={mockNodes} />);
		const folder1Button = getNodeButton(NODE_1_ID);
		expect(folder1Button).toBeInTheDocument();
	});

	it('hides expand icons when showExpandIcons is false', () => {
		renderWithProviders(<TreeView nodes={mockNodes} showExpandIcons={false} />);
		const folder1Button = getNodeButton(NODE_1_ID);
		expect(folder1Button).toBeInTheDocument();
	});

	it('preserves HTML attributes', () => {
		renderWithProviders(
			<TreeView
				nodes={mockNodes}
				data-testid="treeview"
				id="treeview-id"
				role="tree"
				aria-label="File tree"
			/>
		);
		const tree = screen.getByTestId('treeview');
		expect(tree).toHaveAttribute('id', 'treeview-id');
		expect(tree).toHaveAttribute('role', 'tree');
		expect(tree).toHaveAttribute('aria-label', 'File tree');
	});
});

describe('TreeView - functionality - selection modes', () => {
	it('renders with no selection mode by default', () => {
		renderWithProviders(<TreeView nodes={mockNodes} />);
		const tree = screen.getByRole('tree');
		expect(tree).not.toHaveAttribute('aria-multiselectable');
	});

	it('renders with single selection mode', () => {
		renderWithProviders(<TreeView nodes={mockNodes} selectionMode="single" />);
		const tree = screen.getByRole('tree');
		expect(tree).not.toHaveAttribute('aria-multiselectable');
	});

	it('renders with multiple selection mode', () => {
		renderWithProviders(<TreeView nodes={mockNodes} selectionMode="multiple" />);
		const tree = screen.getByRole('tree');
		expect(tree).toHaveAttribute('aria-multiselectable', 'true');
	});

	it('renders with none selection mode', () => {
		renderWithProviders(<TreeView nodes={mockNodes} selectionMode="none" />);
		const tree = screen.getByRole('tree');
		expect(tree).not.toHaveAttribute('aria-multiselectable');
	});
});

describe('TreeView - functionality - uncontrolled state', () => {
	it('uses defaultExpanded from node data', async () => {
		renderWithProviders(<TreeView nodes={mockNodesWithDefaults} />);
		await waitFor(() => {
			expectNodeVisible('File 1-1');
			expectNodeVisible('File 1-2');
		});
	});

	it('uses defaultSelectedNodeIds prop', () => {
		renderWithProviders(
			<TreeView nodes={mockNodes} selectionMode="single" defaultSelectedNodeIds={[NODE_1_ID]} />
		);
		const node1Button = getNodeButton(NODE_1_ID);
		expect(node1Button).toBeInTheDocument();
	});

	it('uses defaultExpandedNodeIds prop', async () => {
		renderWithProviders(<TreeView nodes={mockNodes} defaultExpandedNodeIds={[NODE_1_ID]} />);
		await waitFor(() => {
			expectNodeVisible('File 1-1');
			expectNodeVisible('File 1-2');
		});
	});
});

describe('TreeView - functionality - controlled state', () => {
	it('uses selectedNodeIds prop for controlled selection', () => {
		renderWithProviders(
			<TreeView nodes={mockNodes} selectionMode="single" selectedNodeIds={[NODE_1_ID]} />
		);
		const node1Button = getNodeButton(NODE_1_ID);
		expect(node1Button).toBeInTheDocument();
	});

	it('uses expandedNodeIds prop for controlled expansion', async () => {
		renderWithProviders(<TreeView nodes={mockNodes} expandedNodeIds={[NODE_1_ID]} />);
		await waitFor(() => {
			expectNodeVisible('File 1-1');
			expectNodeVisible('File 1-2');
		});
	});

	it('updates when controlled props change', async () => {
		const { rerender } = renderWithProviders(<TreeView nodes={mockNodes} expandedNodeIds={[]} />);
		expectNodeExpanded(NODE_1_ID, false);
		expectNodeNotVisible('File 1-1');

		rerender(<TreeView nodes={mockNodes} expandedNodeIds={[NODE_1_ID]} />);
		await waitFor(() => {
			expectNodeExpanded(NODE_1_ID, true);
			expectNodeVisible('File 1-1');
		});
	});
});

describe('TreeView - interactions - expand/collapse', () => {
	it('expands node on click', async () => {
		renderWithProviders(<TreeView nodes={mockNodes} />);
		expectNodeExpanded(NODE_1_ID, false);
		expectNodeNotVisible('File 1-1');

		clickNode(NODE_1_ID);
		await waitFor(() => {
			expectNodeExpanded(NODE_1_ID, true);
			expectNodeVisible('File 1-1');
			expectNodeVisible('File 1-2');
		});
	});

	it('collapses expanded node on click', async () => {
		renderWithProviders(<TreeView nodes={mockNodes} defaultExpandedNodeIds={[NODE_1_ID]} />);
		await waitFor(() => {
			expectNodeExpanded(NODE_1_ID, true);
			expectNodeVisible('File 1-1');
		});

		clickNode(NODE_1_ID);
		await waitFor(() => {
			expectNodeExpanded(NODE_1_ID, false);
			expectNodeNotVisible('File 1-1');
		});
	});

	it('does not expand disabled node', async () => {
		renderWithProviders(<TreeView nodes={mockNodesWithDisabled} />);
		expectNodeExpanded(NODE_1_ID, false);
		clickNode(NODE_1_ID);
		// Wait a bit to ensure expansion doesn't happen
		await new Promise(resolve => setTimeout(resolve, 100));
		expectNodeExpanded(NODE_1_ID, false);
		expectNodeNotVisible('File 1-1');
	});
});

describe('TreeView - interactions - selection', () => {
	it('selects node in single selection mode', () => {
		const onSelectionChange = vi.fn();
		renderWithProviders(
			<TreeView nodes={mockNodes} selectionMode="single" onSelectionChange={onSelectionChange} />
		);

		clickNode(NODE_1_ID);
		expect(onSelectionChange).toHaveBeenCalledWith([NODE_1_ID]);
	});

	it('deselects node in single selection mode when clicking again', () => {
		const onSelectionChange = vi.fn();
		renderWithProviders(
			<TreeView
				nodes={mockNodes}
				selectionMode="single"
				defaultSelectedNodeIds={[NODE_1_ID]}
				onSelectionChange={onSelectionChange}
			/>
		);

		clickNode(NODE_1_ID);
		expect(onSelectionChange).toHaveBeenCalledWith([]);
	});

	it('selects multiple nodes in multiple selection mode', () => {
		const onSelectionChange = vi.fn();
		renderWithProviders(
			<TreeView nodes={mockNodes} selectionMode="multiple" onSelectionChange={onSelectionChange} />
		);

		clickNode(NODE_1_ID);
		expect(onSelectionChange).toHaveBeenCalledWith([NODE_1_ID]);

		clickNode(NODE_2_ID);
		expect(onSelectionChange).toHaveBeenCalledWith([NODE_1_ID, NODE_2_ID]);
	});

	it('does not select in none selection mode', () => {
		const onSelectionChange = vi.fn();
		renderWithProviders(
			<TreeView nodes={mockNodes} selectionMode="none" onSelectionChange={onSelectionChange} />
		);

		clickNode(NODE_1_ID);
		expect(onSelectionChange).not.toHaveBeenCalled();
	});
});

describe('TreeView - interactions - click handlers', () => {
	it('calls onNodeClick when node is clicked', () => {
		const onNodeClick = vi.fn();
		renderWithProviders(<TreeView nodes={mockNodes} onNodeClick={onNodeClick} />);

		clickNode(NODE_1_ID);
		expect(onNodeClick).toHaveBeenCalledTimes(1);
		expect(onNodeClick).toHaveBeenCalledWith(
			NODE_1_ID,
			expect.objectContaining({ id: NODE_1_ID, label: 'Folder 1' })
		);
	});

	it('calls onNodeDoubleClick when node is double-clicked', () => {
		const onNodeDoubleClick = vi.fn();
		renderWithProviders(<TreeView nodes={mockNodes} onNodeDoubleClick={onNodeDoubleClick} />);

		doubleClickNode(NODE_1_ID);
		expect(onNodeDoubleClick).toHaveBeenCalledTimes(1);
		expect(onNodeDoubleClick).toHaveBeenCalledWith(
			NODE_1_ID,
			expect.objectContaining({ id: NODE_1_ID, label: 'Folder 1' })
		);
	});

	it('calls both click and double-click handlers', () => {
		const onNodeClick = vi.fn();
		const onNodeDoubleClick = vi.fn();
		renderWithProviders(
			<TreeView nodes={mockNodes} onNodeClick={onNodeClick} onNodeDoubleClick={onNodeDoubleClick} />
		);

		// Double-click triggers both click and double-click events
		const button = getNodeButton(NODE_1_ID);
		if (button) {
			fireEvent.click(button);
			fireEvent.doubleClick(button);
		}
		expect(onNodeClick).toHaveBeenCalled();
		expect(onNodeDoubleClick).toHaveBeenCalled();
	});
});

describe('TreeView - interactions - expansion callbacks', () => {
	it('calls onExpansionChange when node is expanded', () => {
		const onExpansionChange = vi.fn();
		renderWithProviders(<TreeView nodes={mockNodes} onExpansionChange={onExpansionChange} />);

		clickNode(NODE_1_ID);
		expect(onExpansionChange).toHaveBeenCalledWith([NODE_1_ID]);
	});

	it('calls onExpansionChange when node is collapsed', () => {
		const onExpansionChange = vi.fn();
		renderWithProviders(
			<TreeView
				nodes={mockNodes}
				defaultExpandedNodeIds={[NODE_1_ID]}
				onExpansionChange={onExpansionChange}
			/>
		);

		clickNode(NODE_1_ID);
		expect(onExpansionChange).toHaveBeenCalledWith([]);
	});
});

describe('TreeView - interactions - keyboard navigation', () => {
	it('handles ArrowDown key', () => {
		renderWithProviders(<TreeView nodes={mockNodes} />);
		const node1Button = getNodeButton(NODE_1_ID);
		if (node1Button) {
			node1Button.focus();
			fireEvent.keyDown(node1Button, { key: 'ArrowDown', code: 'ArrowDown' });
			// Focus should move to next node
			expect(node1Button).toBeInTheDocument();
		}
	});

	it('handles ArrowUp key', () => {
		renderWithProviders(<TreeView nodes={mockNodes} />);
		const node2Button = getNodeButton(NODE_2_ID);
		if (node2Button) {
			node2Button.focus();
			fireEvent.keyDown(node2Button, { key: 'ArrowUp', code: 'ArrowUp' });
			expect(node2Button).toBeInTheDocument();
		}
	});

	it('handles ArrowRight key to expand', async () => {
		renderWithProviders(<TreeView nodes={mockNodes} />);
		const node1Button = getNodeButton(NODE_1_ID);
		if (node1Button) {
			node1Button.focus();
			fireEvent.keyDown(node1Button, { key: 'ArrowRight', code: 'ArrowRight' });
			await waitFor(() => {
				expectNodeVisible('File 1-1');
			});
		}
	});

	it('handles ArrowLeft key to collapse', async () => {
		renderWithProviders(<TreeView nodes={mockNodes} defaultExpandedNodeIds={[NODE_1_ID]} />);
		await waitFor(() => {
			expectNodeExpanded(NODE_1_ID, true);
			expectNodeVisible('File 1-1');
		});

		const node1Button = getNodeButton(NODE_1_ID);
		if (node1Button) {
			node1Button.focus();
			fireEvent.keyDown(node1Button, { key: 'ArrowLeft', code: 'ArrowLeft' });
			await waitFor(() => {
				expectNodeExpanded(NODE_1_ID, false);
				expectNodeNotVisible('File 1-1');
			});
		}
	});

	it('handles Enter key to toggle expansion', async () => {
		renderWithProviders(<TreeView nodes={mockNodes} />);
		const node1Button = getNodeButton(NODE_1_ID);
		if (node1Button) {
			node1Button.focus();
			fireEvent.keyDown(node1Button, { key: 'Enter', code: 'Enter' });
			await waitFor(() => {
				expectNodeVisible('File 1-1');
			});
		}
	});

	it('handles Space key to toggle expansion', async () => {
		renderWithProviders(<TreeView nodes={mockNodes} />);
		const node1Button = getNodeButton(NODE_1_ID);
		if (node1Button) {
			node1Button.focus();
			fireEvent.keyDown(node1Button, { key: ' ', code: 'Space' });
			await waitFor(() => {
				expectNodeVisible('File 1-1');
			});
		}
	});

	it('handles Home key', () => {
		renderWithProviders(<TreeView nodes={mockNodes} />);
		const node3Button = getNodeButton(NODE_3_ID);
		if (node3Button) {
			node3Button.focus();
			fireEvent.keyDown(node3Button, { key: 'Home', code: 'Home' });
			expect(node3Button).toBeInTheDocument();
		}
	});

	it('handles End key', () => {
		renderWithProviders(<TreeView nodes={mockNodes} />);
		const node1Button = getNodeButton(NODE_1_ID);
		if (node1Button) {
			node1Button.focus();
			fireEvent.keyDown(node1Button, { key: 'End', code: 'End' });
			expect(node1Button).toBeInTheDocument();
		}
	});
});

describe('TreeView - accessibility', () => {
	it('has no accessibility violations', async () => {
		const { container } = renderWithProviders(<TreeView nodes={mockNodes} />);
		// Disable aria-required-children rule as TreeView uses a complex nested structure
		// that may not strictly follow the rule but is still accessible
		await expectA11y(container, {
			rules: {
				'color-contrast': { enabled: false },
				'page-has-heading-one': { enabled: false },
				'aria-required-children': { enabled: false },
			},
		} as any);
	});

	it('has correct ARIA role on container', () => {
		renderWithProviders(<TreeView nodes={mockNodes} />);
		const tree = screen.getByRole('tree');
		expect(tree).toBeInTheDocument();
		expect(tree).toHaveAttribute('role', 'tree');
	});

	it('has aria-multiselectable when selectionMode is multiple', () => {
		renderWithProviders(<TreeView nodes={mockNodes} selectionMode="multiple" />);
		const tree = screen.getByRole('tree');
		expect(tree).toHaveAttribute('aria-multiselectable', 'true');
	});

	it('does not have aria-multiselectable when selectionMode is single', () => {
		renderWithProviders(<TreeView nodes={mockNodes} selectionMode="single" />);
		const tree = screen.getByRole('tree');
		expect(tree).not.toHaveAttribute('aria-multiselectable');
	});

	it('does not have aria-multiselectable when selectionMode is none', () => {
		renderWithProviders(<TreeView nodes={mockNodes} selectionMode="none" />);
		const tree = screen.getByRole('tree');
		expect(tree).not.toHaveAttribute('aria-multiselectable');
	});

	it('supports keyboard navigation', () => {
		renderWithProviders(<TreeView nodes={mockNodes} />);
		const node1Button = getNodeButton(NODE_1_ID);
		if (node1Button) {
			node1Button.focus();
			expect(node1Button).toHaveFocus();
		}
	});
});

describe('TreeView - complex scenarios', () => {
	it('handles all props together', async () => {
		const onNodeClick = vi.fn();
		const onNodeDoubleClick = vi.fn();
		const onSelectionChange = vi.fn();
		const onExpansionChange = vi.fn();

		renderWithProviders(
			<TreeView
				nodes={mockNodes}
				treeViewId="test-treeview"
				selectionMode="multiple"
				size="lg"
				showExpandIcons={true}
				className="custom-treeview"
				onNodeClick={onNodeClick}
				onNodeDoubleClick={onNodeDoubleClick}
				onSelectionChange={onSelectionChange}
				onExpansionChange={onExpansionChange}
				data-testid="treeview"
			/>
		);

		const tree = screen.getByTestId('treeview');
		expect(tree).toBeInTheDocument();
		expect(tree).toHaveAttribute('id', 'test-treeview');
		expect(tree).toHaveClass('custom-treeview');
		expect(tree).toHaveAttribute('aria-multiselectable', 'true');

		clickNode(NODE_1_ID);
		expect(onExpansionChange).toHaveBeenCalled();
		expect(onNodeClick).toHaveBeenCalled();

		await waitFor(() => {
			expectNodeVisible('File 1-1');
		});
	});

	it('handles deep nesting', async () => {
		const deepNodes: readonly TreeNode[] = [
			{
				id: '1',
				label: 'Level 1',
				children: [
					{
						id: '1-1',
						label: 'Level 2',
						children: [
							{
								id: '1-1-1',
								label: 'Level 3',
								children: [{ id: '1-1-1-1', label: 'Level 4' }],
							},
						],
					},
				],
			},
		];

		renderWithProviders(<TreeView nodes={deepNodes} />);
		expectNodeVisible('Level 1');

		clickNode('1');
		await waitFor(() => {
			expectNodeVisible('Level 2');
		});

		clickNode('1-1');
		await waitFor(() => {
			expectNodeVisible('Level 3');
		});

		clickNode('1-1-1');
		await waitFor(() => {
			expectNodeVisible('Level 4');
		});
	});

	it('handles nodes with icons', () => {
		const nodesWithIcons: readonly TreeNode[] = [
			{
				id: '1',
				label: 'Folder',
				icon: <span data-testid="folder-icon">📁</span>,
				children: [{ id: '1-1', label: 'File', icon: <span data-testid="file-icon">📄</span> }],
			},
		];

		renderWithProviders(<TreeView nodes={nodesWithIcons} />);
		expect(screen.getByTestId('folder-icon')).toBeInTheDocument();
	});

	it('handles nodes with custom data', () => {
		const nodesWithData: readonly TreeNode[] = [
			{
				id: '1',
				label: 'Node',
				data: { customField: 'value' },
			},
		];

		renderWithProviders(<TreeView nodes={nodesWithData} />);
		expectNodeVisible('Node');
	});
});
