import { UI_TIMEOUTS } from '@core/constants/timeouts';
import { TooltipWrapper } from '@core/ui/overlays/tooltip/components/TooltipWrapper';
import { useTooltip } from '@core/ui/overlays/tooltip/hooks/useTooltip';
import type { TooltipProps } from '@src-types/ui/overlays/floating';
import { useId, useState } from 'react';

interface UseTooltipStateOptions {
	readonly delay: number;
	readonly disabled: boolean;
}

function useTooltipState({ delay, disabled }: UseTooltipStateOptions) {
	const tooltipId = useId();
	const [isVisible, setIsVisible] = useState(false);
	const { handleMouseEnter, handleMouseLeave, handleFocus, handleBlur } = useTooltip({
		delay,
		setIsVisible,
		disabled,
	});
	return {
		tooltipId,
		isVisible,
		handleMouseEnter,
		handleMouseLeave,
		handleFocus,
		handleBlur,
	};
}

/**
 * Tooltip - Accessible tooltip component with positioning
 *
 * Features:
 * - Multiple positions: top, bottom, left, right
 * - Configurable delay
 * - Keyboard accessible
 * - Screen reader support
 * - Dark mode support
 * - Automatic positioning
 *
 * @example
 * ```tsx
 * <Tooltip content="This is a tooltip">
 *   <button>Hover me</button>
 * </Tooltip>
 * ```
 *
 * @example
 * ```tsx
 * <Tooltip content="Info" position="bottom" delay={300}>
 *   <IconButton icon={<InfoIcon />} aria-label="Info" />
 * </Tooltip>
 * ```
 */
export default function Tooltip({
	children,
	content,
	position = 'top',
	delay = UI_TIMEOUTS.TOOLTIP_DELAY,
	disabled = false,
	className,
}: Readonly<TooltipProps>) {
	const { tooltipId, isVisible, handleMouseEnter, handleMouseLeave, handleFocus, handleBlur } =
		useTooltipState({ delay, disabled });

	if (disabled) {
		return children;
	}

	return (
		<TooltipWrapper
			tooltipId={tooltipId}
			className={className}
			handleMouseEnter={handleMouseEnter}
			handleMouseLeave={handleMouseLeave}
			handleFocus={handleFocus}
			handleBlur={handleBlur}
			isVisible={isVisible}
			position={position}
			content={content}
		>
			{children}
		</TooltipWrapper>
	);
}
