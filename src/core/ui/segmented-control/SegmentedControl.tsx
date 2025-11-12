import type { SegmentedControlProps } from '@src-types/ui/navigation';
import type { KeyboardEvent } from 'react';

import { handleKeyDown } from './SegmentedControlHandlers';
import { getContainerClasses, useSegmentedControlId } from './SegmentedControlHelpers';
import { SegmentedControlItemButton } from './SegmentedControlItemButton';

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
	const id = useSegmentedControlId(segmentedControlId);
	const containerClasses = getContainerClasses(variant, className);
	const handleKeyDownWrapper = (event: KeyboardEvent<HTMLButtonElement>, itemId: string) => {
		handleKeyDown({ event, itemId, items, disabled, onValueChange });
	};

	return (
		<div
			role="tablist"
			aria-label="Segmented control"
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
					onKeyDown={handleKeyDownWrapper}
				/>
			))}
		</div>
	);
}
