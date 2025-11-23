import { useTranslation } from '@core/i18n/useTranslation';
import { SegmentedControlItemButton } from '@core/ui/forms/segmented-control/components/SegmentedControlItemButton';
import { handleKeyDown } from '@core/ui/forms/segmented-control/helpers/SegmentedControlHandlers';
import {
	getContainerClasses,
	useSegmentedControlId,
} from '@core/ui/forms/segmented-control/helpers/SegmentedControlHelpers';
import type { SegmentedControlProps } from '@src-types/ui/navigation/segmentedControl';
import { Fragment, type KeyboardEvent } from 'react';
import { twMerge } from 'tailwind-merge';

interface RenderItemProps {
	item: SegmentedControlProps['items'][number];
	index: number;
	totalItems: number;
	value: string;
	disabled: boolean;
	variant: NonNullable<SegmentedControlProps['variant']>;
	size: NonNullable<SegmentedControlProps['size']>;
	id: string;
	onValueChange: (itemId: string) => void;
	onKeyDown: (event: KeyboardEvent<HTMLButtonElement>, itemId: string) => void;
}

function renderItem(props: RenderItemProps) {
	return (
		<Fragment key={props.item.id}>
			<SegmentedControlItemButton
				item={props.item}
				isSelected={props.item.id === props.value}
				isDisabled={props.disabled || (props.item.disabled ?? false)}
				variant={props.variant}
				size={props.size}
				id={props.id}
				onValueChange={props.onValueChange}
				onKeyDown={props.onKeyDown}
			/>
			{props.index < props.totalItems - 1 && (
				<div className="h-6 w-px bg-white/20 dark:bg-white/10 mx-3" aria-hidden="true" />
			)}
		</Fragment>
	);
}

/**
 * SegmentedControl - iOS-style segmented control component
 *
 * Features: Single selection, variants (default/pills/outline), sizes (sm/md/lg),
 * icons, keyboard navigation, accessible ARIA, dark mode support
 */
export default function SegmentedControl({
	items,
	value,
	onValueChange,
	variant = 'default',
	size = 'md',
	disabled = false,
	segmentedControlId,
	className,
	...props
}: Readonly<SegmentedControlProps>) {
	const { t } = useTranslation('common');
	const id = useSegmentedControlId(segmentedControlId);
	const onKeyDownHandler = (event: KeyboardEvent<HTMLButtonElement>, itemId: string) =>
		handleKeyDown({ event, itemId, items, disabled, onValueChange });

	return (
		<div
			role="tablist"
			aria-label={t('a11y.segmentedControl')}
			id={id}
			className={twMerge('gap-x-2', getContainerClasses(variant, className))}
			{...props}
		>
			{items.map((item, index) =>
				renderItem({
					item,
					index,
					totalItems: items.length,
					value,
					disabled,
					variant,
					size,
					id,
					onValueChange,
					onKeyDown: onKeyDownHandler,
				})
			)}
		</div>
	);
}
