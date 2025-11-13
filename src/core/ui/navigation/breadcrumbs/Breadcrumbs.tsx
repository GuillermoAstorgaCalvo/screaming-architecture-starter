import { ARIA_LABELS } from '@core/constants/aria';
import { BREADCRUMBS_BASE_CLASSES } from '@core/constants/ui/navigation';
import { BreadcrumbItemComponent } from '@core/ui/navigation/breadcrumbs/components/BreadcrumbItem';
import type { BreadcrumbItem, BreadcrumbsProps } from '@src-types/ui/navigation/breadcrumbs';
import { twMerge } from 'tailwind-merge';

/**
 * Breadcrumbs - Navigation breadcrumb component
 *
 * Features:
 * - Navigation support via react-router-dom
 * - Customizable separator
 * - Accessible navigation structure
 * - Dark mode support
 *
 * @example
 * ```tsx
 * <Breadcrumbs
 *   items={[
 *     { label: 'Home', to: '/' },
 *     { label: 'Products', to: '/products' },
 *     { label: 'Current Page', isCurrentPage: true }
 *   ]}
 * />
 * ```
 *
 * @example
 * ```tsx
 * <Breadcrumbs
 *   items={items}
 *   separator={<span>→</span>}
 * />
 * ```
 */
function getItemKey(item: BreadcrumbItem, index: number): string {
	if (item.to) {
		return `${item.to}-${index}`;
	}
	// Only use label if it's a string or number
	if (typeof item.label === 'string' || typeof item.label === 'number') {
		return `${item.label}-${index}`;
	}
	// Fallback to index for React nodes/objects
	return `item-${index}`;
}

export default function Breadcrumbs({
	items,
	separator = '/',
	className,
	...props
}: Readonly<BreadcrumbsProps>) {
	const classes = twMerge(BREADCRUMBS_BASE_CLASSES, className);

	return (
		<nav aria-label={ARIA_LABELS.BREADCRUMB} {...props}>
			<ol className={classes}>
				{items.map((item: BreadcrumbItem, index: number) => {
					const isLast = index === items.length - 1;
					const itemKey = getItemKey(item, index);

					return (
						<BreadcrumbItemComponent
							key={itemKey}
							item={item}
							isLast={isLast}
							separator={separator}
						/>
					);
				})}
			</ol>
		</nav>
	);
}
