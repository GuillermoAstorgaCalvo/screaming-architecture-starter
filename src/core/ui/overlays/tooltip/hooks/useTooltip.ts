import { useCallback, useRef } from 'react';

export interface UseTooltipOptions {
	delay: number;
	setIsVisible: (visible: boolean) => void;
	disabled: boolean;
}

export interface UseTooltipReturn {
	handleMouseEnter: () => void;
	handleMouseLeave: () => void;
	handleFocus: () => void;
	handleBlur: () => void;
}

interface ShowTooltipOptions {
	delay: number;
	disabled: boolean;
	setIsVisible: (visible: boolean) => void;
	clearTimeout: () => void;
	timeoutRef: ReturnType<typeof useRef<number | undefined>>;
}

function createShowTooltip({
	delay,
	disabled,
	setIsVisible,
	clearTimeout,
	timeoutRef,
}: ShowTooltipOptions) {
	if (disabled) return;
	clearTimeout();
	timeoutRef.current = globalThis.window.setTimeout(() => {
		setIsVisible(true);
	}, delay);
}

function hideTooltip(setIsVisible: (visible: boolean) => void, clearTimeout: () => void) {
	clearTimeout();
	setIsVisible(false);
}

export function useTooltip({ delay, setIsVisible, disabled }: UseTooltipOptions): UseTooltipReturn {
	const timeoutRef = useRef<number | undefined>(undefined);

	const clearTimeout = useCallback(() => {
		if (timeoutRef.current !== undefined) {
			globalThis.window.clearTimeout(timeoutRef.current);
			timeoutRef.current = undefined;
		}
	}, []);

	const handleMouseEnter = useCallback(() => {
		createShowTooltip({ delay, disabled, setIsVisible, clearTimeout, timeoutRef });
	}, [delay, disabled, setIsVisible, clearTimeout]);

	const handleMouseLeave = useCallback(() => {
		hideTooltip(setIsVisible, clearTimeout);
	}, [setIsVisible, clearTimeout]);

	const handleFocus = useCallback(() => {
		createShowTooltip({ delay, disabled, setIsVisible, clearTimeout, timeoutRef });
	}, [delay, disabled, setIsVisible, clearTimeout]);

	const handleBlur = useCallback(() => {
		hideTooltip(setIsVisible, clearTimeout);
	}, [setIsVisible, clearTimeout]);

	return {
		handleMouseEnter,
		handleMouseLeave,
		handleFocus,
		handleBlur,
	};
}
