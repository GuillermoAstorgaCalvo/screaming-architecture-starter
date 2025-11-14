import { designTokens } from '@core/constants/designTokens';
import { useTranslation } from '@core/i18n/useTranslation';
import { SplitterContext } from '@core/ui/utilities/splitter/components/SplitterContext';
import {
	extractPanelConfigs,
	getContainerClasses,
} from '@core/ui/utilities/splitter/helpers/Splitter.helpers';
import { renderSplitterChildren } from '@core/ui/utilities/splitter/helpers/Splitter.render';
import { useSplitterSetup } from '@core/ui/utilities/splitter/hooks/Splitter.hooks';
import type { SplitterProps } from '@src-types/ui/layout/splitter';
import { useId, useMemo, useRef } from 'react';

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
	handleSize = designTokens.spacing.xs,
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

	const { t } = useTranslation('common');
	const containerClasses = getContainerClasses(orientation, className);
	const renderedChildren = renderSplitterChildren(children, panelConfigs);

	return (
		<SplitterContext.Provider value={contextValue}>
			<div
				ref={containerRef}
				id={splitterId}
				className={containerClasses}
				aria-label={t('a11y.splitterContainer')}
				{...props}
			>
				{renderedChildren}
			</div>
		</SplitterContext.Provider>
	);
}
