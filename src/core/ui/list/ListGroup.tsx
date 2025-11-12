import type { ListGroupProps } from '@src-types/ui/layout/list';

/**
 * ListGroup - Wrapper component for List with optional header and footer
 *
 * Features:
 * - Optional header section
 * - Optional footer section
 * - Dark mode support
 *
 * @example
 * ```tsx
 * <ListGroup
 *   header={<Heading>Items</Heading>}
 *   footer={<Text>Total: 5</Text>}
 * >
 *   <List>
 *     <ListItem>Item 1</ListItem>
 *     <ListItem>Item 2</ListItem>
 *   </List>
 * </ListGroup>
 * ```
 */
export default function ListGroup({
	children,
	header,
	footer,
	className,
	...props
}: Readonly<ListGroupProps>) {
	return (
		<div className={className} {...props}>
			{header ? <div className="mb-4">{header}</div> : null}
			{children}
			{footer ? <div className="mt-4">{footer}</div> : null}
		</div>
	);
}
