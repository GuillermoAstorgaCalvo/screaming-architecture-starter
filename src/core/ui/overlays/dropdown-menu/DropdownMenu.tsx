import { prepareContentParams, prepareRenderParams } from './DropdownMenu.helpers';
import { usePrepareDropdownMenuContent } from './DropdownMenu.hooks';
import { renderDropdownMenu } from './DropdownMenu.renderers';
import type { DropdownMenuProps } from './DropdownMenu.types';
import { useDropdownMenu } from './useDropdownMenu';

export default function DropdownMenu({
	trigger,
	items,
	isOpen,
	onOpenChange,
	onSelect,
	align = 'center',
	className,
	menuLabel,
	maxHeight = 280,
	emptyState = 'No actions available',
}: Readonly<DropdownMenuProps>) {
	const menuData = useDropdownMenu({ items, isOpen, onOpenChange, onSelect });
	const { triggerNode, menuContent } = usePrepareDropdownMenuContent(
		prepareContentParams({ menuData, trigger, items, emptyState })
	);
	return renderDropdownMenu(
		prepareRenderParams({
			menuData,
			triggerNode,
			menuContent,
			align,
			className,
			menuLabel,
			maxHeight,
		})
	);
}
