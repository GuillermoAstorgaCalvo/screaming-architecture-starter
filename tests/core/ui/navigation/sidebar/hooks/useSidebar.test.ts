import { useSidebar } from '@core/ui/navigation/sidebar/hooks/useSidebar';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

describe('useSidebar - Initial State', () => {
	it('returns false for collapsed by default', () => {
		const { result } = renderHook(() => useSidebar());
		expect(result.current.collapsed).toBe(false);
	});

	it('returns initial collapsed state when provided', () => {
		const { result } = renderHook(() => useSidebar(true));
		expect(result.current.collapsed).toBe(true);
	});

	it('returns false when initialCollapsed is false', () => {
		const { result } = renderHook(() => useSidebar(false));
		expect(result.current.collapsed).toBe(false);
	});
});

describe('useSidebar - toggleCollapse', () => {
	it('toggles collapsed state from false to true', () => {
		const { result } = renderHook(() => useSidebar(false));
		expect(result.current.collapsed).toBe(false);

		act(() => {
			result.current.toggleCollapse();
		});

		expect(result.current.collapsed).toBe(true);
	});

	it('toggles collapsed state from true to false', () => {
		const { result } = renderHook(() => useSidebar(true));
		expect(result.current.collapsed).toBe(true);

		act(() => {
			result.current.toggleCollapse();
		});

		expect(result.current.collapsed).toBe(false);
	});

	it('toggles collapsed state multiple times', () => {
		const { result } = renderHook(() => useSidebar(false));

		act(() => {
			result.current.toggleCollapse();
		});
		expect(result.current.collapsed).toBe(true);

		act(() => {
			result.current.toggleCollapse();
		});
		expect(result.current.collapsed).toBe(false);

		act(() => {
			result.current.toggleCollapse();
		});
		expect(result.current.collapsed).toBe(true);
	});
});

describe('useSidebar - setCollapsed', () => {
	it('sets collapsed state to true', () => {
		const { result } = renderHook(() => useSidebar(false));
		expect(result.current.collapsed).toBe(false);

		act(() => {
			result.current.setCollapsed(true);
		});

		expect(result.current.collapsed).toBe(true);
	});

	it('sets collapsed state to false', () => {
		const { result } = renderHook(() => useSidebar(true));
		expect(result.current.collapsed).toBe(true);

		act(() => {
			result.current.setCollapsed(false);
		});

		expect(result.current.collapsed).toBe(false);
	});

	it('sets collapsed state to same value', () => {
		const { result } = renderHook(() => useSidebar(true));
		expect(result.current.collapsed).toBe(true);

		act(() => {
			result.current.setCollapsed(true);
		});

		expect(result.current.collapsed).toBe(true);
	});
});

describe('useSidebar - onCollapseChange Callback', () => {
	it('calls onCollapseChange when toggleCollapse is called', () => {
		const onCollapseChange = vi.fn();
		const { result } = renderHook(() => useSidebar(false, onCollapseChange));

		act(() => {
			result.current.toggleCollapse();
		});

		expect(onCollapseChange).toHaveBeenCalledTimes(1);
		expect(onCollapseChange).toHaveBeenCalledWith(true);
	});

	it('calls onCollapseChange with correct value when toggleCollapse is called multiple times', () => {
		const onCollapseChange = vi.fn();
		const { result } = renderHook(() => useSidebar(false, onCollapseChange));

		act(() => {
			result.current.toggleCollapse();
		});
		expect(onCollapseChange).toHaveBeenCalledWith(true);

		act(() => {
			result.current.toggleCollapse();
		});
		expect(onCollapseChange).toHaveBeenCalledWith(false);

		expect(onCollapseChange).toHaveBeenCalledTimes(2);
	});

	it('calls onCollapseChange when setCollapsed is called', () => {
		const onCollapseChange = vi.fn();
		const { result } = renderHook(() => useSidebar(false, onCollapseChange));

		act(() => {
			result.current.setCollapsed(true);
		});

		expect(onCollapseChange).toHaveBeenCalledTimes(1);
		expect(onCollapseChange).toHaveBeenCalledWith(true);
	});

	it('calls onCollapseChange with correct value when setCollapsed is called', () => {
		const onCollapseChange = vi.fn();
		const { result } = renderHook(() => useSidebar(true, onCollapseChange));

		act(() => {
			result.current.setCollapsed(false);
		});

		expect(onCollapseChange).toHaveBeenCalledTimes(1);
		expect(onCollapseChange).toHaveBeenCalledWith(false);
	});

	it('does not call onCollapseChange when callback is not provided', () => {
		const { result } = renderHook(() => useSidebar(false));

		act(() => {
			result.current.toggleCollapse();
		});

		// Should not throw and should work without callback
		expect(result.current.collapsed).toBe(true);
	});

	it('calls onCollapseChange even when setting same value', () => {
		const onCollapseChange = vi.fn();
		const { result } = renderHook(() => useSidebar(true, onCollapseChange));

		act(() => {
			result.current.setCollapsed(true);
		});

		expect(onCollapseChange).toHaveBeenCalledTimes(1);
		expect(onCollapseChange).toHaveBeenCalledWith(true);
	});
});

describe('useSidebar - Return Values', () => {
	it('returns collapsed, toggleCollapse, and setCollapsed', () => {
		const { result } = renderHook(() => useSidebar());

		expect(result.current).toHaveProperty('collapsed');
		expect(result.current).toHaveProperty('toggleCollapse');
		expect(result.current).toHaveProperty('setCollapsed');

		expect(typeof result.current.collapsed).toBe('boolean');
		expect(typeof result.current.toggleCollapse).toBe('function');
		expect(typeof result.current.setCollapsed).toBe('function');
	});
});

describe('useSidebar - Edge Cases', () => {
	it('handles rapid toggle calls', () => {
		const { result } = renderHook(() => useSidebar(false));

		act(() => {
			result.current.toggleCollapse();
			result.current.toggleCollapse();
			result.current.toggleCollapse();
		});

		expect(result.current.collapsed).toBe(true);
	});

	it('handles rapid setCollapsed calls', () => {
		const onCollapseChange = vi.fn();
		const { result } = renderHook(() => useSidebar(false, onCollapseChange));

		act(() => {
			result.current.setCollapsed(true);
			result.current.setCollapsed(false);
			result.current.setCollapsed(true);
		});

		expect(result.current.collapsed).toBe(true);
		expect(onCollapseChange).toHaveBeenCalledTimes(3);
	});

	it('maintains state consistency across multiple operations', () => {
		const { result } = renderHook(() => useSidebar(false));

		act(() => {
			result.current.setCollapsed(true);
		});
		expect(result.current.collapsed).toBe(true);

		act(() => {
			result.current.toggleCollapse();
		});
		expect(result.current.collapsed).toBe(false);

		act(() => {
			result.current.setCollapsed(true);
		});
		expect(result.current.collapsed).toBe(true);
	});
});
