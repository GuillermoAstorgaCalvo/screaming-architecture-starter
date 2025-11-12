import EmptyState from '@core/ui/empty-state/EmptyState';
import type { ReactNode } from 'react';

type EmptyStatePropsInput = Readonly<{
	emptyTitle: string;
	emptyDescription?: string;
	emptyMessage?: string;
	emptyActionLabel?: string;
	onEmptyAction?: (() => void) | undefined;
}>;

/**
 * Build empty state props
 */
export function buildEmptyStateProps({
	emptyTitle,
	emptyDescription,
	emptyMessage,
	emptyActionLabel,
	onEmptyAction,
}: EmptyStatePropsInput) {
	const props: {
		title: string;
		description?: string;
		actionLabel?: string;
		onAction?: () => void;
	} = {
		title: emptyTitle,
	};

	const description = emptyDescription ?? emptyMessage;
	if (description) {
		props.description = description;
	}
	if (emptyActionLabel) {
		props.actionLabel = emptyActionLabel;
	}
	if (onEmptyAction) {
		props.onAction = onEmptyAction;
	}

	return props;
}

type EmptyStateWithStringProps = Readonly<{
	emptyMessage: string;
	emptyTitle: string;
	emptyDescription?: string;
	emptyActionLabel?: string;
	onEmptyAction?: (() => void) | undefined;
	className?: string;
	props: Readonly<Record<string, unknown>>;
}>;

/**
 * Render empty state with string message
 */
export function renderEmptyStateWithString({
	emptyMessage,
	emptyTitle,
	emptyDescription,
	emptyActionLabel,
	onEmptyAction,
	className,
	props,
}: EmptyStateWithStringProps) {
	const emptyStateProps = buildEmptyStateProps({
		emptyTitle,
		...(emptyDescription && { emptyDescription }),
		emptyMessage,
		...(emptyActionLabel && { emptyActionLabel }),
		...(onEmptyAction && { onEmptyAction }),
	});
	return (
		<div className={className} {...props}>
			<EmptyState {...emptyStateProps} />
		</div>
	);
}

type EmptyStateProps = Readonly<{
	emptyMessage?: string | ReactNode;
	emptyTitle: string;
	emptyDescription?: string;
	emptyActionLabel?: string;
	onEmptyAction?: (() => void) | undefined;
	className?: string;
	props: Readonly<Record<string, unknown>>;
}>;

/**
 * Render empty state
 */
export function renderEmptyState({
	emptyMessage,
	emptyTitle,
	emptyDescription,
	emptyActionLabel,
	onEmptyAction,
	className,
	props,
}: EmptyStateProps) {
	if (emptyMessage) {
		if (typeof emptyMessage === 'string') {
			return renderEmptyStateWithString({
				emptyMessage,
				emptyTitle,
				...(emptyDescription && { emptyDescription }),
				...(emptyActionLabel && { emptyActionLabel }),
				...(onEmptyAction && { onEmptyAction }),
				...(className && { className }),
				props,
			});
		}
		return (
			<div className={className} {...props}>
				{emptyMessage}
			</div>
		);
	}

	const emptyStateProps = buildEmptyStateProps({
		emptyTitle,
		...(emptyDescription && { emptyDescription }),
		...(emptyActionLabel && { emptyActionLabel }),
		...(onEmptyAction && { onEmptyAction }),
	});
	return (
		<div className={className} {...props}>
			<EmptyState {...emptyStateProps} />
		</div>
	);
}
