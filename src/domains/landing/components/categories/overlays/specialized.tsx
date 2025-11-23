import { BackdropShowcase } from './specialized/BackdropShowcase';
import { CommandPaletteShowcase } from './specialized/CommandPaletteShowcase';
import { PortalShowcase } from './specialized/PortalShowcase';
import type { OverlaySetters, OverlayState } from './types/types';

export function renderSpecialized(state: OverlayState, setters: OverlaySetters) {
	return (
		<div className="space-y-8">
			<CommandPaletteShowcase
				isOpen={state.commandPaletteOpen}
				onOpen={() => setters.setCommandPaletteOpen(true)}
				onClose={() => setters.setCommandPaletteOpen(false)}
			/>
			<BackdropShowcase
				isOpen={state.backdropOpen}
				onOpen={() => setters.setBackdropOpen(true)}
				onClose={() => setters.setBackdropOpen(false)}
			/>
			<PortalShowcase />
		</div>
	);
}
