import { classNames } from '@core/utils/classNames';

import { EmptyStateAction } from './components/EmptyStateAction';
import { EmptyStateContent } from './components/EmptyStateContent';
import { EmptyStateIcon } from './components/EmptyStateIcon';
import { SIZE_CLASSES } from './constants';
import type { EmptyStateProps } from './types/emptyState.types';
import { getSizeVariant } from './utils/emptyStateUtils';

export type { EmptyStateProps } from './types/emptyState.types';

/**
 * EmptyState - Reusable empty state component for displaying when there's no data or content
 *
 * Features:
 * - Accessible: proper semantic structure
 * - Size variants: sm, md, lg
 * - Optional icon/image support
 * - Optional action button
 * - Dark mode support
 *
 * @example
 * ```tsx
 * <EmptyState
 *   title="No items found"
 *   description="Try adjusting your search criteria"
 *   actionLabel="Clear filters"
 *   onAction={() => clearFilters()}
 * />
 * ```
 *
 * @example
 * ```tsx
 * <EmptyState
 *   title="No data available"
 *   icon={<Icon name="inbox" />}
 * />
 * ```
 */
export default function EmptyState({
	title,
	description,
	actionLabel,
	onAction,
	icon,
	className,
	size = 'md',
}: Readonly<EmptyStateProps>) {
	const variantSize = getSizeVariant(size);
	return (
		<output
			className={classNames(
				'flex flex-col items-center justify-center text-center',
				SIZE_CLASSES[size],
				className
			)}
			aria-live="polite"
		>
			<EmptyStateIcon icon={icon} size={size} />
			<EmptyStateContent title={title} description={description} variantSize={variantSize} />
			<EmptyStateAction
				actionLabel={actionLabel}
				onAction={onAction}
				variantSize={variantSize}
				size={size}
			/>
		</output>
	);
}
