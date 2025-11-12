import { extractDismissConfig } from './toast.dismiss.builders';
import { extractRenderProps, type UseToastDataRenderProps } from './toast.props.builders';
import type { ToastProps } from './toast.types';
import { useToastConfig } from './useToastConfig';

export interface UseToastDataReturn {
	readonly isOpen: boolean;
	readonly renderProps: UseToastDataRenderProps;
}

export function useToastData(props: Readonly<ToastProps>): UseToastDataReturn {
	const dismissConfig = extractDismissConfig({
		intent: props.intent,
		isOpen: props.isOpen,
		onDismiss: props.onDismiss,
		autoDismiss: props.autoDismiss,
		dismissAfter: props.dismissAfter,
		pauseOnHover: props.pauseOnHover,
		role: props.role,
	});
	const { accessibleRole, dismissHandlers } = useToastConfig(dismissConfig);
	const dismissLabel = props.dismissLabel ?? 'Dismiss notification';
	return {
		isOpen: dismissConfig.isOpen,
		renderProps: extractRenderProps({
			...props,
			dismissLabel,
			accessibleRole,
			dismissHandlers,
		}),
	};
}
