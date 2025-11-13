import { useCallback, useState } from 'react';

/**
 * Hook to manage sidebar collapse state
 *
 * @param initialCollapsed - Initial collapsed state @default false
 * @param onCollapseChange - Optional callback when collapse state changes
 * @returns Object with collapsed state and toggle function
 *
 * @example
 * ```tsx
 * const { collapsed, toggleCollapse } = useSidebar(false, (collapsed) => {
 *   console.log('Sidebar collapsed:', collapsed);
 * });
 * ```
 */
export function useSidebar(
	initialCollapsed = false,
	onCollapseChange?: (collapsed: boolean) => void
) {
	const [collapsed, setCollapsed] = useState(initialCollapsed);

	const toggleCollapse = useCallback(() => {
		setCollapsed(prev => {
			const newValue = !prev;
			onCollapseChange?.(newValue);
			return newValue;
		});
	}, [onCollapseChange]);

	const setCollapsedState = useCallback(
		(value: boolean) => {
			setCollapsed(value);
			onCollapseChange?.(value);
		},
		[onCollapseChange]
	);

	return {
		collapsed,
		toggleCollapse,
		setCollapsed: setCollapsedState,
	};
}
