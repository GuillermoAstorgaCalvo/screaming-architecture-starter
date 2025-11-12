import { useMemo, useState } from 'react';

import type { TreeStateResult } from './useTreeViewSetup.types';

function getFocusedNodeId(selectedNodeIds: Set<string>, allNodeIds: string[]): string | null {
	if (selectedNodeIds.size > 0) {
		return Array.from(selectedNodeIds)[0] ?? null;
	}
	return allNodeIds[0] ?? null;
}

export function useFocusedNode(
	selectedNodeIds: Set<string>,
	allNodeIds: string[]
): [string | null, (nodeId: string) => void] {
	const focusedNodeId = useMemo(
		() => getFocusedNodeId(selectedNodeIds, allNodeIds),
		[selectedNodeIds, allNodeIds]
	);
	const [internalFocusedNodeId, setInternalFocusedNodeId] = useState<string | null>(focusedNodeId);
	const syncedFocusedNodeId = useMemo(
		() => focusedNodeId ?? internalFocusedNodeId,
		[focusedNodeId, internalFocusedNodeId]
	);
	return [syncedFocusedNodeId, setInternalFocusedNodeId];
}

export function useFocusedNodeState(treeState: TreeStateResult) {
	return useFocusedNode(treeState.selectedNodeIds, treeState.getAllNodeIds());
}
