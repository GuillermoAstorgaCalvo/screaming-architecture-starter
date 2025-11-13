import { isHorizontal } from '@core/ui/utilities/splitter/helpers/useSplitter.helpers';
import type { ResizeHandlers } from '@core/ui/utilities/splitter/types/useSplitter.handlers.types';
import type { SplitterOrientation } from '@src-types/ui/layout/splitter';
import { useEffect } from 'react';

export function useResizeEffect(
	isResizing: boolean,
	handlers: ResizeHandlers,
	orientation: SplitterOrientation
): void {
	useEffect(() => {
		if (!isResizing) {
			return;
		}

		document.addEventListener('mousemove', handlers.handleMouseMove);
		document.addEventListener('mouseup', handlers.handleMouseUp);
		document.body.style.cursor = isHorizontal(orientation) ? 'ew-resize' : 'ns-resize';
		document.body.style.userSelect = 'none';

		return () => {
			document.removeEventListener('mousemove', handlers.handleMouseMove);
			document.removeEventListener('mouseup', handlers.handleMouseUp);
			document.body.style.cursor = '';
			document.body.style.userSelect = '';
		};
	}, [isResizing, handlers, orientation]);
}
