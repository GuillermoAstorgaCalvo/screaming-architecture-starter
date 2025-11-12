import type { StandardSize } from '@src-types/ui/base';
import type { TreeNode, TreeViewSelectionMode } from '@src-types/ui/navigation';
import { type KeyboardEvent, useEffect, useRef } from 'react';

import { getTreeNodeIds } from './TreeViewHelpers';
import { ChildNodesContainer, TreeNodeElement } from './TreeViewNodeComponents';
import { createSharedProps } from './TreeViewNodeData';
import { createNodeHandlers } from './TreeViewNodeHandlers';

export interface TreeViewNodeProps {
	readonly node: TreeNode;
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

/**
 * Calculates node state values
 */
function useNodeState({
	node,
	treeViewId,
	isSelected,
	isExpanded,
	focusedNodeId,
}: Readonly<{
	node: TreeNode;
	treeViewId: string;
	isSelected: (nodeId: string) => boolean;
	isExpanded: (nodeId: string) => boolean;
	focusedNodeId: string | null;
}>) {
	const nodeRef = useRef<HTMLDivElement>(null);
	const { nodeButtonId, nodeContentId } = getTreeNodeIds(treeViewId, node.id);
	const hasChildren = node.children !== undefined && node.children.length > 0;
	const isFocused = focusedNodeId === node.id;
	const nodeIsSelected = isSelected(node.id);
	const nodeIsExpanded = isExpanded(node.id);

	useEffect(() => {
		if (isFocused && nodeRef.current) {
			nodeRef.current.focus();
		}
	}, [isFocused]);

	return {
		nodeRef,
		nodeButtonId,
		nodeContentId,
		hasChildren,
		isFocused,
		nodeIsSelected,
		nodeIsExpanded,
	};
}

/**
 * Extracts shared props from TreeViewNodeProps
 */
function extractSharedProps(props: Readonly<TreeViewNodeProps>) {
	const {
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
	} = props;
	return {
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
	};
}

/**
 * Prepares all data needed for TreeViewNode rendering
 */
function useTreeViewNodeData(props: Readonly<TreeViewNodeProps>) {
	const { node } = props;
	const sharedProps = extractSharedProps(props);
	const nodeState = useNodeState({
		node,
		treeViewId: sharedProps.treeViewId,
		isSelected: sharedProps.isSelected,
		isExpanded: sharedProps.isExpanded,
		focusedNodeId: sharedProps.focusedNodeId,
	});
	const handlers = createNodeHandlers({
		node,
		hasChildren: nodeState.hasChildren,
		nodeIsExpanded: nodeState.nodeIsExpanded,
		...sharedProps,
	});

	return {
		nodeState,
		handlers,
		sharedProps: createSharedProps(sharedProps),
		size: sharedProps.size,
		selectionMode: sharedProps.selectionMode,
		showExpandIcons: sharedProps.showExpandIcons,
	};
}

/**
 * Renders a single tree node
 */
export function TreeViewNode(props: Readonly<TreeViewNodeProps>) {
	const { nodeState, handlers, sharedProps, size, selectionMode, showExpandIcons } =
		useTreeViewNodeData(props);
	const { node } = props;

	return (
		<div className="w-full">
			<TreeNodeElement
				nodeRef={nodeState.nodeRef}
				nodeButtonId={nodeState.nodeButtonId}
				nodeContentId={nodeState.nodeContentId}
				node={node}
				hasChildren={nodeState.hasChildren}
				isFocused={nodeState.isFocused}
				nodeIsSelected={nodeState.nodeIsSelected}
				nodeIsExpanded={nodeState.nodeIsExpanded}
				selectionMode={selectionMode}
				size={size}
				showExpandIcons={showExpandIcons}
				handleClick={handlers.handleClick}
				handleDoubleClick={handlers.handleDoubleClick}
				handleKeyDown={handlers.handleKeyDown}
			/>
			{nodeState.hasChildren && node.children ? (
				<ChildNodesContainer
					nodeButtonId={nodeState.nodeButtonId}
					nodeIsExpanded={nodeState.nodeIsExpanded}
				>
					{node.children.map(child => (
						<TreeViewNode key={child.id} node={child} {...sharedProps} />
					))}
				</ChildNodesContainer>
			) : null}
		</div>
	);
}
