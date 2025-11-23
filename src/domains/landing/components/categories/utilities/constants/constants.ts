// Constants and types for Utilities category showcases

export type LoadingState = 'loading' | 'error' | 'empty' | 'success';

export interface InfiniteScrollState {
	items: Array<{ id: number; name: string }>;
	loading: boolean;
	hasMore: boolean;
}

export interface InfiniteScrollActions {
	setItems: (items: Array<{ id: number; name: string }>) => void;
	setLoading: (loading: boolean) => void;
	setHasMore: (hasMore: boolean) => void;
}

// Initial data constants
export const INITIAL_INFINITE_ITEMS = Array.from({ length: 10 }, (_, i) => ({
	id: i + 1,
	name: `Item ${i + 1}`,
}));

export const INITIAL_SORTABLE_ITEMS = [
	{ id: '1', data: { name: 'First Item' } },
	{ id: '2', data: { name: 'Second Item' } },
	{ id: '3', data: { name: 'Third Item' } },
	{ id: '4', data: { name: 'Fourth Item' } },
];

export const VIRTUALIZED_ITEMS = Array.from({ length: 1000 }, (_, i) => ({
	id: i + 1,
	text: `Virtualized Item ${i + 1}`,
}));

export const MOTION_LIST_ITEMS = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'];

// Infinite scroll constants
export const ITEMS_PER_LOAD = 10;
export const MAX_ITEMS = 50;
export const LOAD_DELAY_MS = 1000;
export const REFRESH_DELAY = 1500;

// Helper functions
export const createNewInfiniteItems = (currentLength: number) =>
	Array.from({ length: ITEMS_PER_LOAD }, (_, i) => ({
		id: currentLength + i + 1,
		name: `Item ${currentLength + i + 1}`,
	}));

export const handleInfiniteScrollLoad = (
	state: InfiniteScrollState,
	actions: InfiniteScrollActions
) => {
	actions.setLoading(true);
	setTimeout(() => {
		const newItems = createNewInfiniteItems(state.items.length);
		actions.setItems([...state.items, ...newItems]);
		actions.setLoading(false);
		if (state.items.length >= MAX_ITEMS) {
			actions.setHasMore(false);
		}
	}, LOAD_DELAY_MS);
};

export const createInfiniteScrollLoadHandler =
	(state: InfiniteScrollState, actions: InfiniteScrollActions) => () =>
		handleInfiniteScrollLoad(state, actions);
