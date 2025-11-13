import { twMerge } from 'tailwind-merge';

import type { CommandPaletteItemProps } from './CommandPaletteParts.types';

function getButtonClassName(isHighlighted: boolean, disabled?: boolean): string {
	return twMerge(
		'flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors',
		isHighlighted ? 'bg-primary/10 text-primary' : 'text-text-primary hover:bg-muted',
		disabled && 'cursor-not-allowed opacity-50'
	);
}

export function CommandPaletteItem({
	command,
	index,
	isHighlighted,
	onSelect,
}: Readonly<CommandPaletteItemProps>) {
	const handleClick = () => {
		if (!command.disabled) {
			onSelect(command).catch(() => {
				// Ignore errors
			});
		}
	};

	return (
		// Custom option needed for command palette listbox pattern
		// Note: Using role="option" on button is correct for custom command palette per ARIA spec
		// Native <option> doesn't support search/filter functionality
		// This warning is a false positive - the implementation follows ARIA Authoring Practices
		// See: https://www.w3.org/WAI/ARIA/apg/patterns/listbox/
		// The accessibility warning about using <option> is expected and acceptable for this pattern
		<button
			type="button"
			data-command-index={index}
			onClick={handleClick}
			disabled={command.disabled}
			className={getButtonClassName(isHighlighted, command.disabled)}
			role="option"
			aria-selected={isHighlighted}
		>
			{command.icon ? <div className="shrink-0 text-text-muted">{command.icon}</div> : null}
			<div className="flex-1">
				<div className="font-medium">{command.label}</div>
				{command.description ? (
					<div className="text-xs text-text-muted">{command.description}</div>
				) : null}
			</div>
			{command.shortcut ? (
				<div className="shrink-0 text-xs text-text-muted">
					<kbd className="rounded bg-muted px-2 py-1 font-mono">{command.shortcut}</kbd>
				</div>
			) : null}
		</button>
	);
}
