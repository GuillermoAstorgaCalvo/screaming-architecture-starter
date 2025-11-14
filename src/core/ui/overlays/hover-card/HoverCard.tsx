import { UI_TIMEOUTS } from '@core/constants/timeouts';
import { renderHoverCard } from '@core/ui/overlays/hover-card/helpers/hoverCardHelpers';
import { useHoverCardState } from '@core/ui/overlays/hover-card/hooks/useHoverCardState';
import type { HoverCardProps } from '@src-types/ui/overlays/floating';

/**
 * HoverCard - Accessible hover card component that shows card content on hover
 *
 * Features:
 * - Multiple positions: top, bottom, left, right
 * - Configurable show/hide delays
 * - Keyboard accessible
 * - Screen reader support
 * - Dark mode support
 * - Automatic positioning
 * - Optional arrow pointing to trigger
 * - Rich card-style content
 *
 * @example
 * ```tsx
 * <HoverCard content={<div>Card content here</div>}>
 *   <button>Hover me</button>
 * </HoverCard>
 * ```
 *
 * @example
 * ```tsx
 * <HoverCard
 *   content={
 *     <div className="p-4">
 *       <h3>User Profile</h3>
 *       <p>User information here</p>
 *     </div>
 *   }
 *   position="bottom"
 *   delay={300}
 *   showArrow
 * >
 *   <span className="underline">@username</span>
 * </HoverCard>
 * ```
 */
export default function HoverCard({
	children,
	content,
	position = 'top',
	delay = UI_TIMEOUTS.TOOLTIP_DELAY,
	hideDelay = 100,
	disabled = false,
	className,
	contentClassName,
	showArrow = true,
}: Readonly<HoverCardProps>) {
	const state = useHoverCardState({ delay, hideDelay, disabled });

	if (disabled) {
		return children;
	}

	return renderHoverCard({
		hoverCardId: state.hoverCardId,
		className,
		handleMouseEnter: state.handleMouseEnter,
		handleMouseLeave: state.handleMouseLeave,
		handleFocus: state.handleFocus,
		handleBlur: state.handleBlur,
		isVisible: state.isVisible,
		position,
		content,
		contentClassName,
		showArrow,
		children,
	});
}
