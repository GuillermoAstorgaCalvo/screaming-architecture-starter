import { UI_TIMEOUTS } from '@core/constants/timeouts';
import { HoverCardWrapper } from '@core/ui/overlays/hover-card/components/HoverCardWrapper';
import { useHoverCard } from '@core/ui/overlays/hover-card/hooks/useHoverCard';
import type { HoverCardProps } from '@src-types/ui/overlays/floating';
import { type ReactNode, useId, useState } from 'react';

interface UseHoverCardStateOptions {
	readonly delay: number;
	readonly hideDelay: number;
	readonly disabled: boolean;
}

function useHoverCardState({ delay, hideDelay, disabled }: UseHoverCardStateOptions) {
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

interface BuildWrapperPropsOptions {
	readonly hoverCardId: string;
	readonly className: string | undefined;
	readonly handleMouseEnter: () => void;
	readonly handleMouseLeave: () => void;
	readonly handleFocus: () => void;
	readonly handleBlur: () => void;
	readonly isVisible: boolean;
	readonly position: HoverCardProps['position'];
	readonly content: ReactNode;
	readonly contentClassName: string | undefined;
	readonly showArrow: boolean;
}

function buildWrapperProps({
	hoverCardId,
	className,
	handleMouseEnter,
	handleMouseLeave,
	handleFocus,
	handleBlur,
	isVisible,
	position,
	content,
	contentClassName,
	showArrow,
}: BuildWrapperPropsOptions) {
	return {
		hoverCardId,
		className,
		handleMouseEnter,
		handleMouseLeave,
		handleFocus,
		handleBlur,
		isVisible,
		position,
		content,
		showArrow,
		...(contentClassName !== undefined && { contentClassName }),
	};
}

interface RenderHoverCardOptions {
	readonly hoverCardId: string;
	readonly className: string | undefined;
	readonly handleMouseEnter: () => void;
	readonly handleMouseLeave: () => void;
	readonly handleFocus: () => void;
	readonly handleBlur: () => void;
	readonly isVisible: boolean;
	readonly position: HoverCardProps['position'];
	readonly content: ReactNode;
	readonly contentClassName: string | undefined;
	readonly showArrow: boolean;
	readonly children: ReactNode;
}

function renderHoverCard(options: RenderHoverCardOptions) {
	return (
		<HoverCardWrapper
			{...buildWrapperProps({
				hoverCardId: options.hoverCardId,
				className: options.className,
				handleMouseEnter: options.handleMouseEnter,
				handleMouseLeave: options.handleMouseLeave,
				handleFocus: options.handleFocus,
				handleBlur: options.handleBlur,
				isVisible: options.isVisible,
				position: options.position,
				content: options.content,
				contentClassName: options.contentClassName,
				showArrow: options.showArrow,
			})}
		>
			{options.children}
		</HoverCardWrapper>
	);
}

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
	if (disabled) return children;
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
