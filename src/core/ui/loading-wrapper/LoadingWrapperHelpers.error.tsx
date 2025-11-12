import { ARIA_LIVE } from '@core/constants/aria';
import Button from '@core/ui/button/Button';
import Text from '@core/ui/text/Text';
import { classNames } from '@core/utils/classNames';
import type { ReactNode } from 'react';

/**
 * Render error state content
 */
export function renderErrorContent(error: Error | string | ReactNode): ReactNode {
	if (typeof error === 'string') {
		return (
			<Text size="sm" className="text-red-600 dark:text-red-400">
				{error}
			</Text>
		);
	}
	if (error instanceof Error) {
		return (
			<Text size="sm" className="text-red-600 dark:text-red-400">
				{error.message || 'An error occurred'}
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
			{renderErrorContent(error)}
			{onRetry ? (
				<Button variant="secondary" size="sm" onClick={onRetry}>
					Retry
				</Button>
			) : null}
		</div>
	);
}
