/**
 * Tests for TreeView helper functions
 *
 * Tests helper functions:
 * - getTreeViewClasses
 * - getTreeNodeClasses
 * - getTreeNodeContentClasses
 * - getTreeNodeIconClasses
 * - getTreeExpandIconClasses
 * - getTreeChildrenClasses
 * - getTreeChildrenStyle
 * - getTreeNodeIds
 */

import {
	TREE_VIEW_BASE_CLASSES,
	TREE_VIEW_CHILDREN_COLLAPSED_CLASSES,
	TREE_VIEW_CHILDREN_CONTAINER_CLASSES,
	TREE_VIEW_CHILDREN_EXPANDED_CLASSES,
	TREE_VIEW_CHILDREN_EXPANDED_STYLE,
	TREE_VIEW_EXPAND_ICON_CLASSES,
	TREE_VIEW_EXPAND_ICON_EXPANDED_CLASSES,
	TREE_VIEW_NODE_BASE_CLASSES,
	TREE_VIEW_NODE_CONTENT_CLASSES,
	TREE_VIEW_NODE_HOVER_CLASSES,
	TREE_VIEW_NODE_ICON_CLASSES,
	TREE_VIEW_NODE_SELECTED_CLASSES,
	TREE_VIEW_NODE_SIZE_CLASSES,
} from '@core/constants/ui/navigation';
import {
	getTreeChildrenClasses,
	getTreeChildrenStyle,
	getTreeExpandIconClasses,
	getTreeNodeClasses,
	getTreeNodeContentClasses,
	getTreeNodeIconClasses,
	getTreeNodeIds,
	getTreeViewClasses,
} from '@core/ui/data-display/tree-view/helpers/TreeViewHelpers';
import type { StandardSize } from '@src-types/ui/base';
import { describe, expect, it } from 'vitest';

describe('TreeViewHelpers - getTreeViewClasses', () => {
	it('should return base classes when no className provided', () => {
		const result = getTreeViewClasses();
		expect(result).toContain(TREE_VIEW_BASE_CLASSES);
	});

	it('should merge base classes with custom className', () => {
		const customClass = 'custom-class';
		const result = getTreeViewClasses(customClass);
		expect(result).toContain(TREE_VIEW_BASE_CLASSES);
		expect(result).toContain(customClass);
	});

	it('should handle empty string className', () => {
		const result = getTreeViewClasses('');
		expect(result).toContain(TREE_VIEW_BASE_CLASSES);
	});

	it('should handle multiple custom classes', () => {
		const customClasses = 'custom-class-1 custom-class-2';
		const result = getTreeViewClasses(customClasses);
		expect(result).toContain(TREE_VIEW_BASE_CLASSES);
		expect(result).toContain('custom-class-1');
		expect(result).toContain('custom-class-2');
	});
});

describe('TreeViewHelpers - getTreeNodeClasses', () => {
	const sizes: StandardSize[] = ['sm', 'md', 'lg'];

	it('should return base classes with size classes for all sizes', () => {
		for (const size of sizes) {
			const result = getTreeNodeClasses(size, false);
			expect(result).toContain(TREE_VIEW_NODE_BASE_CLASSES);
			expect(result).toContain(TREE_VIEW_NODE_SIZE_CLASSES[size]);
			expect(result).toContain(TREE_VIEW_NODE_HOVER_CLASSES);
		}
	});

	it('should include selected classes when isSelected is true', () => {
		const result = getTreeNodeClasses('md', true);
		expect(result).toContain(TREE_VIEW_NODE_BASE_CLASSES);
		expect(result).toContain(TREE_VIEW_NODE_SELECTED_CLASSES);
		expect(result).toContain(TREE_VIEW_NODE_HOVER_CLASSES);
	});

	it('should not include selected classes when isSelected is false', () => {
		const result = getTreeNodeClasses('md', false);
		expect(result).toContain(TREE_VIEW_NODE_BASE_CLASSES);
		expect(result).not.toContain(TREE_VIEW_NODE_SELECTED_CLASSES);
		expect(result).toContain(TREE_VIEW_NODE_HOVER_CLASSES);
	});

	it('should merge custom className when provided', () => {
		const customClass = 'custom-node-class';
		const result = getTreeNodeClasses('md', false, customClass);
		expect(result).toContain(TREE_VIEW_NODE_BASE_CLASSES);
		expect(result).toContain(customClass);
	});

	it('should return different classes for different sizes', () => {
		const smResult = getTreeNodeClasses('sm', false);
		const mdResult = getTreeNodeClasses('md', false);
		const lgResult = getTreeNodeClasses('lg', false);

		expect(smResult).not.toBe(mdResult);
		expect(smResult).not.toBe(lgResult);
		expect(mdResult).not.toBe(lgResult);
	});

	it('should handle selected state with custom className', () => {
		const customClass = 'custom-class';
		const result = getTreeNodeClasses('md', true, customClass);
		expect(result).toContain(TREE_VIEW_NODE_BASE_CLASSES);
		expect(result).toContain(TREE_VIEW_NODE_SELECTED_CLASSES);
		expect(result).toContain(customClass);
	});
});

