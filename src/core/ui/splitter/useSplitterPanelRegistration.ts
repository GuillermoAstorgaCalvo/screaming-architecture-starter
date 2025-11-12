import { type RefObject, useEffect } from 'react';

interface UseSplitterPanelRegistrationParams {
	readonly panelRef: RefObject<HTMLDivElement | null>;
	readonly id: string;
	readonly registerPanel: (id: string, element: HTMLDivElement) => void;
	readonly unregisterPanel: (id: string) => void;
}

export function useSplitterPanelRegistration({
	panelRef,
	id,
	registerPanel,
	unregisterPanel,
}: UseSplitterPanelRegistrationParams): void {
	useEffect(() => {
		const element = panelRef.current;
		if (!element) {
			return;
		}
		registerPanel(id, element);
		return () => {
			unregisterPanel(id);
		};
	}, [id, registerPanel, unregisterPanel, panelRef]);
}
