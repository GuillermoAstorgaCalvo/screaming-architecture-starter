import { classNames } from '@core/utils/classNames';

interface GetMenubarClassesParams {
	readonly className?: string | undefined;
}

export function getMenubarClasses({ className }: GetMenubarClassesParams): string {
	const baseClasses =
		'flex items-center gap-1 border-b border-border bg-surface px-2 py-1 dark:border-border dark:bg-surface';

	return classNames(baseClasses, className);
}

interface GetMenubarItemClassesParams {
	readonly isActive: boolean;
	readonly disabled: boolean;
}

export function getMenubarItemClasses({
	isActive,
	disabled: _disabled,
}: GetMenubarItemClassesParams): string {
	const baseClasses =
		'inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-disabled';

	const stateClasses = isActive
		? 'bg-muted text-text-primary dark:bg-muted dark:text-text-primary'
		: 'text-text-secondary hover:bg-muted hover:text-text-primary dark:text-text-secondary dark:hover:bg-muted dark:hover:text-text-primary';

	return classNames(baseClasses, stateClasses);
}

interface GetMenubarSubmenuClassesParams {
	readonly className?: string | undefined;
}

export function getMenubarSubmenuClasses({
	className,
}: GetMenubarSubmenuClassesParams = {}): string {
	const baseClasses =
		'w-56 rounded-lg border border-border bg-popover shadow-lg ring-1 ring-black/5 focus-visible:outline-none';

	return classNames(baseClasses, className);
}
