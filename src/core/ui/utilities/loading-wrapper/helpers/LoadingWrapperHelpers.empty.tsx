import EmptyState from '@core/ui/empty-state/EmptyState';
import type { ReactNode } from 'react';

type EmptyStatePropsInput = Readonly<{
	emptyTitle: string;
	emptyDescription?: string;
	emptyMessage?: string;
	emptyActionLabel?: string;
	onEmptyAction?: (() => void) | undefined;
}>;

/** Build empty state props */
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

/** Render empty state with string message */
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

interface DefaultEmptyStateParams {
	emptyTitle: string;
	emptyDescription?: string;
	emptyActionLabel?: string;
	onEmptyAction?: (() => void) | undefined;
	className?: string;
	props: Readonly<Record<string, unknown>>;
}
/** Build default empty state params */
function buildDefaultParams({
	emptyTitle,
	emptyDescription,
	emptyActionLabel,
	onEmptyAction,
	className,
	props,
}: EmptyStateProps): DefaultEmptyStateParams {
	return {
		emptyTitle,
		props,
		...(emptyDescription && { emptyDescription }),
		...(emptyActionLabel && { emptyActionLabel }),
		...(onEmptyAction && { onEmptyAction }),
		...(className && { className }),
	};
}
/** Build string empty state params */
function buildStringParams({
	emptyMessage,
	emptyTitle,
	emptyDescription,
	emptyActionLabel,
	onEmptyAction,
	className,
	props,
}: EmptyStateProps & { emptyMessage: string }): EmptyStateWithStringProps {
	return {
		emptyMessage,
		emptyTitle,
		props,
		...(emptyDescription && { emptyDescription }),
		...(emptyActionLabel && { emptyActionLabel }),
		...(onEmptyAction && { onEmptyAction }),
		...(className && { className }),
	};
}
/** Render default empty state (no custom message) */
function renderDefaultEmptyState(params: DefaultEmptyStateParams) {
	const emptyStateProps = buildEmptyStateProps({
		emptyTitle: params.emptyTitle,
		...(params.emptyDescription && { emptyDescription: params.emptyDescription }),
		...(params.emptyActionLabel && { emptyActionLabel: params.emptyActionLabel }),
		...(params.onEmptyAction && { onEmptyAction: params.onEmptyAction }),
	});
	return (
		<div className={params.className} {...params.props}>
			<EmptyState {...emptyStateProps} />
		</div>
	);
}
/** Render empty state */
export function renderEmptyState(props: EmptyStateProps) {
	if (!props.emptyMessage) {
		return renderDefaultEmptyState(buildDefaultParams(props));
	}

	if (typeof props.emptyMessage === 'string') {
		return renderEmptyStateWithString(
			buildStringParams({ ...props, emptyMessage: props.emptyMessage })
		);
	}
	return (
		<div className={props.className} {...props.props}>
			{props.emptyMessage}
		</div>
	);
}
