import { TOAST_INTENT_STYLES } from '@core/ui/feedback/toast/constants/toast.constants';
import type { ToastIntent } from '@core/ui/feedback/toast/types/toast.types';
import { classNames } from '@core/utils/classNames';

export const getDefaultRole = (intent: ToastIntent): 'status' | 'alert' =>
	intent === 'error' ? 'alert' : 'status';

export const getAriaLive = (role: 'status' | 'alert'): 'assertive' | 'polite' =>
	role === 'alert' ? 'assertive' : 'polite';

export const getToastClassName = (intent: ToastIntent, className?: string): string =>
	classNames(
		'pointer-events-auto rounded-lg border px-lg py-md shadow-lg ring-1 ring-black/5 transition-all duration-normal focus-visible:outline-none',
		TOAST_INTENT_STYLES[intent],
		className
	);
