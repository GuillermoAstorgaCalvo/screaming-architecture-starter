import type { CommandPaletteSearchInputProps } from '@core/ui/overlays/command-palette/types/CommandPaletteParts.types';

export function CommandPaletteSearchInput({
	searchQuery,
	onSearchChange,
	searchInputRef,
	placeholder,
	searchIcon,
}: Readonly<CommandPaletteSearchInputProps>) {
	return (
		<div className="relative mb-4">
			<div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
				{searchIcon}
			</div>
			<input
				ref={searchInputRef}
				type="text"
				value={searchQuery}
				onChange={e => onSearchChange(e.target.value)}
				placeholder={placeholder}
				className="w-full rounded-md border border-border bg-surface py-2 pl-10 pr-4 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
				aria-label="Search commands"
			/>
		</div>
	);
}
