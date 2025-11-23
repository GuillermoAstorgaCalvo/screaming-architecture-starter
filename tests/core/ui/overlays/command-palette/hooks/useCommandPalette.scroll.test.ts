/**
 * useScrollToHighlighted Tests
 *
 * Tests for scroll management hook:
 * - Scrolls to highlighted element
 * - Handles missing ref gracefully
 * - Handles missing element gracefully
 * - Does not scroll when index is negative
 */

import { useScrollToHighlighted } from '@core/ui/overlays/command-palette/hooks/useCommandPalette.scroll';
import { renderHook } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';

describe('useScrollToHighlighted', () => {
	it('should be a function', () => {
		expect(typeof useScrollToHighlighted).toBe('function');
	});

	it('scrolls to highlighted element when index is valid', () => {
		const commandsListRef = createRef<HTMLDivElement>();
		const mockScrollIntoView = vi.fn();
		const mockElement = document.createElement('div');
		mockElement.dataset.commandIndex = '1';
		mockElement.scrollIntoView = mockScrollIntoView;

		const mockContainer = document.createElement('div');
		mockContainer.append(mockElement);

		commandsListRef.current = mockContainer;

		renderHook(() => useScrollToHighlighted(1, commandsListRef));

		expect(mockScrollIntoView).toHaveBeenCalledWith({
			behavior: 'smooth',
			block: 'nearest',
		});
	});

	it('does not scroll when index is negative', () => {
		const commandsListRef = createRef<HTMLDivElement>();
		const mockScrollIntoView = vi.fn();
		const mockElement = document.createElement('div');
		mockElement.scrollIntoView = mockScrollIntoView;

		const mockContainer = document.createElement('div');
		mockContainer.append(mockElement);

		commandsListRef.current = mockContainer;

		renderHook(() => useScrollToHighlighted(-1, commandsListRef));

		expect(mockScrollIntoView).not.toHaveBeenCalled();
	});

	it('handles missing ref gracefully', () => {
		const commandsListRef = createRef<HTMLDivElement>();

		expect(() => {
			renderHook(() => useScrollToHighlighted(0, commandsListRef));
		}).not.toThrow();
	});

	it('handles missing element gracefully', () => {
		const commandsListRef = createRef<HTMLDivElement>();
		const mockContainer = document.createElement('div');
		commandsListRef.current = mockContainer;

		expect(() => {
			renderHook(() => useScrollToHighlighted(0, commandsListRef));
		}).not.toThrow();
	});

	it('scrolls when highlighted index changes', () => {
		const commandsListRef = createRef<HTMLDivElement>();
		const mockScrollIntoView1 = vi.fn();
		const mockScrollIntoView2 = vi.fn();

		const mockElement1 = document.createElement('div');
		mockElement1.dataset.commandIndex = '0';
		mockElement1.scrollIntoView = mockScrollIntoView1;

		const mockElement2 = document.createElement('div');
		mockElement2.dataset.commandIndex = '1';
		mockElement2.scrollIntoView = mockScrollIntoView2;

		const mockContainer = document.createElement('div');
		mockContainer.append(mockElement1);
		mockContainer.append(mockElement2);

		commandsListRef.current = mockContainer;

		const { rerender } = renderHook(
			({ highlightedIndex }) => useScrollToHighlighted(highlightedIndex, commandsListRef),
			{ initialProps: { highlightedIndex: 0 } }
		);

		expect(mockScrollIntoView1).toHaveBeenCalled();

		mockScrollIntoView1.mockClear();

		rerender({ highlightedIndex: 1 });

		expect(mockScrollIntoView2).toHaveBeenCalled();
	});
});
