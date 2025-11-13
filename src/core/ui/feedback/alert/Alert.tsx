import {
	AlertContent,
	AlertDismissButton,
	AlertIcon,
} from '@core/ui/feedback/alert/components/AlertComponents';
import {
	ALERT_BASE_CLASSES,
	ALERT_INTENT_STYLES,
} from '@core/ui/feedback/alert/constants/Alert.constants';
import { getDefaultRole } from '@core/ui/feedback/alert/helpers/Alert.helpers';
import type { AlertProps } from '@core/ui/feedback/alert/types/Alert.types';
import { classNames } from '@core/utils/classNames';

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
