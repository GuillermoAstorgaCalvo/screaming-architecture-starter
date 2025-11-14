import { getTreeNodeClasses } from '@core/ui/data-display/tree-view/helpers/TreeViewHelpers';
import type { StandardSize } from '@src-types/ui/base';

/**
 * Gets CSS classes for tree node element
 */
export function getTreeNodeElementClasses(
	size: StandardSize,
	nodeIsSelected: boolean,
	nodeDisabled: boolean | undefined
): string {
	const disabledClass = nodeDisabled ? 'opacity-disabled' : '';
	return getTreeNodeClasses(size, nodeIsSelected, disabledClass);
}
