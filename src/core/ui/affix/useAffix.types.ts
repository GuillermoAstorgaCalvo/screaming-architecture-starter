import type { RefObject } from 'react';

import type { AffixPosition } from './useAffix.helpers';

export interface MutableRef<T> {
	current: T;
}

export interface UseAffixOptions {
	readonly threshold: number;
	readonly position: AffixPosition;
	readonly offset: number;
	readonly container: HTMLElement | null | undefined;
	readonly enabled: boolean;
	readonly onStickyChange?: (isSticky: boolean) => void;
}

export interface UseAffixReturn {
	readonly isSticky: boolean;
	readonly elementRef: RefObject<HTMLDivElement | null>;
}

export interface StickyCalculationParams {
	readonly elementRef: RefObject<HTMLDivElement | null>;
	readonly position: AffixPosition;
	readonly threshold: number;
	readonly container: HTMLElement | null | undefined;
	readonly enabledRef: MutableRef<boolean>;
	readonly initialPositionRef: MutableRef<number | null>;
}

export interface ScrollHandlerParams {
	readonly calculateStickyState: () => boolean;
	readonly isSticky: boolean;
	readonly onStickyChange: ((isSticky: boolean) => void) | undefined;
	readonly setIsSticky: (value: boolean) => void;
	readonly enabledRef: MutableRef<boolean>;
}

export interface ScrollEffectParams {
	readonly enabled: boolean;
	readonly container: HTMLElement | null | undefined;
	readonly elementRef: RefObject<HTMLDivElement | null>;
	readonly initialPositionRef: MutableRef<number | null>;
	readonly handleScroll: () => void;
}

export interface EnabledSyncParams {
	readonly enabled: boolean;
	readonly elementRef: RefObject<HTMLDivElement | null>;
	readonly setIsSticky: (value: boolean) => void;
	readonly initialPositionRef: MutableRef<number | null>;
	readonly enabledRef: MutableRef<boolean>;
}

export interface AffixRefs {
	readonly elementRef: RefObject<HTMLDivElement | null>;
	readonly initialPositionRef: MutableRef<number | null>;
	readonly enabledRef: MutableRef<boolean>;
}

export interface AffixState {
	readonly isSticky: boolean;
	readonly setIsSticky: (value: boolean) => void;
}

export interface AffixHooksSetup {
	readonly isSticky: boolean;
	readonly elementRef: RefObject<HTMLDivElement | null>;
	readonly handleScroll: () => void;
}

export interface AffixHooksParams {
	readonly threshold: number;
	readonly position: AffixPosition;
	readonly container: HTMLElement | null | undefined;
	readonly enabled: boolean;
	readonly onStickyChange: ((isSticky: boolean) => void) | undefined;
}
