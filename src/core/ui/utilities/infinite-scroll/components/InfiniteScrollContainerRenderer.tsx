import { renderInfiniteScrollContent } from '@core/ui/utilities/infinite-scroll/components/InfiniteScrollContentRenderer';
import {
	buildContainerElementProps,
	buildContentProps,
} from '@core/ui/utilities/infinite-scroll/helpers/InfiniteScrollBuilders';
import type { InfiniteScrollContainerProps } from '@core/ui/utilities/infinite-scroll/types/InfiniteScrollRenderers.types';
import type { ReactNode } from 'react';

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
