import type {
	GetTreeItemAriaAttributesParams,
	GetTreeNodeElementAttributesParams,
	TreeItemAriaAttributes,
	TreeNodeElementAttributes,
} from '@core/ui/data-display/tree-view/types/TreeViewNodeTypes';

// ============================================================================
// ARIA Attributes
// ============================================================================

/**
 * Gets ARIA attributes for tree item
 */
export function getTreeItemAriaAttributes(
	params: Readonly<GetTreeItemAriaAttributesParams>
): TreeItemAriaAttributes {
	const { hasChildren, nodeIsExpanded, selectionMode, nodeIsSelected, nodeDisabled } = params;

	return {
		'aria-expanded': hasChildren ? nodeIsExpanded : undefined,
		'aria-selected': selectionMode === 'none' ? false : nodeIsSelected,
		'aria-disabled': nodeDisabled ?? undefined,
	};
}

// ============================================================================
// HTML Element Attributes
// ============================================================================

/**
 * Gets HTML attributes for tree item element
 */
export function getTreeNodeElementAttributes(
	params: Readonly<GetTreeNodeElementAttributesParams>
): TreeNodeElementAttributes {
	const {
		nodeRef,
		nodeButtonId,
		isFocused,
		ariaAttrs,
		handleClick,
		handleDoubleClick,
		handleKeyDown,
	} = params;

	return {
		ref: nodeRef,
		role: 'treeitem' as const,
		tabIndex: isFocused ? 0 : -1,
		'aria-expanded': ariaAttrs['aria-expanded'],
		'aria-selected': ariaAttrs['aria-selected'],
		'aria-disabled': ariaAttrs['aria-disabled'],
		id: nodeButtonId,
		onClick: handleClick,
		onDoubleClick: handleDoubleClick,
		onKeyDown: handleKeyDown,
	};
}
