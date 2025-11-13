export interface KeyboardHandlers {
	readonly handleArrowDown: () => void;
	readonly handleArrowUp: () => void;
	readonly handleEnterOrSpace: () => void;
	readonly handleEscape: () => void;
	readonly handleHome: () => void;
	readonly handleEnd: () => void;
}

export function createKeyHandlerMap(handlers: KeyboardHandlers): Record<string, () => void> {
	return {
		ArrowDown: handlers.handleArrowDown,
		ArrowUp: handlers.handleArrowUp,
		Enter: handlers.handleEnterOrSpace,
		' ': handlers.handleEnterOrSpace,
		Escape: handlers.handleEscape,
		Home: handlers.handleHome,
		End: handlers.handleEnd,
	};
}
