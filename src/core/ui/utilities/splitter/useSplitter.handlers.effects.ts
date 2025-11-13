import type { SplitterOrientation } from '@src-types/ui/layout/splitter';
import { useEffect } from 'react';

import type { ResizeHandlers } from './useSplitter.handlers.types';
import { isHorizontal } from './useSplitter.helpers';

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
