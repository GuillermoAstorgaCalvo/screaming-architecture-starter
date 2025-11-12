import Button from '@core/ui/button/Button';
import Heading from '@core/ui/heading/Heading';
import Text from '@core/ui/text/Text';
import { classNames } from '@core/utils/classNames';
import type { ReactNode } from 'react';

type EmptyStateSize = 'sm' | 'md' | 'lg';

export interface EmptyStateProps {
	/** Title text for the empty state */
	readonly title: string;
	/** Optional description text */
	readonly description?: string;
	/** Optional action button label */
	readonly actionLabel?: string;
	/** Optional action button click handler */
	readonly onAction?: () => void;
	/** Optional icon or image to display above the title */
	readonly icon?: ReactNode;
	/** Optional custom className */
	readonly className?: string;
	/** Size variant for the empty state @default 'md' */
	readonly size?: EmptyStateSize;
}

const SIZE_CLASSES: Record<EmptyStateSize, string> = {
	sm: 'py-6 gap-2',
	md: 'py-10 gap-3',
	lg: 'py-16 gap-4',
};

function getSizeVariant(size: EmptyStateSize): EmptyStateSize {
	if (size === 'sm') return 'sm';
	if (size === 'lg') return 'lg';
	return 'md';
}

interface EmptyStateIconProps {
	readonly icon: ReactNode;
	readonly size: EmptyStateSize;
}

function EmptyStateIcon({ icon, size }: EmptyStateIconProps) {
	if (icon == null) return null;
	return (
		<div className={classNames(size === 'lg' ? 'mb-4' : 'mb-2', 'text-muted-foreground')}>
			{icon}
		</div>
	);
}

interface EmptyStateContentProps {
	readonly title: string;
	readonly description?: string | undefined;
	readonly variantSize: EmptyStateSize;
}

function EmptyStateContent({ title, description, variantSize }: EmptyStateContentProps) {
	return (
		<>
			<Heading as="h3" size={variantSize}>
				{title}
			</Heading>
			{description == null ? null : (
				<Text size={variantSize} className="text-muted-foreground max-w-md">
					{description}
				</Text>
			)}
		</>
	);
}

interface EmptyStateActionProps {
	readonly actionLabel?: string | undefined;
	readonly onAction?: (() => void) | undefined;
	readonly variantSize: EmptyStateSize;
	readonly size: EmptyStateSize;
}

function EmptyStateAction({ actionLabel, onAction, variantSize, size }: EmptyStateActionProps) {
	if (actionLabel == null || onAction == null) return null;
	return (
		<div className={size === 'lg' ? 'mt-4' : 'mt-2'}>
			<Button variant="primary" size={variantSize} onClick={onAction}>
				{actionLabel}
			</Button>
		</div>
	);
}

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
