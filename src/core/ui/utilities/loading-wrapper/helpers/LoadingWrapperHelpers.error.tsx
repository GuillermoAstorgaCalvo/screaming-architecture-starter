import { ARIA_LIVE } from '@core/constants/aria';
import i18n from '@core/i18n/i18n';
import Button from '@core/ui/button/Button';
import Text from '@core/ui/text/Text';
import { classNames } from '@core/utils/classNames';
import type { ReactNode } from 'react';

/**
 * Render error state content
 * @param error - Error to render
 * @param defaultErrorMessage - Default error message if error has no message
 */
export function renderErrorContent(
	error: Error | string | ReactNode,
	defaultErrorMessage?: string
): ReactNode {
	if (typeof error === 'string') {
		return (
			<Text size="sm" className="text-destructive dark:text-destructive">
				{error}
			</Text>
		);
	}
	if (error instanceof Error) {
		const t = (key: string) => i18n.t(key, { ns: 'common' });
		return (
			<Text size="sm" className="text-destructive dark:text-destructive">
				{error.message || (defaultErrorMessage ?? t('anErrorOccurred'))}
			</Text>
		);
	}
	return error;
}

type ErrorStateProps = Readonly<{
	error: Error | string | ReactNode;
	errorComponent?: ReactNode;
	onRetry?: (() => void) | undefined;
	className?: string;
	props: Readonly<Record<string, unknown>>;
}>;

/**
 * Render error state
 */
export function renderErrorState({
	error,
	errorComponent,
	onRetry,
	className,
	props,
}: ErrorStateProps) {
	const t = (key: string) => i18n.t(key, { ns: 'common' });

	if (errorComponent) {
		return (
			<div className={className} {...props}>
				{errorComponent}
			</div>
		);
	}

	return (
		<div
			className={classNames('flex flex-col items-center justify-center py-8 gap-3', className)}
			role="alert"
			aria-live={ARIA_LIVE.ASSERTIVE}
			{...props}
		>
			{renderErrorContent(error, t('anErrorOccurred'))}
			{onRetry ? (
				<Button variant="secondary" size="sm" onClick={onRetry}>
					{t('retry')}
				</Button>
			) : null}
		</div>
	);
}
