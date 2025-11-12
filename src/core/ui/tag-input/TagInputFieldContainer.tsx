import Chip from '@core/ui/chip/Chip';
import { classNames } from '@core/utils/classNames';
import type { StandardSize } from '@src-types/ui/base';
import type { ReactNode } from 'react';

interface TagInputFieldContainerProps {
	readonly tags: readonly string[];
	readonly chipVariant: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
	readonly chipSize: StandardSize;
	readonly onRemoveTag: (tag: string) => void;
	readonly className: string;
	readonly hasError: boolean;
	readonly disabled: boolean | undefined;
	readonly children: ReactNode;
}

/**
 * Container for displaying tags as chips
 */
export function TagInputFieldContainer({
	tags,
	chipVariant,
	chipSize,
	onRemoveTag,
	className,
	hasError,
	disabled,
	children,
}: Readonly<TagInputFieldContainerProps>) {
	return (
		<div
			className={classNames(
				'flex min-h-10 flex-wrap items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2',
				'transition-colors',
				'focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20',
				'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-50',
				'dark:border-gray-600 dark:bg-gray-800',
				hasError && 'border-red-500 focus-within:border-red-500 focus-within:ring-red-500/20',
				disabled && 'cursor-not-allowed bg-gray-50 opacity-50 dark:bg-gray-900',
				className
			)}
		>
			{tags.map(tag => (
				<Chip
					key={tag}
					variant={chipVariant}
					size={chipSize}
					removable
					onRemove={() => onRemoveTag(tag)}
					removeAriaLabel={`Remove ${tag}`}
				>
					{tag}
				</Chip>
			))}
			{children}
		</div>
	);
}
