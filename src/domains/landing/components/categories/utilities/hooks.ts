import { useState } from 'react';

import {
	INITIAL_INFINITE_ITEMS,
	INITIAL_SORTABLE_ITEMS,
	type LoadingState,
} from './constants/constants';

// Custom hooks for managing utilities category state
export const useInteractionState = () => {
	const [focusTrapEnabled, setFocusTrapEnabled] = useState(false);
	const [sortableItems, setSortableItems] = useState(INITIAL_SORTABLE_ITEMS);
	return { focusTrapEnabled, setFocusTrapEnabled, sortableItems, setSortableItems };
};

export const useScrollState = () => {
	const [infiniteItems, setInfiniteItems] = useState(INITIAL_INFINITE_ITEMS);
	const [infiniteLoading, setInfiniteLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	return {
		infiniteItems,
		setInfiniteItems,
		infiniteLoading,
		setInfiniteLoading,
		hasMore,
		setHasMore,
		refreshing,
		setRefreshing,
	};
};

export const useMotionState = () => {
	const [motionVisible, setMotionVisible] = useState(true);
	const [motionPresenceVisible, setMotionPresenceVisible] = useState(true);
	const [motionAccordionOpen, setMotionAccordionOpen] = useState(false);
	return {
		motionVisible,
		setMotionVisible,
		motionPresenceVisible,
		setMotionPresenceVisible,
		motionAccordionOpen,
		setMotionAccordionOpen,
	};
};

export const useOtherState = () => {
	const [loadingState, setLoadingState] = useState<LoadingState>('loading');
	return { loadingState, setLoadingState };
};
