import { DrawerShowcase } from './panels/DrawerShowcase';
import { SheetShowcase } from './panels/SheetShowcase';
import type { OverlaySetters, OverlayState } from './types/types';

export function renderPanels(state: OverlayState, setters: OverlaySetters) {
	return (
		<div className="space-y-8">
			<DrawerShowcase
				isOpen={state.drawerOpen}
				onOpen={() => setters.setDrawerOpen(true)}
				onClose={() => setters.setDrawerOpen(false)}
			/>
			<SheetShowcase
				isOpen={state.sheetOpen}
				onOpen={() => setters.setSheetOpen(true)}
				onClose={() => setters.setSheetOpen(false)}
			/>
		</div>
	);
}
