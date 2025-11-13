import { classNames } from '@core/utils/classNames';
import type { RefObject } from 'react';

import type { DropdownMenuItem } from './DropdownMenu.types';

interface MenuItemButtonProps {
	readonly item: DropdownMenuItem;
	readonly isHighlighted: boolean;
	readonly itemRef: RefObject<HTMLButtonElement | null>;
	readonly onSelect: (item: DropdownMenuItem) => Promise<undefined>;
}

function getButtonClassName(isHighlighted: boolean, disabled: boolean): string {
	return classNames(
		'flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm transition hover:bg-muted focus:bg-muted focus:outline-none disabled:cursor-not-allowed disabled:opacity-60',
		isHighlighted && !disabled ? 'bg-muted text-foreground' : ''
	);
}

function renderButtonContent(item: DropdownMenuItem) {
	return (
		<>
			<span className="flex min-w-0 flex-1 items-center gap-2">
				{item.icon ? (
					<span className="text-base" aria-hidden>
						{item.icon}
					</span>
				) : null}
				<span className="truncate">{item.label}</span>
			</span>
			{item.description ? (
				<span className="ml-2 line-clamp-1 text-xs text-muted-foreground">{item.description}</span>
			) : null}
			{item.shortcut ? (
				<span className="ml-auto text-xs text-muted-foreground">{item.shortcut}</span>
			) : null}
		</>
	);
}

export function MenuItemButton({ item, isHighlighted, itemRef, onSelect }: MenuItemButtonProps) {
	const handleClick = () => {
		onSelect(item).catch(() => {
			// Ignore errors from async select handler
		});
	};

	return (
		<button
			type="button"
			role="menuitem"
			ref={itemRef}
			disabled={item.disabled}
			onClick={handleClick}
			className={getButtonClassName(isHighlighted, item.disabled ?? false)}
			data-highlighted={isHighlighted ? true : undefined}
		>
			{renderButtonContent(item)}
		</button>
	);
}
