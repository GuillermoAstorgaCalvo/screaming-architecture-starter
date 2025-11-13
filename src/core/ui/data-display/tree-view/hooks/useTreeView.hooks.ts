import {
	findNodeById,
	flattenNodeIds,
} from '@core/ui/data-display/tree-view/helpers/useTreeView.utils';
import type { TreeNode } from '@src-types/ui/navigation/treeView';
import { useCallback, useMemo } from 'react';

export function useTreeNodeUtils(nodes: readonly TreeNode[]) {
	const allNodeIds = useMemo(() => flattenNodeIds(nodes), [nodes]);
	const getNodeById = useCallback((nodeId: string) => findNodeById(nodes, nodeId), [nodes]);
	const getAllNodeIds = useCallback(() => allNodeIds, [allNodeIds]);
	return { allNodeIds, getNodeById, getAllNodeIds };
}
