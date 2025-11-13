import {
	DESCRIPTION_DETAILS_BASE_CLASSES,
	DESCRIPTION_DETAILS_SIZE_CLASSES,
	DESCRIPTION_LIST_BASE_CLASSES,
	DESCRIPTION_LIST_ORIENTATION_CLASSES,
	DESCRIPTION_LIST_SIZE_CLASSES,
	DESCRIPTION_TERM_BASE_CLASSES,
	DESCRIPTION_TERM_SIZE_CLASSES,
} from '@core/constants/ui/display/typography';
import type { StandardSize } from '@src-types/ui/base';
import type {
	DescriptionDetailsProps,
	DescriptionListProps,
	DescriptionTermProps,
} from '@src-types/ui/data/description-list';
import { createContext, useContext } from 'react';
import { twMerge } from 'tailwind-merge';

/**
 * Context for DescriptionList size
 */
const DescriptionListContext = createContext<StandardSize>('md');

/**
 * DescriptionTerm - Term component for DescriptionList
 *
 * Features:
 * - Semantic <dt> element
 * - Size variants: sm, md, lg (inherits from parent DescriptionList)
 * - Dark mode support
 *
 * @example
 * ```tsx
 * <DescriptionTerm>Name</DescriptionTerm>
 * ```
 */
export function DescriptionTerm({
	children,
	size,
	className,
	...props
}: Readonly<DescriptionTermProps & { size?: StandardSize }>) {
	const contextSize = useContext(DescriptionListContext);
	const effectiveSize = size ?? contextSize;

	const termClasses = twMerge(
		DESCRIPTION_TERM_BASE_CLASSES,
		DESCRIPTION_TERM_SIZE_CLASSES[effectiveSize],
		className
	);

	return (
		<dt className={termClasses} {...props}>
			{children}
		</dt>
	);
}

/**
 * DescriptionDetails - Details component for DescriptionList
 *
 * Features:
 * - Semantic <dd> element
 * - Size variants: sm, md, lg (inherits from parent DescriptionList)
 * - Dark mode support
 *
 * @example
 * ```tsx
 * <DescriptionDetails>John Doe</DescriptionDetails>
 * ```
 */
export function DescriptionDetails({
	children,
	size,
	className,
	...props
}: Readonly<DescriptionDetailsProps & { size?: StandardSize }>) {
	const contextSize = useContext(DescriptionListContext);
	const effectiveSize = size ?? contextSize;

	const detailsClasses = twMerge(
		DESCRIPTION_DETAILS_BASE_CLASSES,
		DESCRIPTION_DETAILS_SIZE_CLASSES[effectiveSize],
		className
	);

	return (
		<dd className={detailsClasses} {...props}>
			{children}
		</dd>
	);
}

/**
 * DescriptionList - Semantic <dl>, <dt>, <dd> component for key-value pairs
 *
 * Features:
 * - Semantic HTML structure using <dl>, <dt>, <dd>
 * - Horizontal or vertical orientation
 * - Size variants: sm, md, lg
 * - Optional dividers between items
 * - Responsive layout (horizontal stacks on mobile)
 * - Dark mode support
 *
 * @example
 * ```tsx
 * <DescriptionList>
 *   <DescriptionTerm>Name</DescriptionTerm>
 *   <DescriptionDetails>John Doe</DescriptionDetails>
 *   <DescriptionTerm>Email</DescriptionTerm>
 *   <DescriptionDetails>john@example.com</DescriptionDetails>
 * </DescriptionList>
 * ```
 *
 * @example
 * ```tsx
 * <DescriptionList orientation="vertical" size="lg" divided>
 *   <DescriptionTerm>Status</DescriptionTerm>
 *   <DescriptionDetails>Active</DescriptionDetails>
 * </DescriptionList>
 * ```
 */
export default function DescriptionList({
	children,
	orientation = 'horizontal',
	size = 'md',
	divided = false,
	className,
	...props
}: Readonly<DescriptionListProps>) {
	const orientationClasses = DESCRIPTION_LIST_ORIENTATION_CLASSES[orientation];
	const sizeClasses = DESCRIPTION_LIST_SIZE_CLASSES[size];
	const dividedClasses = divided ? 'divide-y divide-gray-200 dark:divide-gray-700' : '';

	const listClasses = twMerge(
		DESCRIPTION_LIST_BASE_CLASSES,
		orientationClasses,
		sizeClasses,
		dividedClasses,
		className
	);

	return (
		<DescriptionListContext.Provider value={size}>
			<dl className={listClasses} {...props}>
				{children}
			</dl>
		</DescriptionListContext.Provider>
	);
}
