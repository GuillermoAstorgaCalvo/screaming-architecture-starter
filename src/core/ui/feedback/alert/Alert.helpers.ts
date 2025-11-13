import type { ReactNode } from 'react';

import { ALERT_ICON_PATHS } from './Alert.constants';
import type { AlertIntent } from './Alert.types';

export function getDefaultRole(intent: AlertIntent): 'alert' | 'status' {
	return intent === 'error' || intent === 'warning' ? 'alert' : 'status';
}

export function getDefaultIcon(intent: AlertIntent): ReactNode {
	return ALERT_ICON_PATHS[intent];
}
