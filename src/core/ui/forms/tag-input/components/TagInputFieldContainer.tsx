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
				'flex min-h-10 flex-wrap items-center gap-2 rounded-md border border-border bg-surface px-3 py-2',
				'transition-colors',
				'focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20',
				'disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-disabled',
				'dark:border-border dark:bg-surface',
				hasError &&
					'border-destructive focus-within:border-destructive focus-within:ring-destructive/20',
				disabled && 'cursor-not-allowed bg-muted opacity-disabled dark:bg-muted',
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
