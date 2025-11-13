import type { StandardSize } from '@src-types/ui/base';
import { type ReactNode, useCallback } from 'react';

import { getHeaderClasses } from './AccordionHelpers';
import { AccordionIcon } from './AccordionIcon';

type AccordionHeaderProps = Readonly<{
	headerId: string;
	contentId: string;
	isExpanded: boolean;
	disabled?: boolean;
	onToggle: () => void;
	size: StandardSize;
	header: ReactNode;
}>;

export function AccordionHeader({
	headerId,
	contentId,
	isExpanded,
	disabled,
	onToggle,
	size,
	header,
}: AccordionHeaderProps) {
	const handleClick = useCallback(() => {
		if (!disabled) {
			onToggle();
		}
	}, [disabled, onToggle]);

	return (
		<button
			id={headerId}
			type="button"
			aria-expanded={isExpanded}
			aria-controls={contentId}
			disabled={disabled}
			onClick={handleClick}
			className={getHeaderClasses(size)}
		>
			<span>{header}</span>
			<AccordionIcon isExpanded={isExpanded} />
		</button>
	);
}
