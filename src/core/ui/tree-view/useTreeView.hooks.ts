import type { TreeNode } from '@src-types/ui/navigation';
import { useCallback, useMemo } from 'react';

import { findNodeById, flattenNodeIds } from './useTreeView.utils';

export function useTreeNodeUtils(nodes: readonly TreeNode[]) {
	const allNodeIds = useMemo(() => flattenNodeIds(nodes), [nodes]);
	const getNodeById = useCallback((nodeId: string) => findNodeById(nodes, nodeId), [nodes]);
	const getAllNodeIds = useCallback(() => allNodeIds, [allNodeIds]);
	return { allNodeIds, getNodeById, getAllNodeIds };
}
