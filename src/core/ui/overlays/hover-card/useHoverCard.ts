import { useCallback, useMemo, useRef } from 'react';

export interface UseHoverCardOptions {
	readonly delay: number;
	readonly hideDelay: number;
	readonly setIsVisible: (visible: boolean) => void;
	readonly disabled: boolean;
}

export interface UseHoverCardReturn {
	readonly handleMouseEnter: () => void;
	readonly handleMouseLeave: () => void;
	readonly handleFocus: () => void;
	readonly handleBlur: () => void;
}

interface ShowHoverCardOptions {
	readonly delay: number;
	readonly disabled: boolean;
	readonly setIsVisible: (visible: boolean) => void;
	readonly clearTimeout: () => void;
	readonly timeoutRef: ReturnType<typeof useRef<number | undefined>>;
}

function createShowHoverCard({
	delay,
	disabled,
	setIsVisible,
	clearTimeout,
	timeoutRef,
}: ShowHoverCardOptions) {
	if (disabled) return;
	clearTimeout();
	timeoutRef.current = globalThis.window.setTimeout(() => {
		setIsVisible(true);
	}, delay);
}

interface HideHoverCardOptions {
	readonly hideDelay: number;
	readonly setIsVisible: (visible: boolean) => void;
	readonly clearTimeout: () => void;
	readonly timeoutRef: ReturnType<typeof useRef<number | undefined>>;
}

function createHideHoverCard({
	hideDelay,
	setIsVisible,
	clearTimeout,
	timeoutRef,
}: HideHoverCardOptions) {
	clearTimeout();
	timeoutRef.current = globalThis.window.setTimeout(() => {
		setIsVisible(false);
	}, hideDelay);
}

function clearAllTimeouts(
	showTimeoutRef: ReturnType<typeof useRef<number | undefined>>,
	hideTimeoutRef: ReturnType<typeof useRef<number | undefined>>
) {
	globalThis.window.clearTimeout(showTimeoutRef.current);
	globalThis.window.clearTimeout(hideTimeoutRef.current);
	showTimeoutRef.current = undefined;
	hideTimeoutRef.current = undefined;
}

interface ShowCardOptions {
	readonly delay: number;
	readonly disabled: boolean;
	readonly setIsVisible: (visible: boolean) => void;
	readonly clearAllTimeouts: () => void;
	readonly showTimeoutRef: ReturnType<typeof useRef<number | undefined>>;
}

function handleShowCard(options: ShowCardOptions) {
	options.clearAllTimeouts();
	createShowHoverCard({
		delay: options.delay,
		disabled: options.disabled,
		setIsVisible: options.setIsVisible,
		clearTimeout: options.clearAllTimeouts,
		timeoutRef: options.showTimeoutRef,
	});
}

interface HideCardOptions {
	readonly hideDelay: number;
	readonly setIsVisible: (visible: boolean) => void;
	readonly clearAllTimeouts: () => void;
	readonly hideTimeoutRef: ReturnType<typeof useRef<number | undefined>>;
}

function handleHideCard(options: HideCardOptions) {
	createHideHoverCard({
		hideDelay: options.hideDelay,
		setIsVisible: options.setIsVisible,
		clearTimeout: options.clearAllTimeouts,
		timeoutRef: options.hideTimeoutRef,
	});
}

interface TimeoutRefs {
	readonly showTimeoutRef: ReturnType<typeof useRef<number | undefined>>;
	readonly hideTimeoutRef: ReturnType<typeof useRef<number | undefined>>;
}

interface ClearAllTimeoutsOptions {
	readonly refs: TimeoutRefs;
}

function clearAllTimeoutsHandler(options: ClearAllTimeoutsOptions) {
	clearAllTimeouts(options.refs.showTimeoutRef, options.refs.hideTimeoutRef);
}

interface ShowCardCallbackOptions {
	readonly delay: number;
	readonly disabled: boolean;
	readonly setIsVisible: (visible: boolean) => void;
	readonly clearAllTimeoutsCallback: () => void;
	readonly showTimeoutRef: ReturnType<typeof useRef<number | undefined>>;
}

function executeShowCard(options: ShowCardCallbackOptions) {
	handleShowCard({
		delay: options.delay,
		disabled: options.disabled,
		setIsVisible: options.setIsVisible,
		clearAllTimeouts: options.clearAllTimeoutsCallback,
		showTimeoutRef: options.showTimeoutRef,
	});
}

interface HideCardCallbackOptions {
	readonly hideDelay: number;
	readonly setIsVisible: (visible: boolean) => void;
	readonly clearAllTimeoutsCallback: () => void;
	readonly hideTimeoutRef: ReturnType<typeof useRef<number | undefined>>;
}

function executeHideCard(options: HideCardCallbackOptions) {
	handleHideCard({
		hideDelay: options.hideDelay,
		setIsVisible: options.setIsVisible,
		clearAllTimeouts: options.clearAllTimeoutsCallback,
		hideTimeoutRef: options.hideTimeoutRef,
	});
}

export function useHoverCard({
	delay,
	hideDelay,
	setIsVisible,
	disabled,
}: UseHoverCardOptions): UseHoverCardReturn {
	const showTimeoutRef = useRef<number | undefined>(undefined);
	const hideTimeoutRef = useRef<number | undefined>(undefined);
	const timeoutRefs: TimeoutRefs = useMemo(() => ({ showTimeoutRef, hideTimeoutRef }), []);
	const clearAllTimeoutsCallback = useCallback(() => {
		clearAllTimeoutsHandler({ refs: timeoutRefs });
	}, [timeoutRefs]);
	const showCard = useCallback(() => {
		executeShowCard({ delay, disabled, setIsVisible, clearAllTimeoutsCallback, showTimeoutRef });
	}, [delay, disabled, setIsVisible, clearAllTimeoutsCallback]);
	const hideCard = useCallback(() => {
		executeHideCard({ hideDelay, setIsVisible, clearAllTimeoutsCallback, hideTimeoutRef });
	}, [hideDelay, setIsVisible, clearAllTimeoutsCallback]);
	return {
		handleMouseEnter: showCard,
		handleMouseLeave: hideCard,
		handleFocus: showCard,
		handleBlur: hideCard,
	};
}
