import { renderChips } from './MultiSelectField.chips';
import type { FieldContainerProps } from './MultiSelectField.types';

export function FieldContainer({
	selectedOptions,
	onRemoveChip,
	isOpen,
	menuId,
	children,
}: Readonly<FieldContainerProps>) {
	return (
		<div className="relative">
			<div
				className="flex flex-wrap items-center gap-1.5 min-h-10 px-3 py-2 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus-within:ring-2 focus-within:ring-offset-1 focus-within:ring-blue-500"
				aria-expanded={isOpen}
				aria-controls={menuId}
			>
				{renderChips(selectedOptions, onRemoveChip)}
				{children}
			</div>
		</div>
	);
}
