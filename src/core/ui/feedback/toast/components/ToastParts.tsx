import Button from '@core/ui/button/Button';
import {
	TOAST_ICON_STYLES,
	TOAST_ICON_SYMBOL,
} from '@core/ui/feedback/toast/constants/toast.constants';
import { getAriaLive, getToastClassName } from '@core/ui/feedback/toast/helpers/toast.utils';
import type {
	ToastBodyProps,
	ToastContainerProps,
	ToastContentProps,
	ToastDismissButtonProps,
	ToastIconProps,
} from '@core/ui/feedback/toast/types/toast.types';
import IconButton from '@core/ui/icon-button/IconButton';
import Text from '@core/ui/text/Text';
import { classNames } from '@core/utils/classNames';

export function ToastIcon({ intent }: Readonly<ToastIconProps>) {
	return (
		<span
			aria-hidden
			className={classNames(
				'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold',
				TOAST_ICON_STYLES[intent]
			)}
		>
			{TOAST_ICON_SYMBOL[intent]}
		</span>
	);
}

function ToastActionButton({
	action,
}: {
	readonly action: NonNullable<ToastContentProps['action']>;
}) {
	return (
		<div className="pt-1">
			<Button
				type="button"
				size="sm"
				variant={action.variant ?? 'secondary'}
				onClick={action.onClick}
				className="inline-flex items-center gap-2"
			>
				{action.icon ? <span aria-hidden>{action.icon}</span> : null}
				{action.label}
			</Button>
		</div>
	);
}

export function ToastContent({
	title,
	description,
	children,
	action,
}: Readonly<ToastContentProps>) {
	return (
		<div className="flex flex-1 flex-col gap-1 text-sm">
			{title ? <strong className="font-semibold leading-snug">{title}</strong> : null}
			{description ? (
				<Text size="sm" className="leading-snug opacity-90">
					{description}
				</Text>
			) : null}
			{children}
			{action ? <ToastActionButton action={action} /> : null}
		</div>
	);
}

export function ToastDismissButton({ onDismiss, dismissLabel }: Readonly<ToastDismissButtonProps>) {
	return (
		<IconButton
			variant="ghost"
			size="sm"
			icon={
				<svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden>
					<path
						fillRule="evenodd"
						d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
						clipRule="evenodd"
					/>
				</svg>
			}
			aria-label={dismissLabel}
			onClick={onDismiss}
		/>
	);
}

export function ToastContainer({
	id,
	role,
	intent,
	className,
	onMouseEnter,
	onMouseLeave,
	children,
}: Readonly<ToastContainerProps>) {
	return (
		// Toast container div handles mouse events for hover detection (pausing auto-dismiss on hover).
		// The container itself is not interactive; interaction is via the dismiss button.
		// eslint-disable-next-line jsx-a11y/no-static-element-interactions -- Container div for hover detection, not interactive itself
		<div
			id={id}
			role={role}
			aria-live={getAriaLive(role)}
			className={getToastClassName(intent, className)}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
		>
			{children}
		</div>
	);
}

export function ToastBody({
	intent,
	title,
	description,
	children,
	action,
	onDismiss,
	dismissLabel,
}: Readonly<ToastBodyProps>) {
	return (
		<div className="flex items-start gap-3">
			<ToastIcon intent={intent} />
			<ToastContent title={title} description={description} action={action}>
				{children}
			</ToastContent>
			{onDismiss ? <ToastDismissButton onDismiss={onDismiss} dismissLabel={dismissLabel} /> : null}
		</div>
	);
}
