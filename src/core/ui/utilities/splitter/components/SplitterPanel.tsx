import { useSplitterContext } from '@core/ui/utilities/splitter/components/SplitterContext';
import { calculatePanelStyle } from '@core/ui/utilities/splitter/helpers/useSplitter.helpers';
import type { PanelState } from '@core/ui/utilities/splitter/hooks/useSplitter.state';
import { useSplitterPanelRegistration } from '@core/ui/utilities/splitter/hooks/useSplitterPanelRegistration';
import { useSplitterPanelSize } from '@core/ui/utilities/splitter/hooks/useSplitterPanelSize';
import type { SplitterPanelProps } from '@src-types/ui/layout/splitter';
import { type ForwardedRef, forwardRef, type RefObject, useRef } from 'react';
import { twMerge } from 'tailwind-merge';

function usePanelRef(ref: ForwardedRef<HTMLDivElement>) {
	const internalRef = useRef<HTMLDivElement>(null);
	return (typeof ref === 'function' ? internalRef : ref) ?? internalRef;
}

function usePanelState(
	id: string,
	controlledCollapsed: boolean | undefined,
	defaultCollapsed: boolean
) {
	const { getPanelState } = useSplitterContext();
	const panelState = getPanelState(id);
	const isCollapsed = panelState?.collapsed ?? controlledCollapsed ?? defaultCollapsed;
	return { panelState, isCollapsed };
}

function SplitterPanelContent({
	children,
	id,
	defaultSize,
	collapsible = false,
	defaultCollapsed = false,
	collapsed: controlledCollapsed,
	collapsedSize = 0,
	className,
	style,
	panelRef,
	...props
}: SplitterPanelProps & { panelRef: RefObject<HTMLDivElement | null> }) {
	const { orientation, disabled, registerPanel, unregisterPanel } = useSplitterContext();
	const { panelState, isCollapsed } = usePanelState(id, controlledCollapsed, defaultCollapsed);

	useSplitterPanelRegistration({ panelRef, id, registerPanel, unregisterPanel });
	useSplitterPanelSize({
		panelRef,
		orientation,
		panelState: panelState ?? (undefined as PanelState | undefined),
		isCollapsed,
		collapsible,
		collapsedSize,
		defaultSize,
	});

	const panelClasses = twMerge('overflow-hidden', disabled && 'opacity-50', className);
	const panelStyle = calculatePanelStyle({
		orientation,
		panelState: panelState ? { size: panelState.size ?? undefined } : undefined,
		isCollapsed,
		collapsible,
		collapsedSize,
		style,
	});

	return (
		<div ref={panelRef} id={id} className={panelClasses} style={panelStyle} {...props}>
			{children}
		</div>
	);
}

export const SplitterPanel = forwardRef<HTMLDivElement, SplitterPanelProps>((props, ref) => {
	const panelRef = usePanelRef(ref);
	return <SplitterPanelContent {...props} panelRef={panelRef} />;
});

SplitterPanel.displayName = 'SplitterPanel';
