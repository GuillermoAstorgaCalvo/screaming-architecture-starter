import { renderChips } from '@core/ui/forms/multi-select/components/MultiSelectField.chips';
import type { FieldContainerProps } from '@core/ui/forms/multi-select/types/MultiSelectField.types';

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
				className="flex flex-wrap items-center gap-1.5 min-h-10 px-3 py-2 border rounded-md bg-surface dark:bg-surface border-border dark:border-border focus-within:ring-2 focus-within:ring-offset-1 focus-within:ring-primary"
				aria-expanded={isOpen}
				aria-controls={menuId}
			>
				{renderChips(selectedOptions, onRemoveChip)}
				{children}
			</div>
		</div>
	);
}
