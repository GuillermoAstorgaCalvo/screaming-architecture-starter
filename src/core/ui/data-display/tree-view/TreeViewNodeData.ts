import { getTreeItemAriaAttributes, getTreeNodeElementAttributes } from './TreeViewNodeAttributes';
import { getTreeNodeElementClasses } from './TreeViewNodeStyles';
import type {
	TreeNodeElementData,
	TreeNodeElementProps,
	TreeViewNodeSharedProps,
} from './TreeViewNodeTypes';

// ============================================================================
// Shared Props
// ============================================================================

/** Creates shared props for child nodes (returns input as readonly for type safety) */
export function createSharedProps(
	props: Readonly<TreeViewNodeSharedProps>
): Readonly<TreeViewNodeSharedProps> {
	return props;
}

// ============================================================================
// Element Data Preparation
// ============================================================================

/** Prepares all data needed for rendering tree item element */
export function prepareTreeNodeElementData(
	props: Readonly<TreeNodeElementProps>
): TreeNodeElementData {
	const {
		size,
		nodeIsSelected,
		node,
		hasChildren,
		nodeIsExpanded,
		selectionMode,
		nodeRef,
		nodeButtonId,
		isFocused,
		handleClick,
		handleDoubleClick,
		handleKeyDown,
	} = props;
	const nodeClasses = getTreeNodeElementClasses(size, nodeIsSelected, node.disabled);
	const ariaAttrs = getTreeItemAriaAttributes({
		hasChildren,
		nodeIsExpanded,
		selectionMode,
		nodeIsSelected,
		nodeDisabled: node.disabled,
	});
	const elementAttrs = getTreeNodeElementAttributes({
		nodeRef,
		nodeButtonId,
		isFocused,
		ariaAttrs,
		handleClick,
		handleDoubleClick,
		handleKeyDown,
	});
	return { nodeClasses, elementAttrs };
}
