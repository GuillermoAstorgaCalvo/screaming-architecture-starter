import type { ReactElement } from 'react';

import { resolveLoadingPlaceholder, shouldShowErrorPlaceholder } from './video.placeholders';
import { renderReadyVideo } from './video.render';
import type { RenderVideoParams } from './video.types';

export function renderVideo(params: RenderVideoParams): ReactElement {
	if (shouldShowErrorPlaceholder(params)) {
		return <div className={params.className}>{params.errorPlaceholder}</div>;
	}

	const placeholder = resolveLoadingPlaceholder(params);
	if (placeholder) {
		return placeholder;
	}

	return renderReadyVideo(params);
}
