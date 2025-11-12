import {
	BREADCRUMBS_ITEM_CLASSES,
	BREADCRUMBS_SEPARATOR_CLASSES,
} from '@core/constants/ui/navigation';
import type { BreadcrumbItem } from '@src-types/ui/navigation';
import type { ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';

interface BreadcrumbItemProps {
	item: BreadcrumbItem;
	isLast: boolean;
	separator: ReactNode;
}

function BreadcrumbLink({
	item,
	isCurrentPage,
	to,
}: Readonly<{ item: BreadcrumbItem; isCurrentPage: boolean; to: string }>) {
	return (
		<RouterLink
			to={to}
			className={BREADCRUMBS_ITEM_CLASSES}
			aria-current={isCurrentPage ? 'page' : undefined}
		>
			{item.label}
		</RouterLink>
	);
}

function BreadcrumbSpan({
	item,
	isCurrentPage,
}: Readonly<{ item: BreadcrumbItem; isCurrentPage: boolean }>) {
	const currentPageClasses = 'font-medium text-gray-900 dark:text-gray-100';
	return (
		<span
			className={isCurrentPage ? currentPageClasses : BREADCRUMBS_ITEM_CLASSES}
			aria-current={isCurrentPage ? 'page' : undefined}
		>
			{item.label}
		</span>
	);
}

export function BreadcrumbItemComponent({
	item,
	isLast,
	separator,
}: Readonly<BreadcrumbItemProps>) {
	const isCurrentPage = item.isCurrentPage ?? isLast;
	const shouldRenderLink = item.to && !isCurrentPage;

	return (
		<li className="inline-flex items-center">
			{shouldRenderLink && item.to ? (
				<BreadcrumbLink item={item} isCurrentPage={isCurrentPage} to={item.to} />
			) : (
				<BreadcrumbSpan item={item} isCurrentPage={isCurrentPage} />
			)}
			{!isLast && (
				<span className={BREADCRUMBS_SEPARATOR_CLASSES} aria-hidden="true">
					{separator}
				</span>
			)}
		</li>
	);
}
