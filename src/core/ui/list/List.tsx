import { getListVariantClasses } from '@core/ui/variants/list';
import type { ListProps } from '@src-types/ui/layout/list';

import { ListProvider } from './ListContext';

/**
 * List - Structured list component
 *
 * Features:
 * - Multiple variants: default, bordered, divided
 * - Size variants: sm, md, lg (affects ListItem padding)
 * - Dark mode support
 * - Accessible semantic HTML
 *
 * @example
 * ```tsx
 * <List variant="bordered" size="md">
 *   <ListItem>Item 1</ListItem>
 *   <ListItem>Item 2</ListItem>
 * </List>
 * ```
 */
export default function List({
	variant = 'default',
	size = 'md',
	className,
	children,
	...props
}: Readonly<ListProps>) {
	const classes = getListVariantClasses({ variant, className });
	return (
		<ListProvider size={size}>
			<ul className={classes} {...props}>
				{children}
			</ul>
		</ListProvider>
	);
}
