import { useTranslation } from '@core/i18n/useTranslation';
import type { CommandPaletteSearchInputProps } from '@core/ui/overlays/command-palette/types/CommandPaletteParts.types';

export function CommandPaletteSearchInput({
	searchQuery,
	onSearchChange,
	searchInputRef,
	placeholder,
	searchIcon,
}: Readonly<CommandPaletteSearchInputProps>) {
	const { t } = useTranslation('common');
	return (
		<div className="relative mb-lg">
			<div className="pointer-events-none absolute left-md top-1/2 -translate-y-1/2 text-text-muted">
				{searchIcon}
			</div>
			<input
				ref={searchInputRef}
				type="text"
				value={searchQuery}
				onChange={e => onSearchChange(e.target.value)}
				placeholder={placeholder}
				className="w-full rounded-md border border-border bg-surface py-sm pl-[calc(var(--spacing-xl)+var(--spacing-sm))] pr-lg text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
				aria-label={t('a11y.searchCommands')}
			/>
		</div>
	);
}
