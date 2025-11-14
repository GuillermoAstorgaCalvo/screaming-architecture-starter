import { useHoverCard } from '@core/ui/overlays/hover-card/hooks/useHoverCard';
import { useId, useState } from 'react';

interface UseHoverCardStateOptions {
	readonly delay: number;
	readonly hideDelay: number;
	readonly disabled: boolean;
}

export interface UseHoverCardStateReturn {
	readonly hoverCardId: string;
	readonly isVisible: boolean;
	readonly handleMouseEnter: () => void;
	readonly handleMouseLeave: () => void;
	readonly handleFocus: () => void;
	readonly handleBlur: () => void;
}

export function useHoverCardState({
	delay,
	hideDelay,
	disabled,
}: UseHoverCardStateOptions): UseHoverCardStateReturn {
	const hoverCardId = useId();
	const [isVisible, setIsVisible] = useState(false);
	const { handleMouseEnter, handleMouseLeave, handleFocus, handleBlur } = useHoverCard({
		delay,
		hideDelay,
		setIsVisible,
		disabled,
	});
	return {
		hoverCardId,
		isVisible,
		handleMouseEnter,
		handleMouseLeave,
		handleFocus,
		handleBlur,
	};
}
