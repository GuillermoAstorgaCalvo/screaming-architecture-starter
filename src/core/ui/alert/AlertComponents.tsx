import Button from '@core/ui/button/Button';
import Heading from '@core/ui/heading/Heading';
import IconButton from '@core/ui/icon-button/IconButton';
import Text from '@core/ui/text/Text';
import { classNames } from '@core/utils/classNames';
import type { ReactNode } from 'react';

import { ALERT_INTENT_ICON_STYLES, DISMISS_ICON } from './Alert.constants';
import { getDefaultIcon } from './Alert.helpers';
import type { AlertAction, AlertIntent } from './Alert.types';

interface AlertIconProps {
	readonly intent: AlertIntent;
	readonly icon?: ReactNode;
}

export function AlertIcon({ intent, icon }: Readonly<AlertIconProps>) {
	return (
		<div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
			{icon ?? (
				<span
					aria-hidden
					className={classNames(
						'flex h-5 w-5 items-center justify-center',
						ALERT_INTENT_ICON_STYLES[intent]
					)}
				>
					<svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
						{getDefaultIcon(intent)}
					</svg>
				</span>
			)}
		</div>
	);
}

interface AlertActionButtonProps {
	readonly action: AlertAction;
}

export function AlertActionButton({ action }: Readonly<AlertActionButtonProps>) {
	return (
		<div className="pt-2">
			<Button
				size="sm"
				variant={action.variant ?? 'primary'}
				className="inline-flex items-center gap-2"
				type="button"
				onClick={action.onClick}
			>
				{action.icon ? <span aria-hidden>{action.icon}</span> : null}
				{action.label}
			</Button>
		</div>
	);
}

interface AlertContentProps {
	readonly title?: string;
	readonly description?: string | ReactNode;
	readonly children?: ReactNode;
	readonly action?: AlertAction;
}

export function AlertContent({
	title,
	description,
	children,
	action,
}: Readonly<AlertContentProps>) {
	return (
		<div className="flex flex-1 flex-col gap-1 text-sm">
			{title ? (
				<Heading as="h6" size="sm" className="font-semibold">
					{title}
				</Heading>
			) : null}
			{description ? (
				<Text size="sm" className="leading-snug opacity-90">
					{description}
				</Text>
			) : null}
			{children}
			{action ? <AlertActionButton action={action} /> : null}
		</div>
	);
}

interface AlertDismissButtonProps {
	readonly onDismiss: () => void;
	readonly dismissLabel: string;
}

export function AlertDismissButton({ onDismiss, dismissLabel }: Readonly<AlertDismissButtonProps>) {
	return (
		<IconButton
			variant="ghost"
			size="sm"
			icon={DISMISS_ICON}
			aria-label={dismissLabel}
			onClick={onDismiss}
			className="text-current/70 hover:text-current"
		/>
	);
}
