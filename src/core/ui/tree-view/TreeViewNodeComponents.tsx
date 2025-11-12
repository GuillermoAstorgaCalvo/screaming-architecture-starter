import type { TreeNode } from '@src-types/ui/navigation';
import type { ReactNode } from 'react';

import {
	getTreeChildrenClasses,
	getTreeExpandIconClasses,
	getTreeNodeContentClasses,
	getTreeNodeIconClasses,
} from './TreeViewHelpers';
import { prepareTreeNodeElementData } from './TreeViewNodeData';
import type { TreeNodeElementProps } from './TreeViewNodeTypes';

/**
 * Renders the expand/collapse icon
 */
export function ExpandIcon({ isExpanded }: Readonly<{ isExpanded: boolean }>) {
	return (
		<span className={getTreeExpandIconClasses(isExpanded)} aria-hidden="true">
			{isExpanded ? '▼' : '▶'}
		</span>
	);
}

/**
 * Renders the node content (icon and label)
 */
export function NodeContent({
	icon,
	label,
	contentId,
}: Readonly<{ icon?: ReactNode; label: ReactNode; contentId: string }>) {
	const iconClasses = getTreeNodeIconClasses();
	const contentClasses = getTreeNodeContentClasses();

	return (
		<>
			{icon ? <span className={iconClasses}>{icon}</span> : null}
			<span className={contentClasses} id={contentId}>
				{label}
			</span>
		</>
	);
}

/**
 * Renders the expand icon or spacer
 */
export function ExpandIconOrSpacer({
	showExpandIcons,
	hasChildren,
	isExpanded,
}: Readonly<{ showExpandIcons: boolean; hasChildren: boolean; isExpanded: boolean }>) {
	if (showExpandIcons && hasChildren) {
		return <ExpandIcon isExpanded={isExpanded} />;
	}
	return <span className="w-4" aria-hidden="true" />;
}

/**
 * Renders child nodes container
 */
export function ChildNodesContainer({
	nodeButtonId,
	nodeIsExpanded,
	children,
}: Readonly<{
	nodeButtonId: string;
	nodeIsExpanded: boolean;
	children: ReactNode;
}>) {
	return (
		<div aria-labelledby={nodeButtonId} className={getTreeChildrenClasses(nodeIsExpanded)}>
			{children}
		</div>
	);
}

/**
 * Renders the content inside a tree item
 */
export function TreeNodeItemContent({
	node,
	nodeContentId,
	showExpandIcons,
	hasChildren,
	nodeIsExpanded,
}: Readonly<{
	node: TreeNode;
	nodeContentId: string;
	showExpandIcons: boolean;
	hasChildren: boolean;
	nodeIsExpanded: boolean;
}>) {
	return (
		<>
			<ExpandIconOrSpacer
				showExpandIcons={showExpandIcons}
				hasChildren={hasChildren}
				isExpanded={nodeIsExpanded}
			/>
			<NodeContent icon={node.icon} label={node.label} contentId={nodeContentId} />
		</>
	);
}

/**
 * Renders the tree item element
 */
export function TreeNodeElement(props: Readonly<TreeNodeElementProps>) {
	const { nodeClasses, elementAttrs } = prepareTreeNodeElementData(props);
	const { node, nodeContentId, showExpandIcons, hasChildren, nodeIsExpanded } = props;

	return (
		<div {...elementAttrs} className={nodeClasses}>
			<TreeNodeItemContent
				node={node}
				nodeContentId={nodeContentId}
				showExpandIcons={showExpandIcons}
				hasChildren={hasChildren}
				nodeIsExpanded={nodeIsExpanded}
			/>
		</div>
	);
}
