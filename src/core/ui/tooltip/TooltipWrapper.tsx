import type { TooltipProps } from '@src-types/ui/overlays';
import { cloneElement, isValidElement, type ReactElement, type ReactNode } from 'react';

import { TooltipContent } from './TooltipContent';

interface AttachHandlersOptions {
	readonly children: ReactNode;
	readonly tooltipId: string;
	readonly handleFocus: () => void;
	readonly handleBlur: () => void;
}

function attachHandlersToChild({
	children,
	tooltipId,
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
		'aria-describedby': tooltipId,
	} as Partial<Record<string, unknown>>);
}

interface BuildWrapperContentOptions {
	readonly tooltipId: string;
	readonly isVisible: boolean;
	readonly position: TooltipProps['position'];
	readonly content: ReactNode;
}

function buildWrapperContent({
	tooltipId,
	isVisible,
	position,
	content,
}: BuildWrapperContentOptions) {
	return isVisible ? (
		<TooltipContent tooltipId={tooltipId} position={position} content={content} />
	) : null;
}

interface TooltipWrapperProps {
	readonly tooltipId: string;
	readonly className?: string | undefined;
	readonly handleMouseEnter: () => void;
	readonly handleMouseLeave: () => void;
	readonly handleFocus: () => void;
	readonly handleBlur: () => void;
	readonly children: ReactNode;
	readonly isVisible: boolean;
	readonly position: TooltipProps['position'];
	readonly content: ReactNode;
}

export function TooltipWrapper({
	tooltipId,
	className,
	handleMouseEnter,
	handleMouseLeave,
	handleFocus,
	handleBlur,
	children,
	isVisible,
	position,
	content,
}: Readonly<TooltipWrapperProps>) {
	const childWithHandlers = attachHandlersToChild({
		children,
		tooltipId,
		handleFocus,
		handleBlur,
	});

	const tooltipContent = buildWrapperContent({ tooltipId, isVisible, position, content });

	return (
		// Tooltip wrapper div handles mouse events for hover (standard tooltip pattern).
		// Focus/blur events are properly attached to the child interactive element via cloneElement.
		// eslint-disable-next-line jsx-a11y/no-static-element-interactions -- Wrapper div for hover detection, not interactive itself
		<div
			className={`relative inline-block ${className ?? ''}`}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			{childWithHandlers}
			{tooltipContent}
		</div>
	);
}
