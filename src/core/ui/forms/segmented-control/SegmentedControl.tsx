import { useTranslation } from '@core/i18n/useTranslation';
import { SegmentedControlItemButton } from '@core/ui/forms/segmented-control/components/SegmentedControlItemButton';
import { handleKeyDown } from '@core/ui/forms/segmented-control/helpers/SegmentedControlHandlers';
import {
	getContainerClasses,
	useSegmentedControlId,
} from '@core/ui/forms/segmented-control/helpers/SegmentedControlHelpers';
import type { SegmentedControlProps } from '@src-types/ui/navigation/segmentedControl';
import type { KeyboardEvent } from 'react';

/**
 * SegmentedControl - iOS-style segmented control component
 *
 * Features:
 * - Single selection mode
 * - Multiple variants: default, pills, outline
 * - Size variants: sm, md, lg
 * - Support for icons and labels
 * - Full keyboard navigation (Arrow keys, Home, End)
 * - Accessible ARIA attributes
 * - Dark mode support
 *
 * @example
 * ```tsx
 * const [value, setValue] = useState('option1');
 * <SegmentedControl
 *   items={[
 *     { id: 'option1', label: 'Option 1' },
 *     { id: 'option2', label: 'Option 2' },
 *   ]}
 *   value={value}
 *   onValueChange={setValue}
 * />
 * ```
 *
 * @example
 * ```tsx
 * <SegmentedControl
 *   items={[
 *     { id: 'list', label: 'List', icon: <ListIcon /> },
 *     { id: 'grid', label: 'Grid', icon: <GridIcon /> },
 *   ]}
 *   value={view}
 *   onValueChange={setView}
 *   variant="pills"
 *   size="sm"
 * />
 * ```
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
	const containerClasses = getContainerClasses(variant, className);

	return (
		<div
			role="tablist"
			aria-label={t('a11y.segmentedControl')}
			id={id}
			className={containerClasses}
			{...props}
		>
			{items.map(item => (
				<SegmentedControlItemButton
					key={item.id}
					item={item}
					isSelected={item.id === value}
					isDisabled={disabled || (item.disabled ?? false)}
					variant={variant}
					size={size}
					id={id}
					onValueChange={onValueChange}
					onKeyDown={(event: KeyboardEvent<HTMLButtonElement>, itemId: string) =>
						handleKeyDown({ event, itemId, items, disabled, onValueChange })
					}
				/>
			))}
		</div>
	);
}
