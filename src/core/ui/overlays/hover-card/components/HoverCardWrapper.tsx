import { HoverCardContent } from '@core/ui/overlays/hover-card/components/HoverCardContent';
import type { HoverCardProps } from '@src-types/ui/overlays/floating';
import { cloneElement, isValidElement, type ReactElement, type ReactNode } from 'react';

interface AttachHandlersOptions {
	readonly children: ReactNode;
	readonly hoverCardId: string;
	readonly handleFocus: () => void;
	readonly handleBlur: () => void;
}

function attachHandlersToChild({
	children,
	hoverCardId,
	handleFocus,
	handleBlur,
}: AttachHandlersOptions): ReactNode {
	if (!isValidElement(children)) {
		return children;
	}

	const child = children as ReactElement<Record<string, unknown>>;
	const existingProps = child.props as {
		onFocus?: (event: FocusEvent) => void;
		onBlur?: (event: FocusEvent) => void;
		'aria-describedby'?: string;
	};

	return cloneElement(child, {
		...existingProps,
		onFocus: (event: FocusEvent) => {
			handleFocus();
			existingProps.onFocus?.(event);
		},
		onBlur: (event: FocusEvent) => {
			handleBlur();
			existingProps.onBlur?.(event);
		},
		'aria-describedby': hoverCardId,
	} as Partial<Record<string, unknown>>);
}

interface BuildWrapperContentOptions {
	readonly hoverCardId: string;
	readonly isVisible: boolean;
	readonly position: HoverCardProps['position'];
	readonly content: ReactNode;
	readonly contentClassName?: string;
	readonly showArrow: boolean;
}

function buildWrapperContent({
	hoverCardId,
	isVisible,
	position,
	content,
	contentClassName,
	showArrow,
}: BuildWrapperContentOptions) {
	if (!isVisible) {
		return null;
	}

	return (
		<HoverCardContent
			hoverCardId={hoverCardId}
			position={position}
			content={content}
			{...(contentClassName !== undefined && { contentClassName })}
			showArrow={showArrow}
		/>
	);
}

interface HoverCardWrapperProps {
	readonly hoverCardId: string;
	readonly className?: string | undefined;
	readonly handleMouseEnter: () => void;
	readonly handleMouseLeave: () => void;
	readonly handleFocus: () => void;
	readonly handleBlur: () => void;
	readonly children: ReactNode;
	readonly isVisible: boolean;
	readonly position: HoverCardProps['position'];
	readonly content: ReactNode;
	readonly contentClassName?: string;
	readonly showArrow: boolean;
}

function renderHoverWrapper({
	className,
	handleMouseEnter,
	handleMouseLeave,
	childWithHandlers,
	hoverCardContent,
}: {
	readonly className?: string | undefined;
	readonly handleMouseEnter: () => void;
	readonly handleMouseLeave: () => void;
	readonly childWithHandlers: ReactNode;
	readonly hoverCardContent: ReactNode;
}) {
	// Wrapper div for hover detection; focus/blur attached to child via cloneElement.
	// The child element is the interactive element; this wrapper only handles mouse hover detection.
	// role="none" and tabIndex={-1} indicate this is a non-interactive structural container.
	return (
		<div
			className={`relative inline-block ${className ?? ''}`}
			role="none"
			tabIndex={-1}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			{childWithHandlers}
			{hoverCardContent}
		</div>
	);
}

function buildHoverCardContent(props: Readonly<HoverCardWrapperProps>) {
	const childWithHandlers = attachHandlersToChild({
		children: props.children,
		hoverCardId: props.hoverCardId,
		handleFocus: props.handleFocus,
		handleBlur: props.handleBlur,
	});
	const hoverCardContent = buildWrapperContent({
		hoverCardId: props.hoverCardId,
		isVisible: props.isVisible,
		position: props.position,
		content: props.content,
		...(props.contentClassName !== undefined && { contentClassName: props.contentClassName }),
		showArrow: props.showArrow,
	});
	return { childWithHandlers, hoverCardContent };
}

export function HoverCardWrapper(props: Readonly<HoverCardWrapperProps>) {
	const { childWithHandlers, hoverCardContent } = buildHoverCardContent(props);
	return renderHoverWrapper({
		className: props.className,
		handleMouseEnter: props.handleMouseEnter,
		handleMouseLeave: props.handleMouseLeave,
		childWithHandlers,
		hoverCardContent,
	});
}
