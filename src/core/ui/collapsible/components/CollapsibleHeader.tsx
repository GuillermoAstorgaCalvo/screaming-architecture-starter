import type { ReactNode } from 'react';

import { getHeaderClasses } from './CollapsibleHelpers';
import { CollapsibleIcon } from './CollapsibleIcon';

interface CollapsibleHeaderProps {
	header: ReactNode;
	headerId: string;
	contentId: string;
	expanded: boolean;
	disabled: boolean;
	headerClassName?: string | undefined;
	onToggle: () => void;
}

/**
 * Renders the collapsible header button
 */
export function CollapsibleHeader({
	header,
	headerId,
	contentId,
	expanded,
	disabled,
	headerClassName,
	onToggle,
}: Readonly<CollapsibleHeaderProps>) {
	const headerClasses = getHeaderClasses(headerClassName);

	return (
		<button
			type="button"
			id={headerId}
			aria-expanded={expanded}
			aria-controls={contentId}
			aria-disabled={disabled}
			disabled={disabled}
			onClick={onToggle}
			className={headerClasses}
		>
			<span className="flex-1">{header}</span>
			<CollapsibleIcon expanded={expanded} />
		</button>
	);
}
