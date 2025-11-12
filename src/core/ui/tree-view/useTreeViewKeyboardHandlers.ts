import { type KeyboardEvent, useCallback } from 'react';

import { useTreeViewKeyboard } from './useTreeViewKeyboard';
import type { KeyboardHandlersParams } from './useTreeViewSetup.types';

export function useTreeViewKeyboardHandlers(params: KeyboardHandlersParams) {
	const { handleKeyDown: handleKeyboardNavigation } = useTreeViewKeyboard({
		nodes: params.nodes,
		expandedNodeIds: params.expandedNodeIds,
		onNodeSelect: nodeId => {
			params.setFocusedNodeId(nodeId);
			if (params.selectionMode !== 'none') {
				params.toggleSelection(nodeId);
			}
		},
		onNodeExpand: params.expandNode,
		onNodeCollapse: params.collapseNode,
		onNodeToggle: nodeId => {
			if (params.selectionMode !== 'none') {
				params.toggleSelection(nodeId);
			}
			const node = params.getNodeById(nodeId);
			if (node?.children && node.children.length > 0) {
				params.toggleExpansion(nodeId);
			}
		},
	});

	const handleKeyDown = useCallback(
		(event: KeyboardEvent<HTMLDivElement>, nodeId: string) => {
			params.setFocusedNodeId(nodeId);
			handleKeyboardNavigation(event, nodeId);
		},
		[handleKeyboardNavigation, params]
	);

	return handleKeyDown;
}
