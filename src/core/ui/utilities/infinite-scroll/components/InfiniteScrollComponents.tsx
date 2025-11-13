import { ARIA_LABELS, ARIA_LIVE } from '@core/constants/aria';
import Button from '@core/ui/button/Button';
import Spinner from '@core/ui/spinner/Spinner';
import Text from '@core/ui/text/Text';
import type { ReactNode } from 'react';

import {
	getEndMessageClasses,
	getErrorContainerClasses,
	getLoadingContainerClasses,
} from './InfiniteScrollHelpers';

/**
 * Default loading component
 */
export function DefaultLoadingComponent({ loadingText }: Readonly<{ loadingText?: string }>) {
	return (
		<div className={getLoadingContainerClasses()}>
			<Spinner size="md" aria-label={ARIA_LABELS.LOADING} />
			{loadingText ? (
				<Text size="sm" className="ml-2 text-gray-500 dark:text-gray-400">
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
				<Text size="sm" className="text-gray-500 dark:text-gray-400">
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
	let errorContent: ReactNode;
	if (errorMessage === undefined) {
		errorContent = (
			<Text size="sm" className="text-red-600 dark:text-red-400">
				Failed to load more items
			</Text>
		);
	} else if (typeof errorMessage === 'string') {
		errorContent = (
			<Text size="sm" className="text-red-600 dark:text-red-400">
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
					Retry
				</Button>
			)}
		</div>
	);
}
