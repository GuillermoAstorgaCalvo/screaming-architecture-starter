import { extractDismissConfig } from '@core/ui/feedback/toast/helpers/toast.dismiss.builders';
import {
	extractRenderProps,
	type UseToastDataRenderProps,
} from '@core/ui/feedback/toast/helpers/toast.props.builders';
import { useToastConfig } from '@core/ui/feedback/toast/helpers/useToastConfig';
import type { ToastProps } from '@core/ui/feedback/toast/types/toast.types';

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
