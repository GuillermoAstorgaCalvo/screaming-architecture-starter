import { useTranslation } from '@core/i18n/useTranslation';
import Button from '@core/ui/button/Button';
import IconButton from '@core/ui/icon-button/IconButton';
import CloseIcon from '@core/ui/icons/close-icon/CloseIcon';

interface FilterBuilderHeaderProps {
	readonly onClose: () => void;
}

export function FilterBuilderHeader({ onClose }: FilterBuilderHeaderProps) {
	const { t } = useTranslation('common');
	return (
		<div className="mb-4 flex items-center justify-between">
			<h3 className="text-lg font-semibold text-text-primary dark:text-text-primary">
				{t('filters.filterBuilder')}
			</h3>
			<IconButton
				icon={<CloseIcon />}
				aria-label={t('filters.closeFilterBuilder')}
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
	const { t } = useTranslation('common');
	return (
		<Button variant="ghost" size="sm" onClick={onToggle} disabled={disabled}>
			{t('filters.addFilter')}
		</Button>
	);
}
