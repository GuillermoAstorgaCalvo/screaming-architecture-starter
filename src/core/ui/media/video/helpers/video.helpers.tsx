import {
	resolveLoadingPlaceholder,
	shouldShowErrorPlaceholder,
} from '@core/ui/media/video/helpers/video.placeholders';
import { renderReadyVideo } from '@core/ui/media/video/helpers/video.render';
import type { RenderVideoParams } from '@core/ui/media/video/types/video.types';
import type { ReactElement } from 'react';

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
