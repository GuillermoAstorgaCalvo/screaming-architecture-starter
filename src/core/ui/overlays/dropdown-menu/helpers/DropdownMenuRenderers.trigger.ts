import {
	createTriggerAriaAttributes,
	createTriggerHandlers,
	getOriginalHandlers,
} from '@core/ui/overlays/dropdown-menu/helpers/DropdownMenuTrigger';
import type { CreateTriggerNodeParams } from '@core/ui/overlays/dropdown-menu/types/DropdownMenuRenderers.types';
import { cloneElement, type ReactElement } from 'react';

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
	const { originalOnClick, originalOnKeyDown } = getOriginalHandlers(typedTrigger);
	const { handleClick, handleKeyDown } = createTriggerHandlers({
		originalOnClick,
		originalOnKeyDown,
		toggleOpen: () => setOpen(!open),
		setOpen,
	});

	return cloneElement(typedTrigger, {
		...createTriggerAriaAttributes(open, menuId),
		onClick: handleClick,
		onKeyDown: handleKeyDown,
	});
}
