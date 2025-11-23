import { useState } from 'react';

import type { LoadingState } from './constants/constants';
import { useInteractionState, useMotionState, useOtherState, useScrollState } from './hooks';

export interface UtilitiesCategoryState {
	activeSubcategory: string;
	setActiveSubcategory: (value: string) => void;
	// Interaction state
	focusTrapEnabled: boolean;
	setFocusTrapEnabled: (value: boolean) => void;
	sortableItems: Array<{ id: string; data: { name: string } }>;
	setSortableItems: (items: Array<{ id: string; data: { name: string } }>) => void;
	// Scroll state
	infiniteItems: Array<{ id: number; name: string }>;
	setInfiniteItems: (items: Array<{ id: number; name: string }>) => void;
	infiniteLoading: boolean;
	setInfiniteLoading: (value: boolean) => void;
	hasMore: boolean;
	setHasMore: (value: boolean) => void;
	refreshing: boolean;
	setRefreshing: (value: boolean) => void;
	// Motion state
	motionVisible: boolean;
	setMotionVisible: (value: boolean) => void;
	motionPresenceVisible: boolean;
	setMotionPresenceVisible: (value: boolean) => void;
	motionAccordionOpen: boolean;
	setMotionAccordionOpen: (value: boolean) => void;
	// Other state
	loadingState: LoadingState;
	setLoadingState: (state: LoadingState) => void;
}

export function useUtilitiesCategoryState(): UtilitiesCategoryState {
	const [activeSubcategory, setActiveSubcategory] = useState('motion');
	const interactionState = useInteractionState();
	const scrollState = useScrollState();
	const motionState = useMotionState();
	const otherState = useOtherState();

	return {
		activeSubcategory,
		setActiveSubcategory,
		...interactionState,
		...scrollState,
		...motionState,
		...otherState,
	};
}
