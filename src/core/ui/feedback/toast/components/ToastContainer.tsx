import type { ToastItem } from '@core/providers/toast/ToastContext';
import { useToast } from '@core/providers/toast/useToast';
import Toast from '@core/ui/feedback/toast/Toast';
import type { ToastAction } from '@core/ui/feedback/toast/types/toast.types';
import { classNames } from '@core/utils/classNames';
import { type ReactNode, useEffect, useState } from 'react';

export interface ToastContainerProps {
	readonly position?:
		| 'top-left'
		| 'top-center'
		| 'top-right'
		| 'bottom-left'
		| 'bottom-center'
		| 'bottom-right';
	readonly className?: string;
}

const POSITION_CLASSES = {
	'top-left': 'top-4 left-4',
	'top-center': 'top-4 left-1/2 -translate-x-1/2',
	'top-right': 'top-4 right-4',
	'bottom-left': 'bottom-4 left-4',
	'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
	'bottom-right': 'bottom-4 right-4',
} as const;

interface ToastItemProps {
	readonly toast: ToastItem;
	readonly onDismiss: () => void;
}

interface ToastPropsForComponent {
	id: string;
	intent: 'info' | 'success' | 'warning' | 'error';
	isOpen: true;
	onDismiss: () => void;
	title?: string;
	description?: string | ReactNode;
	className?: string;
	dismissLabel?: string;
	autoDismiss?: boolean;
	dismissAfter?: number;
	pauseOnHover?: boolean;
	action?: ToastAction;
	role?: 'status' | 'alert';
	children?: ReactNode;
}

function assignIfDefined<T extends keyof ToastItem>(
	props: ToastPropsForComponent,
	toast: ToastItem,
	key: T
): void {
	const value = toast[key];
	if (value !== undefined) {
		props[key as keyof ToastPropsForComponent] = value as never;
	}
}

function buildToastProps(toast: ToastItem, onDismiss: () => void): ToastPropsForComponent {
	const props: ToastPropsForComponent = {
		id: toast.id,
		intent: toast.intent ?? 'info',
		isOpen: true,
		onDismiss,
	};

	assignIfDefined(props, toast, 'title');
	assignIfDefined(props, toast, 'description');
	assignIfDefined(props, toast, 'className');
	assignIfDefined(props, toast, 'dismissLabel');
	assignIfDefined(props, toast, 'autoDismiss');
	assignIfDefined(props, toast, 'dismissAfter');
	assignIfDefined(props, toast, 'pauseOnHover');
	assignIfDefined(props, toast, 'action');
	assignIfDefined(props, toast, 'role');
	assignIfDefined(props, toast, 'children');

	return props;
}

function ToastItemRenderer({ toast, onDismiss }: Readonly<ToastItemProps>) {
	return <Toast {...buildToastProps(toast, onDismiss)} />;
}

/**
 * ToastContainer - Renders a queue of toast notifications
 *
 * Displays toasts from the ToastProvider queue with automatic stacking,
 * positioning, and dismissal. Should be placed once in the app layout.
 *
 * @example
 * ```tsx
 * <ToastContainer position="top-right" />
 * ```
 */
export default function ToastContainer({
	position = 'top-right',
	className,
}: Readonly<ToastContainerProps>) {
	const { toasts, dismiss } = useToast();
	const [visibleToasts, setVisibleToasts] = useState<readonly ToastItem[]>([]);

	useEffect(() => {
		setVisibleToasts(toasts);
	}, [toasts]);

	if (visibleToasts.length === 0) {
		return null;
	}

	return (
		<section
			className={classNames(
				'pointer-events-none fixed z-50 flex flex-col gap-2',
				POSITION_CLASSES[position],
				className
			)}
			aria-label="Notifications"
			aria-live="polite"
		>
			{visibleToasts.map(toast => (
				<ToastItemRenderer key={toast.id} toast={toast} onDismiss={() => dismiss(toast.id)} />
			))}
		</section>
	);
}
