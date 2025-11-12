import { classNames } from '@core/utils/classNames';
import type { MenubarSubmenuItem as MenubarSubmenuItemType } from '@src-types/ui/navigation';

interface MenubarSubmenuItemProps {
	readonly item: MenubarSubmenuItemType;
	readonly onSelect?: (() => void | Promise<void>) | undefined;
}

export function MenubarSubmenuItem({ item, onSelect }: MenubarSubmenuItemProps) {
	const classes = classNames(
		'flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm transition hover:bg-muted focus:bg-muted focus:outline-none disabled:cursor-not-allowed disabled:opacity-60',
		item.disabled ? 'opacity-60 cursor-not-allowed' : ''
	);

	const handleClick = () => {
		if (item.disabled) return;
		if (onSelect) {
			const result = onSelect();
			if (result instanceof Promise) {
				result.catch(() => {
					// Ignore errors from async select handler
				});
			}
		}
	};

	return (
		<button
			type="button"
			role="menuitem"
			className={classes}
			onClick={handleClick}
			disabled={item.disabled}
		>
			<span className="flex min-w-0 flex-1 items-center gap-2">
				{item.icon ? (
					<span className="text-base" aria-hidden="true">
						{item.icon}
					</span>
				) : null}
				<span className="truncate">{item.label}</span>
			</span>
			{item.shortcut ? (
				<span className="ml-auto text-xs text-muted-foreground">{item.shortcut}</span>
			) : null}
		</button>
	);
}
