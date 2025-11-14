import { useTranslation } from '@core/i18n/useTranslation';
import { CommandPaletteItem } from '@core/ui/overlays/command-palette/components/CommandPaletteItem';
import type { CommandPaletteListProps } from '@core/ui/overlays/command-palette/types/CommandPaletteParts.types';

export function CommandPaletteList({
	commands,
	highlightedIndex,
	commandsListRef,
	onSelect,
	emptyState,
}: Readonly<CommandPaletteListProps>) {
	const { t } = useTranslation('common');
	return (
		// ARIA listbox pattern: Using role="listbox" on div is correct for command palette per ARIA spec
		// Native <select> cannot support command palette's custom styling, keyboard navigation, and filtering
		// This warning is a false positive - the implementation follows ARIA Authoring Practices
		<div
			ref={commandsListRef}
			className="max-h-96 overflow-y-auto"
			role="listbox" // NOSONAR S6819 - ARIA listbox pattern required for custom command palette
			aria-label={t('a11y.commands')}
		>
			{commands.length === 0 ? (
				<div className="py-2xl text-center text-sm text-text-muted">{emptyState}</div>
			) : (
				commands.map((command, index) => (
					<CommandPaletteItem
						key={command.id}
						command={command}
						index={index}
						isHighlighted={index === highlightedIndex}
						onSelect={onSelect}
					/>
				))
			)}
		</div>
	);
}
