import { UI_TIMEOUTS } from '@core/constants/timeouts';

import type { ToastProps } from './toast.types';
import type { UseToastDismissParams } from './useToastDismiss';

export interface BuildDismissParamsInput {
	readonly isOpen: boolean;
	readonly autoDismiss: boolean;
	readonly dismissAfter: number;
	readonly pauseOnHover: boolean;
	readonly onDismiss?: (() => void) | undefined;
}

export function buildDismissParams(props: BuildDismissParamsInput): UseToastDismissParams {
	const { isOpen, autoDismiss, dismissAfter, pauseOnHover, onDismiss } = props;
	return {
		isOpen,
		autoDismiss,
		dismissAfter,
		pauseOnHover,
		...(onDismiss !== undefined && { onDismiss }),
	};
}

export interface ExtractDismissConfigParams {
	readonly intent?: ToastProps['intent'] | undefined;
	readonly isOpen: boolean;
	readonly onDismiss?: (() => void) | undefined;
	readonly autoDismiss?: boolean | undefined;
	readonly dismissAfter?: number | undefined;
	readonly pauseOnHover?: boolean | undefined;
	readonly role?: ToastProps['role'] | undefined;
}

export interface UseToastConfigParams {
	readonly intent: ToastProps['intent'];
	readonly role: ToastProps['role'];
	readonly isOpen: boolean;
	readonly autoDismiss: boolean;
	readonly dismissAfter: number;
	readonly pauseOnHover: boolean;
	readonly onDismiss?: (() => void) | undefined;
}

export function extractDismissConfig(props: ExtractDismissConfigParams): UseToastConfigParams {
	return {
		intent: props.intent ?? 'info',
		role: props.role,
		isOpen: props.isOpen,
		autoDismiss: props.autoDismiss ?? true,
		dismissAfter: props.dismissAfter ?? UI_TIMEOUTS.TOAST_DELAY,
		pauseOnHover: props.pauseOnHover ?? true,
		onDismiss: props.onDismiss,
	};
}
