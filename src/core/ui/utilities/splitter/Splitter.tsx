import type { SplitterProps } from '@src-types/ui/layout/splitter';
import { useId, useMemo, useRef } from 'react';

import { extractPanelConfigs, getContainerClasses } from './Splitter.helpers';
import { useSplitterSetup } from './Splitter.hooks';
import { renderSplitterChildren } from './Splitter.render';
import { SplitterContext } from './SplitterContext';

/**
 * Splitter - Component for creating resizable panels with multiple panels support
 *
 * Features:
 * - Multiple panels (3+ panels)
 * - Resizable panels (left/right, top/bottom)
 * - Collapsible panels
 * - Minimum/maximum size constraints
 * - Controlled and uncontrolled modes
 * - Horizontal and vertical orientations
 *
 * @example
 * ```tsx
 * <Splitter orientation="horizontal">
 *   <SplitterPanel id="left" defaultSize="30%">
 *     <div>Left panel</div>
 *   </SplitterPanel>
 *   <SplitterPanel id="right" defaultSize="70%">
 *     <div>Right panel</div>
 *   </SplitterPanel>
 * </Splitter>
 * ```
 *
 * @example
 * ```tsx
 * <Splitter orientation="vertical">
 *   <SplitterPanel id="top" defaultSize="200px" collapsible>
 *     <div>Top panel</div>
 *   </SplitterPanel>
 *   <SplitterPanel id="middle" defaultSize="50%">
 *     <div>Middle panel</div>
 *   </SplitterPanel>
 *   <SplitterPanel id="bottom" defaultSize="30%">
 *     <div>Bottom panel</div>
 *   </SplitterPanel>
 * </Splitter>
 * ```
 */
export default function Splitter({
	children,
	orientation = 'horizontal',
	panels,
	onResize,
	disabled = false,
	handleSize = 4,
	handleClassName,
	className,
	...props
}: Readonly<SplitterProps>) {
	const splitterId = useId();
	const containerRef = useRef<HTMLDivElement>(null);

	const panelConfigs = useMemo(() => extractPanelConfigs(children, panels), [children, panels]);

	const contextValue = useSplitterSetup({
		containerRef,
		panelConfigs,
		orientation,
		disabled,
		onResize,
		handleSize,
		handleClassName,
	});

	const containerClasses = getContainerClasses(orientation, className);
	const renderedChildren = renderSplitterChildren(children, panelConfigs);

	return (
		<SplitterContext.Provider value={contextValue}>
			<div
				ref={containerRef}
				id={splitterId}
				className={containerClasses}
				aria-label="Splitter container"
				{...props}
			>
				{renderedChildren}
			</div>
		</SplitterContext.Provider>
	);
}
