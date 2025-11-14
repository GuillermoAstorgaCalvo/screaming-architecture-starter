import { ARIA_LABELS, ARIA_LIVE } from '@core/constants/aria';
import { useTranslation } from '@core/i18n/useTranslation';
import Button from '@core/ui/button/Button';
import Spinner from '@core/ui/spinner/Spinner';
import Text from '@core/ui/text/Text';
import {
	getEndMessageClasses,
	getErrorContainerClasses,
	getLoadingContainerClasses,
} from '@core/ui/utilities/infinite-scroll/helpers/InfiniteScrollHelpers';
import type { ReactNode } from 'react';

/**
 * Default loading component
 */
export function DefaultLoadingComponent({ loadingText }: Readonly<{ loadingText?: string }>) {
	return (
		<div className={getLoadingContainerClasses()}>
			<Spinner size="md" aria-label={ARIA_LABELS.LOADING} />
			{loadingText ? (
				<Text size="sm" className="ml-2 text-text-muted">
					{loadingText}
				</Text>
			) : null}
		</div>
	);
}

/**
 * Default end message component
 */
export function DefaultEndMessage({ endMessage }: Readonly<{ endMessage?: ReactNode }>) {
	if (!endMessage) {
		return null;
	}

	return (
		<div className={getEndMessageClasses()} aria-live={ARIA_LIVE.POLITE}>
			{typeof endMessage === 'string' ? (
				<Text size="sm" className="text-text-muted">
					{endMessage}
				</Text>
			) : (
				endMessage
			)}
		</div>
	);
}

/**
 * Default error component
 */
export function DefaultErrorComponent({
	errorMessage,
	onRetry,
}: Readonly<{
	errorMessage?: ReactNode;
	onRetry?: (() => void) | undefined;
}>) {
	const { t } = useTranslation('common');

	let errorContent: ReactNode;
	if (errorMessage === undefined) {
		errorContent = (
			<Text size="sm" className="text-destructive">
				{t('failedToLoadMoreItems')}
			</Text>
		);
	} else if (typeof errorMessage === 'string') {
		errorContent = (
			<Text size="sm" className="text-destructive">
				{errorMessage}
			</Text>
		);
	} else {
		errorContent = errorMessage;
	}

	return (
		<div className={getErrorContainerClasses()} role="alert" aria-live={ARIA_LIVE.ASSERTIVE}>
			{errorContent}
			{onRetry !== undefined && (
				<Button variant="secondary" size="sm" onClick={onRetry}>
					{t('retry')}
				</Button>
			)}
		</div>
	);
}
