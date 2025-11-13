import type { ReactNode } from 'react';

export type AlertIntent = 'info' | 'success' | 'warning' | 'error';

export interface AlertAction {
	readonly label: string;
	readonly onClick: () => void;
	readonly icon?: ReactNode;
	readonly variant?: 'primary' | 'secondary' | 'ghost';
}

export interface AlertProps {
	readonly intent?: AlertIntent;
	readonly title?: string;
	readonly description?: string | ReactNode;
	readonly children?: ReactNode;
	readonly icon?: ReactNode;
	readonly className?: string;
	readonly onDismiss?: () => void;
	readonly dismissLabel?: string;
	readonly role?: 'alert' | 'status';
	readonly action?: AlertAction;
}
