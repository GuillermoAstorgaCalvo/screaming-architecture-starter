import { classNames } from '@core/utils/classNames';

import { TOAST_INTENT_STYLES } from './toast.constants';
import type { ToastIntent } from './toast.types';

export const getDefaultRole = (intent: ToastIntent): 'status' | 'alert' =>
	intent === 'error' ? 'alert' : 'status';

export const getAriaLive = (role: 'status' | 'alert'): 'assertive' | 'polite' =>
	role === 'alert' ? 'assertive' : 'polite';

export const getToastClassName = (intent: ToastIntent, className?: string): string =>
	classNames(
		'pointer-events-auto min-w-[18rem] max-w-sm rounded-lg border px-4 py-3 shadow-lg ring-1 ring-black/5 transition-all duration-200 focus-visible:outline-none',
		TOAST_INTENT_STYLES[intent],
		className
	);
