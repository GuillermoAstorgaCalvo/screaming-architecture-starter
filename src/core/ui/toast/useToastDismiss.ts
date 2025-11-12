import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseToastDismissParams {
	readonly isOpen: boolean;
	readonly autoDismiss: boolean;
	readonly dismissAfter: number;
	readonly pauseOnHover: boolean;
	readonly onDismiss?: () => void;
}

export interface UseToastDismissReturn {
	readonly handleMouseEnter?: () => void;
	readonly handleMouseLeave?: () => void;
	readonly handleDismiss: () => void;
}

interface UseTimeoutRefReturn {
	readonly clearTimer: () => void;
	readonly scheduleTimer: (callback: () => void, delay: number) => void;
}

function useTimeoutRef(): UseTimeoutRefReturn {
	const timeoutRef = useRef<ReturnType<typeof globalThis.setTimeout> | null>(null);

	const clearTimer = useCallback(() => {
		if (timeoutRef.current !== null) {
			globalThis.clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}
	}, []);

	const scheduleTimer = useCallback(
		(callback: () => void, delay: number) => {
			clearTimer();
			timeoutRef.current = globalThis.setTimeout(callback, delay);
		},
		[clearTimer]
	);

	return { clearTimer, scheduleTimer };
}

interface UseHoverStateReturn {
	readonly isHovered: boolean;
	readonly handleMouseEnter: () => void;
	readonly handleMouseLeave: () => void;
}

function useHoverState(): UseHoverStateReturn {
	const [isHovered, setIsHovered] = useState(false);

	const handleMouseEnter = useCallback(() => {
		setIsHovered(true);
	}, []);

	const handleMouseLeave = useCallback(() => {
		setIsHovered(false);
	}, []);

	return { isHovered, handleMouseEnter, handleMouseLeave };
}

interface UseAutoDismissEffectParams {
	readonly isOpen: boolean;
	readonly autoDismiss: boolean;
	readonly dismissAfter: number;
	readonly pauseOnHover: boolean;
	readonly isHovered: boolean;
	readonly onDismiss: (() => void) | undefined;
	readonly clearTimer: () => void;
	readonly scheduleTimer: (callback: () => void, delay: number) => void;
}

function useAutoDismissEffect({
	isOpen,
	autoDismiss,
	dismissAfter,
	pauseOnHover,
	isHovered,
	onDismiss,
	clearTimer,
	scheduleTimer,
}: Readonly<UseAutoDismissEffectParams>): void {
	useEffect(() => {
		if (!isOpen || (pauseOnHover && isHovered)) {
			clearTimer();
			return;
		}

		if (autoDismiss && onDismiss) {
			scheduleTimer(onDismiss, dismissAfter);
		}

		return clearTimer;
	}, [
		isOpen,
		pauseOnHover,
		isHovered,
		autoDismiss,
		onDismiss,
		dismissAfter,
		clearTimer,
		scheduleTimer,
	]);
}

function createHoverHandlers(
	handleMouseEnter: () => void,
	handleMouseLeave: () => void,
	handleDismiss: () => void
): UseToastDismissReturn {
	return {
		handleMouseEnter,
		handleMouseLeave,
		handleDismiss,
	};
}

function createBasicHandlers(handleDismiss: () => void): UseToastDismissReturn {
	return {
		handleDismiss,
	};
}

export function useToastDismiss({
	isOpen,
	autoDismiss,
	dismissAfter,
	pauseOnHover,
	onDismiss,
}: Readonly<UseToastDismissParams>): UseToastDismissReturn {
	const { clearTimer, scheduleTimer } = useTimeoutRef();
	const { isHovered, handleMouseEnter, handleMouseLeave } = useHoverState();

	useAutoDismissEffect({
		isOpen,
		autoDismiss,
		dismissAfter,
		pauseOnHover,
		isHovered,
		onDismiss,
		clearTimer,
		scheduleTimer,
	});

	const handleDismiss = useCallback(() => {
		clearTimer();
		onDismiss?.();
	}, [clearTimer, onDismiss]);

	if (pauseOnHover) {
		return createHoverHandlers(handleMouseEnter, handleMouseLeave, handleDismiss);
	}

	return createBasicHandlers(handleDismiss);
}
