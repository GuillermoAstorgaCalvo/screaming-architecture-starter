import {
	getContentClassesCollapsed,
	getContentClassesExpanded,
	getContentStyleExpanded,
} from '@core/ui/accordion/helpers/AccordionHelpers';
import type { StandardSize } from '@src-types/ui/base';
import type { ReactNode } from 'react';

type AccordionContentProps = Readonly<{
	contentId: string;
	headerId: string;
	size: StandardSize;
	isExpanded: boolean;
	content: ReactNode;
}>;

export function AccordionContent({
	contentId,
	headerId,
	size,
	isExpanded,
	content,
}: AccordionContentProps) {
	return (
		<section
			id={contentId}
			aria-labelledby={headerId}
			aria-hidden={!isExpanded}
			className={isExpanded ? getContentClassesExpanded(size) : getContentClassesCollapsed(size)}
			style={isExpanded ? getContentStyleExpanded() : undefined}
		>
			{content}
		</section>
	);
}
