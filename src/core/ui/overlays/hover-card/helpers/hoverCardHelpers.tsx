import { HoverCardWrapper } from '@core/ui/overlays/hover-card/components/HoverCardWrapper';
import type { HoverCardProps } from '@src-types/ui/overlays/floating';
import type { ReactNode } from 'react';

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

export function buildWrapperProps({
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

export function renderHoverCard(options: RenderHoverCardOptions) {
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
