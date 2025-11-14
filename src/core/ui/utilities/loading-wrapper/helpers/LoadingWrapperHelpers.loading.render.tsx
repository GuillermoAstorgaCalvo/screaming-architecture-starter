import { ARIA_LABELS, ARIA_LIVE } from '@core/constants/aria';
import Skeleton from '@core/ui/skeleton/Skeleton';
import Spinner from '@core/ui/spinner/Spinner';
import Text from '@core/ui/text/Text';
import { classNames } from '@core/utils/classNames';
import type { ReactNode } from 'react';

type SkeletonStateProps = Readonly<{
	skeletonComponent?: ReactNode;
	className?: string;
	props: Readonly<Record<string, unknown>>;
}>;

/**
 * Render skeleton loading state
 */
export function renderSkeletonState({ skeletonComponent, className, props }: SkeletonStateProps) {
	if (skeletonComponent) {
		return (
			<div className={className} {...props}>
				{skeletonComponent}
			</div>
		);
	}
	return (
		<div className={className} {...props}>
			<Skeleton variant="rectangular" className="w-full h-32" />
		</div>
	);
}

type SpinnerStateProps = Readonly<{
	loadingText?: string;
	className?: string;
	props: Readonly<Record<string, unknown>>;
}>;

/**
 * Render spinner loading state
 */
export function renderSpinnerState({ loadingText, className, props }: SpinnerStateProps) {
	return (
		<div
			className={classNames('flex items-center justify-center py-8', className)}
			aria-label={ARIA_LABELS.LOADING}
			aria-live={ARIA_LIVE.POLITE}
			{...props}
		>
			<Spinner size="md" />
			{loadingText ? (
				<Text size="sm" className="ml-2 text-text-muted dark:text-text-muted-dark">
					{loadingText}
				</Text>
			) : null}
		</div>
	);
}
