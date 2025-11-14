import {
	CONTENT_EXPANDED_STYLE,
	getContentClasses,
} from '@core/ui/collapsible/helpers/CollapsibleHelpers';
import type { ReactNode } from 'react';

interface CollapsibleContentProps {
	contentId: string;
	headerId: string;
	expanded: boolean;
	contentClassName?: string | undefined;
	children: ReactNode;
}

/**
 * Renders the collapsible content section
 */
export function CollapsibleContent({
	contentId,
	headerId,
	expanded,
	contentClassName,
	children,
}: Readonly<CollapsibleContentProps>) {
	const contentClasses = getContentClasses(expanded, contentClassName);

	return (
		<section
			id={contentId}
			aria-labelledby={headerId}
			aria-hidden={!expanded}
			className={contentClasses}
			style={expanded ? CONTENT_EXPANDED_STYLE : undefined}
		>
			<div className="px-4 py-3">{children}</div>
		</section>
	);
}
