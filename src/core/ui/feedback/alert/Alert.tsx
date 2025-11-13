import { classNames } from '@core/utils/classNames';

import { ALERT_BASE_CLASSES, ALERT_INTENT_STYLES } from './Alert.constants';
import { getDefaultRole } from './Alert.helpers';
import type { AlertProps } from './Alert.types';
import { AlertContent, AlertDismissButton, AlertIcon } from './AlertComponents';

export default function Alert({
	intent = 'info',
	title,
	description,
	children,
	icon,
	className,
	action,
	onDismiss,
	dismissLabel = 'Dismiss notification',
	role,
}: Readonly<AlertProps>) {
	const contentProps = {
		...(title !== undefined && { title }),
		...(description !== undefined && { description }),
		...(action !== undefined && { action }),
	};

	return (
		<div
			role={role ?? getDefaultRole(intent)}
			className={classNames(ALERT_BASE_CLASSES, ALERT_INTENT_STYLES[intent], className)}
		>
			<AlertIcon intent={intent} icon={icon} />
			<AlertContent {...contentProps}>{children}</AlertContent>
			{onDismiss ? <AlertDismissButton onDismiss={onDismiss} dismissLabel={dismissLabel} /> : null}
		</div>
	);
}