describe('TreeViewHelpers - getTreeNodeContentClasses', () => {
	it('should return base content classes when no className provided', () => {
		const result = getTreeNodeContentClasses();
		expect(result).toContain(TREE_VIEW_NODE_CONTENT_CLASSES);
	});

	it('should merge base classes with custom className', () => {
		const customClass = 'custom-content-class';
		const result = getTreeNodeContentClasses(customClass);
		expect(result).toContain(TREE_VIEW_NODE_CONTENT_CLASSES);
		expect(result).toContain(customClass);
	});

	it('should handle empty string className', () => {
		const result = getTreeNodeContentClasses('');
		expect(result).toContain(TREE_VIEW_NODE_CONTENT_CLASSES);
	});

	it('should handle multiple custom classes', () => {
		const customClasses = 'custom-class-1 custom-class-2';
		const result = getTreeNodeContentClasses(customClasses);
		expect(result).toContain(TREE_VIEW_NODE_CONTENT_CLASSES);
		expect(result).toContain('custom-class-1');
		expect(result).toContain('custom-class-2');
	});
});

describe('TreeViewHelpers - getTreeNodeIconClasses', () => {
	it('should return base icon classes when no className provided', () => {
		const result = getTreeNodeIconClasses();
		expect(result).toContain(TREE_VIEW_NODE_ICON_CLASSES);
	});

	it('should merge base classes with custom className', () => {
		const customClass = 'custom-icon-class';
		const result = getTreeNodeIconClasses(customClass);
		expect(result).toContain(TREE_VIEW_NODE_ICON_CLASSES);
		expect(result).toContain(customClass);
	});

	it('should handle empty string className', () => {
		const result = getTreeNodeIconClasses('');
		expect(result).toContain(TREE_VIEW_NODE_ICON_CLASSES);
	});

	it('should handle multiple custom classes', () => {
		const customClasses = 'custom-class-1 custom-class-2';
		const result = getTreeNodeIconClasses(customClasses);
		expect(result).toContain(TREE_VIEW_NODE_ICON_CLASSES);
		expect(result).toContain('custom-class-1');
		expect(result).toContain('custom-class-2');
	});
});

describe('TreeViewHelpers - getTreeExpandIconClasses', () => {
	it('should return base expand icon classes when not expanded', () => {
		const result = getTreeExpandIconClasses(false);
		expect(result).toContain(TREE_VIEW_EXPAND_ICON_CLASSES);
		expect(result).not.toContain(TREE_VIEW_EXPAND_ICON_EXPANDED_CLASSES);
	});

	it('should include expanded classes when isExpanded is true', () => {
		const result = getTreeExpandIconClasses(true);
		expect(result).toContain(TREE_VIEW_EXPAND_ICON_CLASSES);
		expect(result).toContain(TREE_VIEW_EXPAND_ICON_EXPANDED_CLASSES);
	});

	it('should merge custom className when provided', () => {
		const customClass = 'custom-expand-icon-class';
		const result = getTreeExpandIconClasses(false, customClass);
		expect(result).toContain(TREE_VIEW_EXPAND_ICON_CLASSES);
		expect(result).toContain(customClass);
	});

	it('should handle expanded state with custom className', () => {
		const customClass = 'custom-class';
		const result = getTreeExpandIconClasses(true, customClass);
		expect(result).toContain(TREE_VIEW_EXPAND_ICON_CLASSES);
		expect(result).toContain(TREE_VIEW_EXPAND_ICON_EXPANDED_CLASSES);
		expect(result).toContain(customClass);
	});

	it('should return different classes for expanded and collapsed states', () => {
		const expandedResult = getTreeExpandIconClasses(true);
		const collapsedResult = getTreeExpandIconClasses(false);

		expect(expandedResult).not.toBe(collapsedResult);
		expect(expandedResult).toContain(TREE_VIEW_EXPAND_ICON_EXPANDED_CLASSES);
		expect(collapsedResult).not.toContain(TREE_VIEW_EXPAND_ICON_EXPANDED_CLASSES);
	});
});

