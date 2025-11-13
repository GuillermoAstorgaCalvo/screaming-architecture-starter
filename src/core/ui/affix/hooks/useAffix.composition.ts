import { useStickyCalculation } from './useAffix.calculation';
import { useScrollEffect } from './useAffix.effect';
import { useEnabledSync } from './useAffix.enabled';
import { useAffixRefs } from './useAffix.refs';
import { useScrollHandler } from './useAffix.scroll';
import { useAffixState } from './useAffix.state';
import type { AffixHooksParams, AffixHooksSetup } from './useAffix.types';

export function useAffixHooks(params: AffixHooksParams): AffixHooksSetup {
	const { threshold, position, container, enabled, onStickyChange } = params;
	const refs = useAffixRefs(enabled);
	const { isSticky, setIsSticky } = useAffixState();

	useEnabledSync({
		enabled,
		elementRef: refs.elementRef,
		setIsSticky,
		initialPositionRef: refs.initialPositionRef,
		enabledRef: refs.enabledRef,
	});

	const calculateStickyState = useStickyCalculation({
		elementRef: refs.elementRef,
		position,
		threshold,
		container,
		enabledRef: refs.enabledRef,
		initialPositionRef: refs.initialPositionRef,
	});

	const handleScroll = useScrollHandler({
		calculateStickyState,
		isSticky,
		onStickyChange,
		setIsSticky,
		enabledRef: refs.enabledRef,
	});

	useScrollEffect({
		enabled,
		container,
		elementRef: refs.elementRef,
		initialPositionRef: refs.initialPositionRef,
		handleScroll,
	});

	return {
		isSticky,
		elementRef: refs.elementRef,
		handleScroll,
	};
}
