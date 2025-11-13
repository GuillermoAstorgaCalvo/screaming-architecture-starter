import { getListItemSizeClasses } from '@core/ui/variants/list';
import type { ListItemProps } from '@src-types/ui/layout/list';
import type { MouseEvent, ReactNode } from 'react';

import { useListContext } from './useListContext';

interface ListItemContentProps {
	readonly leading?: ReactNode;
	readonly trailing?: ReactNode;
	readonly children: ReactNode;
}

function ListItemContent({ leading, trailing, children }: ListItemContentProps) {
	return (
		<>
			{leading ? <span className="shrink-0">{leading}</span> : null}
			<span className="flex-1">{children}</span>
			{trailing ? <span className="shrink-0">{trailing}</span> : null}
		</>
	);
}

interface BuildListItemClassesParams {
	readonly size: ReturnType<typeof useListContext>['size'];
	readonly isInteractive: boolean;
	readonly selected: boolean;
	readonly className?: string | undefined;
}

function buildListItemClasses({
	size,
	isInteractive,
	selected,
	className,
}: BuildListItemClassesParams): string {
	const classes = [
		getListItemSizeClasses(size),
		'flex items-center gap-3',
		isInteractive
			? 'cursor-pointer transition-colors hover:bg-gray-100 dark:hover:bg-gray-800'
			: null,
		selected ? 'bg-gray-100 dark:bg-gray-800' : null,
		className ?? null,
	].filter(Boolean);

	return classes.join(' ');
}

function renderListItemContent({ leading, trailing, children }: ListItemContentProps) {
	return (
		<ListItemContent leading={leading} trailing={trailing}>
			{children}
		</ListItemContent>
	);
}

type ListItemRestProps = Omit<
	ListItemProps,
	'children' | 'leading' | 'trailing' | 'clickable' | 'selected' | 'className' | 'onClick'
>;

interface RenderListItemBaseParams extends ListItemContentProps {
	readonly restProps: Readonly<ListItemRestProps>;
	readonly itemClasses: string;
}

interface RenderInteractiveListItemParams extends RenderListItemBaseParams {
	readonly onClick?: ListItemProps['onClick'];
}

function renderStaticListItem({
	restProps,
	itemClasses,
	...contentProps
}: RenderListItemBaseParams) {
	return (
		<li {...restProps} className={itemClasses}>
			{renderListItemContent(contentProps)}
		</li>
	);
}

function renderInteractiveListItem({
	restProps,
	itemClasses,
	onClick,
	...contentProps
}: RenderInteractiveListItemParams) {
	return (
		<li {...restProps}>
			<button
				type="button"
				className={itemClasses}
				onClick={event => onClick?.(event as unknown as MouseEvent<HTMLLIElement>)}
			>
				{renderListItemContent(contentProps)}
			</button>
		</li>
	);
}

/**
 * ListItem renders structured list content with optional leading and trailing
 * elements and can expose an interactive button state when needed.
 */
export default function ListItem({
	children,
	leading,
	trailing,
	clickable = false,
	selected = false,
	className,
	onClick,
	...restProps
}: Readonly<ListItemProps>) {
	const { size } = useListContext();
	const isInteractive = clickable || Boolean(onClick);
	const itemClasses = buildListItemClasses({
		size,
		isInteractive,
		selected,
		className,
	});
	const baseParams = {
		restProps,
		itemClasses,
		leading,
		trailing,
		children,
	};

	return isInteractive
		? renderInteractiveListItem({ ...baseParams, onClick })
		: renderStaticListItem(baseParams);
}