describe('TreeViewHelpers - getTreeChildrenClasses', () => {
	it('should return container and collapsed classes when not expanded', () => {
		const result = getTreeChildrenClasses(false);
		expect(result).toContain(TREE_VIEW_CHILDREN_CONTAINER_CLASSES);
		expect(result).toContain(TREE_VIEW_CHILDREN_COLLAPSED_CLASSES);
		expect(result).not.toContain(TREE_VIEW_CHILDREN_EXPANDED_CLASSES);
	});

	it('should return container and expanded classes when expanded', () => {
		const result = getTreeChildrenClasses(true);
		expect(result).toContain(TREE_VIEW_CHILDREN_CONTAINER_CLASSES);
		expect(result).toContain(TREE_VIEW_CHILDREN_EXPANDED_CLASSES);
		expect(result).not.toContain(TREE_VIEW_CHILDREN_COLLAPSED_CLASSES);
	});

	it('should merge custom className when provided', () => {
		const customClass = 'custom-children-class';
		const result = getTreeChildrenClasses(false, customClass);
		expect(result).toContain(TREE_VIEW_CHILDREN_CONTAINER_CLASSES);
		expect(result).toContain(customClass);
	});

	it('should handle expanded state with custom className', () => {
		const customClass = 'custom-class';
		const result = getTreeChildrenClasses(true, customClass);
		expect(result).toContain(TREE_VIEW_CHILDREN_CONTAINER_CLASSES);
		expect(result).toContain(TREE_VIEW_CHILDREN_EXPANDED_CLASSES);
		expect(result).toContain(customClass);
	});

	it('should return different classes for expanded and collapsed states', () => {
		const expandedResult = getTreeChildrenClasses(true);
		const collapsedResult = getTreeChildrenClasses(false);

		expect(expandedResult).not.toBe(collapsedResult);
		expect(expandedResult).toContain(TREE_VIEW_CHILDREN_EXPANDED_CLASSES);
		expect(collapsedResult).toContain(TREE_VIEW_CHILDREN_COLLAPSED_CLASSES);
	});
});

describe('TreeViewHelpers - getTreeChildrenStyle', () => {
	it('should return undefined when not expanded', () => {
		const result = getTreeChildrenStyle(false);
		expect(result).toBeUndefined();
	});

	it('should return expanded style when expanded', () => {
		const result = getTreeChildrenStyle(true);
		expect(result).toBeDefined();
		expect(result).toEqual(TREE_VIEW_CHILDREN_EXPANDED_STYLE);
	});

	it('should return correct style object with maxHeight property', () => {
		const result = getTreeChildrenStyle(true);
		expect(result).toHaveProperty('maxHeight');
		expect(result?.maxHeight).toBe('var(--animation-max-height-tree-view, 10000px)');
	});

	it('should handle state transitions correctly', () => {
		const expandedResult = getTreeChildrenStyle(true);
		const collapsedResult = getTreeChildrenStyle(false);

		expect(expandedResult).toBeDefined();
		expect(collapsedResult).toBeUndefined();
	});
});

describe('TreeViewHelpers - getTreeNodeIds', () => {
	it('should generate correct IDs for node button and content', () => {
		const treeViewId = 'tree-view-1';
		const nodeId = 'node-1';
		const result = getTreeNodeIds(treeViewId, nodeId);

		expect(result.nodeButtonId).toBe('tree-view-1-node-node-1-button');
		expect(result.nodeContentId).toBe('tree-view-1-node-node-1-content');
	});

	it('should generate unique IDs for different tree views', () => {
		const result1 = getTreeNodeIds('tree-view-1', 'node-1');
		const result2 = getTreeNodeIds('tree-view-2', 'node-1');

		expect(result1.nodeButtonId).not.toBe(result2.nodeButtonId);
		expect(result1.nodeContentId).not.toBe(result2.nodeContentId);
	});

	it('should generate unique IDs for different nodes in same tree', () => {
		const result1 = getTreeNodeIds('tree-view-1', 'node-1');
		const result2 = getTreeNodeIds('tree-view-1', 'node-2');

		expect(result1.nodeButtonId).not.toBe(result2.nodeButtonId);
		expect(result1.nodeContentId).not.toBe(result2.nodeContentId);
	});

	it('should handle complex IDs with special characters', () => {
		const treeViewId = 'tree-view_123';
		const nodeId = 'node-abc_xyz';
		const result = getTreeNodeIds(treeViewId, nodeId);

		expect(result.nodeButtonId).toBe('tree-view_123-node-node-abc_xyz-button');
		expect(result.nodeContentId).toBe('tree-view_123-node-node-abc_xyz-content');
	});

	it('should handle numeric IDs', () => {
		const treeViewId = '123';
		const nodeId = '456';
		const result = getTreeNodeIds(treeViewId, nodeId);

		expect(result.nodeButtonId).toBe('123-node-456-button');
		expect(result.nodeContentId).toBe('123-node-456-content');
	});

	it('should handle empty string IDs', () => {
		const treeViewId = '';
		const nodeId = '';
		const result = getTreeNodeIds(treeViewId, nodeId);

		expect(result.nodeButtonId).toBe('-node--button');
		expect(result.nodeContentId).toBe('-node--content');
	});

	it('should return object with correct structure', () => {
		const result = getTreeNodeIds('tree-view-1', 'node-1');

		expect(result).toHaveProperty('nodeButtonId');
		expect(result).toHaveProperty('nodeContentId');
		expect(typeof result.nodeButtonId).toBe('string');
		expect(typeof result.nodeContentId).toBe('string');
	});

	it('should generate IDs that follow the expected pattern', () => {
		const treeViewId = 'my-tree';
		const nodeId = 'my-node';
		const result = getTreeNodeIds(treeViewId, nodeId);

		expect(result.nodeButtonId).toMatch(/^my-tree-node-my-node-button$/);
		expect(result.nodeContentId).toMatch(/^my-tree-node-my-node-content$/);
	});
});
