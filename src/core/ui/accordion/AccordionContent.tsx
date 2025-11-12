import type { StandardSize } from '@src-types/ui/base';
import type { ReactNode } from 'react';

import { getContentClasses } from './AccordionHelpers';

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
		>
			{content}
		</section>
	);
}
