import {
	renderMenuContent,
	renderPopover,
} from '@core/ui/overlays/context-menu/components/ContextMenuContent.renderers';
import type { ContextMenuContentProps } from '@core/ui/overlays/context-menu/types/ContextMenuContent.types';

export function ContextMenuContent(props: Readonly<ContextMenuContentProps>) {
	const menuContent = renderMenuContent({
		items: props.items,
		highlightedIndex: props.highlightedIndex,
		itemRefs: props.itemRefs,
		handleSelect: props.handleSelect,
		emptyState: props.emptyState,
	});

	return renderPopover({
		open: props.open,
		setOpen: props.setOpen,
		trigger: props.trigger,
		align: props.align ?? 'center',
		className: props.className,
		menuRef: props.menuRef,
		menuId: props.menuId,
		menuLabel: props.menuLabel,
		maxHeight: props.maxHeight,
		handleKeyDown: props.handleKeyDown,
		menuContent,
	});
}
