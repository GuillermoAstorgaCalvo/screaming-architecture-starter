import type { ReactNode } from 'react';

import type { ToastProps } from './toast.types';
import type { UseToastDismissReturn } from './useToastDismiss';

export interface BuildToastContainerPropsParams {
	readonly id?: string | undefined;
	readonly role: 'status' | 'alert';
	readonly intent: ToastProps['intent'];
	readonly className?: string | undefined;
	readonly dismissHandlers: UseToastDismissReturn;
}

export function buildToastContainerProps({
	id,
	role,
	intent = 'info',
	className,
	dismissHandlers,
}: BuildToastContainerPropsParams) {
	return {
		id,
		role,
		intent,
		className,
		onMouseEnter: dismissHandlers.handleMouseEnter,
		onMouseLeave: dismissHandlers.handleMouseLeave,
	};
}

export interface BuildToastBodyPropsParams {
	readonly intent: ToastProps['intent'];
	readonly title?: string | undefined;
	readonly description?: string | ReactNode | undefined;
	readonly children?: ReactNode | undefined;
	readonly action?: ToastProps['action'] | undefined;
	readonly dismissHandlers: UseToastDismissReturn;
	readonly dismissLabel: string;
}

export function buildToastBodyProps({
	intent = 'info',
	title,
	description,
	children,
	action,
	dismissHandlers,
	dismissLabel,
}: BuildToastBodyPropsParams) {
	return {
		intent,
		title,
		description,
		action,
		onDismiss: dismissHandlers.handleDismiss,
		dismissLabel,
		children,
	};
}

export interface ExtractRenderPropsParams extends ToastProps {
	readonly dismissLabel: string;
	readonly accessibleRole: 'status' | 'alert';
	readonly dismissHandlers: UseToastDismissReturn;
}

export interface UseToastDataRenderProps {
	readonly id?: string | undefined;
	readonly intent: ToastProps['intent'];
	readonly title?: string | undefined;
	readonly description?: string | ReactNode | undefined;
	readonly children?: ReactNode | undefined;
	readonly className?: string | undefined;
	readonly action?: ToastProps['action'] | undefined;
	readonly dismissLabel: string;
	readonly accessibleRole: 'status' | 'alert';
	readonly dismissHandlers: UseToastDismissReturn;
}

export function extractRenderProps(props: ExtractRenderPropsParams): UseToastDataRenderProps {
	return {
		id: props.id,
		intent: props.intent ?? 'info',
		title: props.title,
		description: props.description,
		children: props.children,
		className: props.className,
		action: props.action,
		dismissLabel: props.dismissLabel,
		accessibleRole: props.accessibleRole,
		dismissHandlers: props.dismissHandlers,
	};
}
