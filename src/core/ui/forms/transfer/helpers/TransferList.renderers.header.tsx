import { renderSelectAllButton } from '@core/ui/forms/transfer/helpers/TransferList.renderers.button';
import type { RenderHeaderProps } from '@core/ui/forms/transfer/types/TransferList.types';

/**
 * Renders the header section with title and select all button
 */
export function renderHeader({
	headerId,
	headerClasses,
	title,
	showSelectAll,
	enabledOptionsCount,
	allSelected,
	disabled,
	labels,
	onSelectAllToggle,
}: RenderHeaderProps) {
	return (
		<div className={headerClasses} id={headerId}>
			<div className="flex items-center justify-between">
				<h3 className="font-semibold text-text-primary dark:text-text-primary">{title}</h3>
				{showSelectAll && enabledOptionsCount > 0
					? renderSelectAllButton({ allSelected, disabled, labels, onSelectAllToggle })
					: null}
			</div>
		</div>
	);
}
