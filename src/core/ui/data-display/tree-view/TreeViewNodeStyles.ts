import type { StandardSize } from '@src-types/ui/base';

import { getTreeNodeClasses } from './TreeViewHelpers';

/**
 * Gets CSS classes for tree node element
 */
export function getTreeNodeElementClasses(
	size: StandardSize,
	nodeIsSelected: boolean,
	nodeDisabled: boolean | undefined
): string {
	const disabledClass = nodeDisabled ? 'opacity-50' : '';
	return getTreeNodeClasses(size, nodeIsSelected, disabledClass);
}
