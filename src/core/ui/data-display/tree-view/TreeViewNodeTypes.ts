import type { StandardSize } from '@src-types/ui/base';
import type { TreeNode, TreeViewSelectionMode } from '@src-types/ui/navigation/treeView';
import type { KeyboardEvent, MouseEvent, RefObject } from 'react';

// ============================================================================
// Event Handler Types
// ============================================================================

export type MouseEventHandler = (event: MouseEvent<HTMLDivElement>) => void;
export type KeyboardEventHandler = (event: KeyboardEvent<HTMLDivElement>) => void;

// ============================================================================
// Component Props
// ============================================================================

/**
 * Props for TreeNodeElement component
 */
export interface TreeNodeElementProps {
	readonly nodeRef: RefObject<HTMLDivElement | null>;
	readonly nodeButtonId: string;
	readonly nodeContentId: string;
	readonly node: TreeNode;
	readonly hasChildren: boolean;
	readonly isFocused: boolean;
	readonly nodeIsSelected: boolean;
	readonly nodeIsExpanded: boolean;
	readonly selectionMode: TreeViewSelectionMode;
	readonly size: StandardSize;
	readonly showExpandIcons: boolean;
	readonly handleClick: MouseEventHandler;
	readonly handleDoubleClick: MouseEventHandler;
	readonly handleKeyDown: KeyboardEventHandler;
}

/**
 * Shared props type for tree node components (TreeViewNodeProps without node)
 */
export interface TreeViewNodeSharedProps {
	readonly treeViewId: string;
	readonly size: StandardSize;
	readonly selectionMode: TreeViewSelectionMode;
	readonly isSelected: (nodeId: string) => boolean;
	readonly isExpanded: (nodeId: string) => boolean;
	readonly showExpandIcons: boolean;
	readonly focusedNodeId: string | null;
	readonly onNodeClick: (nodeId: string, node: TreeNode) => void;
	readonly onNodeDoubleClick: (nodeId: string, node: TreeNode) => void;
	readonly onNodeToggle: (nodeId: string) => void;
	readonly onNodeExpand: (nodeId: string) => void;
	readonly onNodeCollapse: (nodeId: string) => void;
	readonly onKeyDown: (event: KeyboardEvent<HTMLDivElement>, nodeId: string) => void;
}

// ============================================================================
// Function Parameter Types
// ============================================================================

export interface CreateClickHandlerParams {
	readonly node: TreeNode;
	readonly hasChildren: boolean;
	readonly nodeIsExpanded: boolean;
	readonly selectionMode: TreeViewSelectionMode;
	readonly onNodeClick: (nodeId: string, node: TreeNode) => void;
	readonly onNodeToggle: (nodeId: string) => void;
	readonly onNodeExpand: (nodeId: string) => void;
	readonly onNodeCollapse: (nodeId: string) => void;
}

export interface CreateNodeHandlersParams {
	readonly node: TreeNode;
	readonly hasChildren: boolean;
	readonly nodeIsExpanded: boolean;
	readonly selectionMode: TreeViewSelectionMode;
	readonly onNodeClick: (nodeId: string, node: TreeNode) => void;
	readonly onNodeDoubleClick: (nodeId: string, node: TreeNode) => void;
	readonly onNodeToggle: (nodeId: string) => void;
	readonly onNodeExpand: (nodeId: string) => void;
	readonly onNodeCollapse: (nodeId: string) => void;
	readonly onKeyDown: (event: KeyboardEvent<HTMLDivElement>, nodeId: string) => void;
}

export interface GetTreeItemAriaAttributesParams {
	readonly hasChildren: boolean;
	readonly nodeIsExpanded: boolean;
	readonly selectionMode: TreeViewSelectionMode;
	readonly nodeIsSelected: boolean;
	readonly nodeDisabled: boolean | undefined;
}

export interface GetTreeNodeElementAttributesParams {
	readonly nodeRef: RefObject<HTMLDivElement | null>;
	readonly nodeButtonId: string;
	readonly isFocused: boolean;
	readonly ariaAttrs: TreeItemAriaAttributes;
	readonly handleClick: MouseEventHandler;
	readonly handleDoubleClick: MouseEventHandler;
	readonly handleKeyDown: KeyboardEventHandler;
}

// ============================================================================
// Return Types
// ============================================================================

export interface TreeItemAriaAttributes {
	readonly 'aria-expanded': boolean | undefined;
	readonly 'aria-selected': boolean;
	readonly 'aria-disabled': boolean | undefined;
}

export interface TreeNodeElementAttributes {
	readonly ref: RefObject<HTMLDivElement | null>;
	readonly role: 'treeitem';
	readonly tabIndex: number;
	readonly 'aria-expanded': boolean | undefined;
	readonly 'aria-selected': boolean;
	readonly 'aria-disabled': boolean | undefined;
	readonly id: string;
	readonly onClick: MouseEventHandler;
	readonly onDoubleClick: MouseEventHandler;
	readonly onKeyDown: KeyboardEventHandler;
}

export interface TreeNodeElementData {
	readonly nodeClasses: string;
	readonly elementAttrs: TreeNodeElementAttributes;
}
