import type { ReactNode } from 'react';

import { buildContainerElementProps, buildContentProps } from './InfiniteScrollBuilders';
import { renderInfiniteScrollContent } from './InfiniteScrollContentRenderer';
import type { InfiniteScrollContainerProps } from './InfiniteScrollRenderers.types';

/**
 * Renders a container wrapper div with the given props and content
 */
function renderContainerWrapper({
	containerProps,
	content,
}: Readonly<{
	containerProps: Readonly<Record<string, unknown>>;
	content: ReactNode;
}>) {
	return <div {...containerProps}>{content}</div>;
}

/**
 * Renders the main infinite scroll container
 */
export function renderInfiniteScrollContainer(params: InfiniteScrollContainerProps) {
	const containerProps = buildContainerElementProps({
		infiniteScrollId: params.infiniteScrollId,
		containerClasses: params.containerClasses,
		props: params.props,
	});

	const contentProps = buildContentProps(params);
	const content = renderInfiniteScrollContent(contentProps);

	return renderContainerWrapper({
		containerProps,
		content,
	});
}
