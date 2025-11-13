import type { SplitterPanelConfig } from '@src-types/ui/layout/splitter';
import { Children, cloneElement, isValidElement, type ReactNode } from 'react';

import { SplitterHandle } from './SplitterHandle';
import { SplitterPanel } from './SplitterPanel';

/**
 * Render splitter children (panels and handles)
 */
export function renderSplitterChildren(
	children: ReactNode,
	panelConfigs: readonly SplitterPanelConfig[]
): ReactNode[] {
	const renderedChildren: ReactNode[] = [];
	let panelIndex = 0;

	Children.forEach(children, (child, index) => {
		if (isValidElement(child) && child.type === SplitterPanel) {
			renderedChildren.push(
				cloneElement(child, {
					key: child.key ?? `panel-${index}`,
				})
			);

			// Add handle after each panel except the last one
			if (panelIndex < panelConfigs.length - 1) {
				renderedChildren.push(
					<SplitterHandle key={`handle-${panelIndex}`} panelIndex={panelIndex} />
				);
			}

			panelIndex++;
		} else {
			// Preserve non-panel children
			renderedChildren.push(child);
		}
	});

	return renderedChildren;
}
