import { buildDismissParams, type UseToastConfigParams } from './toast.dismiss.builders';
import { getDefaultRole } from './toast.utils';
import { useToastDismiss, type UseToastDismissReturn } from './useToastDismiss';

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
