import type { TabsProps } from '@src-types/ui/navigation/tabs';
import { type KeyboardEvent, useCallback, useMemo } from 'react';

export interface UseTabsOptions {
	readonly items: TabsProps['items'];
	readonly activeTabId: string;
	readonly onTabChange: (tabId: string) => void;
}

export interface UseTabsReturn {
	readonly handleKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
	readonly getNextTabId: (currentTabId: string, direction: 'next' | 'previous') => string | null;
	readonly getFirstTabId: () => string | null;
	readonly getLastTabId: () => string | null;
}

interface KeyHandlerHelpers {
	readonly getNextTabId: (currentTabId: string, direction: 'next' | 'previous') => string | null;
	readonly getFirstTabId: () => string | null;
	readonly getLastTabId: () => string | null;
	readonly activeTabId: string;
	readonly onTabChange: (tabId: string) => void;
}

interface TabItem {
	readonly id: string;
	readonly disabled?: boolean;
}

function createNavigationHelpers(enabledItems: readonly TabItem[]) {
	const getNextTabId = (currentTabId: string, direction: 'next' | 'previous'): string | null => {
		if (enabledItems.length === 0) {
			return null;
		}

		const currentIndex = enabledItems.findIndex(item => item.id === currentTabId);
		if (currentIndex === -1) {
			return enabledItems[0]?.id ?? null;
		}

		const nextIndex =
			direction === 'next'
				? (currentIndex + 1) % enabledItems.length
				: (currentIndex - 1 + enabledItems.length) % enabledItems.length;

		return enabledItems[nextIndex]?.id ?? null;
	};

	const getFirstTabId = (): string | null => enabledItems[0]?.id ?? null;
	const getLastTabId = (): string | null => enabledItems.at(-1)?.id ?? null;

	return { getNextTabId, getFirstTabId, getLastTabId };
}

function getTargetTabIdFromKey(key: string, helpers: KeyHandlerHelpers): string | null {
	switch (key) {
		case 'ArrowLeft': {
			return helpers.getNextTabId(helpers.activeTabId, 'previous');
		}
		case 'ArrowRight': {
			return helpers.getNextTabId(helpers.activeTabId, 'next');
		}
		case 'Home': {
			return helpers.getFirstTabId();
		}
		case 'End': {
			return helpers.getLastTabId();
		}
		default: {
			return null;
		}
	}
}

/**
 * Hook to handle keyboard navigation for tabs
 *
 * Implements ARIA keyboard navigation patterns:
 * - ArrowLeft/ArrowRight: Navigate between tabs
 * - Home: Move to first tab
 * - End: Move to last tab
 *
 * @param options - Configuration options for tabs
 * @returns Keyboard event handler and navigation helpers
 */
export function useTabs({ items, activeTabId, onTabChange }: UseTabsOptions): UseTabsReturn {
	const enabledItems = useMemo(
		() => items.filter((item: TabsProps['items'][number]) => !item.disabled),
		[items]
	);
	const navigationHelpers = useMemo(() => createNavigationHelpers(enabledItems), [enabledItems]);

	const { getNextTabId, getFirstTabId, getLastTabId } = navigationHelpers;

	const handleKeyDown = useCallback(
		(event: KeyboardEvent<HTMLDivElement>): void => {
			const targetTabId = getTargetTabIdFromKey(event.key, {
				getNextTabId,
				getFirstTabId,
				getLastTabId,
				activeTabId,
				onTabChange,
			});

			if (targetTabId) {
				event.preventDefault();
				onTabChange(targetTabId);
			}
		},
		[activeTabId, getNextTabId, getFirstTabId, getLastTabId, onTabChange]
	);

	return {
		handleKeyDown,
		getNextTabId,
		getFirstTabId,
		getLastTabId,
	};
}
