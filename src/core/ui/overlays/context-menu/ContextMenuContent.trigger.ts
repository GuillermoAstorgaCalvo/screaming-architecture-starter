import { cloneElement, type MouseEvent as ReactMouseEvent, type ReactElement } from 'react';

import type { CreateTriggerNodeParams } from './ContextMenuContent.types';

export function createTriggerNode({
	trigger,
	open,
	menuId,
	setOpen,
}: CreateTriggerNodeParams): ReactElement {
	if (typeof trigger !== 'object') {
		return trigger;
	}

	const typedTrigger = trigger as ReactElement<Record<string, unknown>>;
	const originalOnContextMenu = typedTrigger.props['onContextMenu'] as
		| ((event: ReactMouseEvent<Element>) => void)
		| undefined;

	const handleContextMenu = (event: ReactMouseEvent<Element>) => {
		event.preventDefault();
		event.stopPropagation();
		originalOnContextMenu?.(event);
		setOpen(true);
	};

	return cloneElement(typedTrigger, {
		'aria-haspopup': 'menu',
		'aria-expanded': open,
		'aria-controls': open ? menuId : undefined,
		onContextMenu: handleContextMenu,
	});
}
