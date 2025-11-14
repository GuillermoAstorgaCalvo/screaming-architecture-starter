import { getContentClasses, getContentStyle } from '@core/ui/accordion/helpers/AccordionHelpers';
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
			className={getContentClasses(size, isExpanded)}
			style={getContentStyle(isExpanded)}
		>
			{content}
		</section>
	);
}
