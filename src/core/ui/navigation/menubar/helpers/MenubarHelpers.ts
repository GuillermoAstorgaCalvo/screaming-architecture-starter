import { classNames } from '@core/utils/classNames';

interface GetMenubarClassesParams {
	readonly className?: string | undefined;
}

export function getMenubarClasses({ className }: GetMenubarClassesParams): string {
	const baseClasses =
		'flex items-center gap-1 border-b border-gray-200 bg-white px-2 py-1 dark:border-gray-700 dark:bg-gray-800';

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
		'inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

	const stateClasses = isActive
		? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100'
		: 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100';

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
