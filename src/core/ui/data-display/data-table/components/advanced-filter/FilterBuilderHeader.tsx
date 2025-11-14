import Button from '@core/ui/button/Button';
import IconButton from '@core/ui/icon-button/IconButton';
import CloseIcon from '@core/ui/icons/close-icon/CloseIcon';

interface FilterBuilderHeaderProps {
	readonly onClose: () => void;
}

export function FilterBuilderHeader({ onClose }: FilterBuilderHeaderProps) {
	return (
		<div className="mb-4 flex items-center justify-between">
			<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Filter Builder</h3>
			<IconButton
				icon={<CloseIcon />}
				aria-label="Close filter builder"
				onClick={onClose}
				variant="ghost"
				size="sm"
			/>
		</div>
	);
}

interface FilterBuilderClosedProps {
	readonly onToggle: () => void;
	readonly disabled?: boolean;
}

export function FilterBuilderClosed({ onToggle, disabled }: FilterBuilderClosedProps) {
	return (
		<Button variant="ghost" size="sm" onClick={onToggle} disabled={disabled}>
			Add Filter
		</Button>
	);
}
