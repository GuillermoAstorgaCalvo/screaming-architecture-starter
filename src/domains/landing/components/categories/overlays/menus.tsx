import { ActionSheetShowcase } from './menus/ActionSheetShowcase';
import { ContextMenuShowcase } from './menus/ContextMenuShowcase';
import { DropdownMenuShowcase } from './menus/DropdownMenuShowcase';
import type { OverlaySetters, OverlayState } from './types/types';

export function renderMenus(state: OverlayState, setters: OverlaySetters) {
	return (
		<div className="space-y-8">
			<DropdownMenuShowcase />
			<ContextMenuShowcase />
			<ActionSheetShowcase
				isOpen={state.actionSheetOpen}
				onOpen={() => setters.setActionSheetOpen(true)}
				onClose={() => setters.setActionSheetOpen(false)}
			/>
		</div>
	);
}
