export interface InteractionShowcaseProps {
	readonly focusTrapEnabled: boolean;
	readonly setFocusTrapEnabled: (enabled: boolean) => void;
	readonly sortableItems: Array<{ id: string; data: { name: string } }>;
	readonly setSortableItems: (items: Array<{ id: string; data: { name: string } }>) => void;
}
