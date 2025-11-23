import { getHeaderClasses } from '@core/ui/collapsible/helpers/CollapsibleHelpers';
import type { KeyboardEvent, ReactNode } from 'react';

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

	const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
		if (disabled) return;

		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			onToggle();
		}
	};

	return (
		<button
			type="button"
			id={headerId}
			aria-expanded={expanded}
			aria-controls={contentId}
			aria-disabled={disabled}
			disabled={disabled}
			onClick={onToggle}
			onKeyDown={handleKeyDown}
			className={headerClasses}
		>
			<span className="flex-1">{header}</span>
			<CollapsibleIcon expanded={expanded} />
		</button>
	);
}
