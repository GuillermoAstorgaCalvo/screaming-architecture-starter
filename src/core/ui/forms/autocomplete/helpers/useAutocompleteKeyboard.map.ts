export interface KeyboardHandlers {
	handleArrowDown: () => void;
	handleArrowUp: () => void;
	handleEnterOrSpace: () => void;
	handleEscape: () => void;
	handleHome: () => void;
	handleEnd: () => void;
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
