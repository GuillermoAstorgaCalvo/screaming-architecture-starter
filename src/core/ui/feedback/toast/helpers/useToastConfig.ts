import {
	buildDismissParams,
	type UseToastConfigParams,
} from '@core/ui/feedback/toast/helpers/toast.dismiss.builders';
import { getDefaultRole } from '@core/ui/feedback/toast/helpers/toast.utils';
import {
	useToastDismiss,
	type UseToastDismissReturn,
} from '@core/ui/feedback/toast/helpers/useToastDismiss';

export interface UseToastConfigReturn {
	readonly accessibleRole: 'status' | 'alert';
	readonly dismissHandlers: UseToastDismissReturn;
}

export function useToastConfig({
	intent = 'info',
	role,
	isOpen,
	autoDismiss,
	dismissAfter,
	pauseOnHover,
	onDismiss,
}: UseToastConfigParams): UseToastConfigReturn {
	const accessibleRole = role ?? getDefaultRole(intent);
	const dismissHandlers = useToastDismiss(
		buildDismissParams({ isOpen, autoDismiss, dismissAfter, pauseOnHover, onDismiss })
	);
	return { accessibleRole, dismissHandlers };
}
