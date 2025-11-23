import { HoverCardShowcase } from './popovers/HoverCardShowcase';
import { PopconfirmShowcase } from './popovers/PopconfirmShowcase';
import { PopoverShowcase } from './popovers/PopoverShowcase';
import { TooltipShowcase } from './popovers/TooltipShowcase';
import type { OverlaySetters, OverlayState } from './types/types';

export function renderPopoversAndTooltips(state: OverlayState, setters: OverlaySetters) {
	return (
		<div className="space-y-8">
			<PopoverShowcase
				isOpen={state.popoverOpen}
				onOpen={() => setters.setPopoverOpen(true)}
				onClose={() => setters.setPopoverOpen(false)}
			/>
			<TooltipShowcase />
			<HoverCardShowcase />
			<PopconfirmShowcase
				isOpen={state.popconfirmOpen}
				onClose={() => setters.setPopconfirmOpen(false)}
			/>
		</div>
	);
}
