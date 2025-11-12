import type { TreeNode, TreeViewProps } from '@src-types/ui/navigation';
import { type KeyboardEvent, useId } from 'react';

import { getTreeViewClasses } from './TreeViewHelpers';
import { TreeViewNode } from './TreeViewNode';
import { useTreeViewSetup } from './useTreeViewSetup';

/**
 * Generates a unique TreeView ID from the provided ID or a generated one.
 */
function getTreeViewId(treeViewId: string | undefined, generatedId: string): string {
	return treeViewId ?? `treeview-${generatedId}`;
}

interface RenderTreeNodesParams {
	readonly nodes: readonly TreeNode[];
	readonly treeViewId: string;
	readonly size: TreeViewProps['size'];
	readonly selectionMode: TreeViewProps['selectionMode'];
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

/**
 * Renders tree nodes recursively
 */
function renderTreeNodes({
	nodes,
	treeViewId,
	size,
	selectionMode,
	isSelected,
	isExpanded,
	showExpandIcons,
	focusedNodeId,
	onNodeClick,
	onNodeDoubleClick,
	onNodeToggle,
	onNodeExpand,
	onNodeCollapse,
	onKeyDown,
}: RenderTreeNodesParams) {
	return nodes.map(node => (
		<TreeViewNode
			key={node.id}
			node={node}
			treeViewId={treeViewId}
			size={size ?? 'md'}
			selectionMode={selectionMode ?? 'none'}
			isSelected={isSelected}
			isExpanded={isExpanded}
			showExpandIcons={showExpandIcons}
			focusedNodeId={focusedNodeId}
			onNodeClick={onNodeClick}
			onNodeDoubleClick={onNodeDoubleClick}
			onNodeToggle={onNodeToggle}
			onNodeExpand={onNodeExpand}
			onNodeCollapse={onNodeCollapse}
			onKeyDown={onKeyDown}
		/>
	));
}

/**
 * TreeView - Hierarchical data component for displaying tree structures
 *
 * Features:
 * - Expand/collapse nodes
 * - Single or multiple selection modes
 * - Full keyboard navigation (Arrow keys, Enter, Space, Home, End)
 * - Accessible ARIA attributes
 * - Customizable size and styling
 * - Support for icons and custom node content
 *
 * @example
 * ```tsx
 * <TreeView
 *   nodes={[
 *     {
 *       id: '1',
 *       label: 'Folder 1',
 *       children: [
 *         { id: '1-1', label: 'File 1-1' },
 *         { id: '1-2', label: 'File 1-2' },
 *       ],
 *     },
 *   ]}
 *   selectionMode="single"
 * />
 * ```
 */
export default function TreeView({
	treeViewId: providedTreeViewId,
	showExpandIcons = true,
	size = 'md',
	className,
	...props
}: Readonly<TreeViewProps>) {
	const generatedId = useId();
	const treeViewId = getTreeViewId(providedTreeViewId, generatedId);
	const setup = useTreeViewSetup(props);
	const containerClasses = getTreeViewClasses(className);
	const isMultiSelectable = props.selectionMode === 'multiple';

	return (
		<div
			role="tree"
			aria-multiselectable={isMultiSelectable || undefined}
			id={treeViewId}
			className={containerClasses}
			{...props}
		>
			{renderTreeNodes({
				nodes: setup.nodes,
				treeViewId,
				size,
				selectionMode: setup.selectionMode,
				isSelected: setup.isSelected,
				isExpanded: setup.isExpanded,
				showExpandIcons,
				focusedNodeId: setup.focusedNodeId,
				onNodeClick: setup.handleNodeClick,
				onNodeDoubleClick: setup.handleNodeDoubleClick,
				onNodeToggle: setup.handleNodeToggle,
				onNodeExpand: setup.handleNodeExpand,
				onNodeCollapse: setup.handleNodeCollapse,
				onKeyDown: setup.handleKeyDown,
			})}
		</div>
	);
}
