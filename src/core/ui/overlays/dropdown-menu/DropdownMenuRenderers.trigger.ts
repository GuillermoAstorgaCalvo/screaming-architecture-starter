import { cloneElement, type ReactElement } from 'react';

import {
	createTriggerAriaAttributes,
	createTriggerHandlers,
	getOriginalHandlers,
} from './DropdownMenuHelpers';
import type { CreateTriggerNodeParams } from './DropdownMenuRenderers.types';

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
