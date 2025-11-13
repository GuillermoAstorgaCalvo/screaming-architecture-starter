import Checkbox from '@core/ui/checkbox/Checkbox';
import ListItem from '@core/ui/data-display/list/components/ListItem';
import type {
	RenderListItemProps,
	RenderListProps,
} from '@core/ui/forms/transfer/types/TransferList.types';
import List from '@core/ui/list/List';
import { twMerge } from 'tailwind-merge';

/**
 * Renders a single list item
 */
export function renderListItem<T>({
	option,
	isSelected,
	disabled,
	size,
	renderItem,
	onItemToggle,
}: RenderListItemProps<T>) {
	const itemContent = renderItem ? renderItem(option, isSelected) : <span>{option.label}</span>;

	const handleClick = () => {
		if (!option.disabled && !disabled) {
			onItemToggle(option.value);
		}
	};

	return (
		<ListItem
			key={option.value}
			leading={
				<Checkbox
					checked={isSelected}
					onChange={() => onItemToggle(option.value)}
					disabled={disabled || option.disabled}
					size={size}
					aria-label={`Select ${typeof option.label === 'string' ? option.label : 'item'}`}
				/>
			}
			clickable
			selected={isSelected}
			className={twMerge(option.disabled && 'opacity-50 cursor-not-allowed')}
			onClick={handleClick}
			aria-selected={isSelected}
		>
			{itemContent}
		</ListItem>
	);
}

/**
 * Renders the list of items
 */
export function renderList<T>({
	options,
	selectedValues,
	headerId,
	listContainerClasses,
	maxHeight,
	size,
	disabled,
	renderItem,
	renderEmpty,
	type,
	onItemToggle,
}: RenderListProps<T>) {
	const emptyContent = (
		<div className="py-8 text-center text-gray-500 dark:text-gray-400 text-sm">
			{renderEmpty ? renderEmpty(type) : <span>No items available</span>}
		</div>
	);

	const listContent = (
		<List variant="default" size={size}>
			{options.map(option => {
				const isSelected = selectedValues.has(option.value);
				return renderListItem({ option, isSelected, disabled, size, renderItem, onItemToggle });
			})}
		</List>
	);

	return (
		<div
			className={listContainerClasses}
			style={{ maxHeight: `${maxHeight}px` }}
			aria-labelledby={headerId}
		>
			{options.length === 0 ? emptyContent : listContent}
		</div>
	);
}
