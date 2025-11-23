/**
 * Tests for useSplitterPanelRegistration hook
 *
 * Tests the useSplitterPanelRegistration hook:
 * - Panel registration on mount
 * - Panel unregistration on unmount
 * - Effect dependencies
 */

import { useSplitterPanelRegistration } from '@core/ui/utilities/splitter/hooks/useSplitterPanelRegistration';
import { renderHook } from '@testing-library/react';
import { createRef, type RefObject } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

beforeEach(() => {
	vi.clearAllMocks();
});

const createMockHandlers = () => ({
	registerPanel: vi.fn<(id: string, element: HTMLDivElement) => void>(),
	unregisterPanel: vi.fn<(id: string) => void>(),
});

const createPanelRefWithElement = (): RefObject<HTMLDivElement | null> => {
	const panelRef = createRef<HTMLDivElement>();
	const element = document.createElement('div');
	panelRef.current = element;
	return panelRef;
};

const createPanelRefWithoutElement = (): RefObject<HTMLDivElement | null> => {
	return createRef<HTMLDivElement>();
};

const renderHookWithProps = (
	panelRef: RefObject<HTMLDivElement | null>,
	id: string,
	registerPanel: (id: string, element: HTMLDivElement) => void,
	unregisterPanel: (id: string) => void
) => {
	return renderHook(() =>
		useSplitterPanelRegistration({
			panelRef,
			id,
			registerPanel,
			unregisterPanel,
		})
	);
};

describe('useSplitterPanelRegistration - Registration', () => {
	it('registers panel on mount', () => {
		const { registerPanel, unregisterPanel } = createMockHandlers();
		const panelRef = createPanelRefWithElement();

		renderHookWithProps(panelRef, 'panel1', registerPanel, unregisterPanel);

		expect(registerPanel).toHaveBeenCalledWith('panel1', panelRef.current);
	});

	it('does not register when element is null', () => {
		const { registerPanel, unregisterPanel } = createMockHandlers();
		const panelRef = createPanelRefWithoutElement();

		renderHookWithProps(panelRef, 'panel1', registerPanel, unregisterPanel);

		expect(registerPanel).not.toHaveBeenCalled();
	});
});

describe('useSplitterPanelRegistration - Unregistration', () => {
	it('unregisters panel on unmount', () => {
		const { registerPanel, unregisterPanel } = createMockHandlers();
		const panelRef = createPanelRefWithElement();

		const { unmount } = renderHookWithProps(panelRef, 'panel1', registerPanel, unregisterPanel);

		unmount();

		expect(unregisterPanel).toHaveBeenCalledWith('panel1');
	});
});

describe('useSplitterPanelRegistration - Re-registration', () => {
	it('re-registers when id changes', () => {
		const { registerPanel, unregisterPanel } = createMockHandlers();
		const panelRef = createPanelRefWithElement();

		const { rerender } = renderHook(
			({ id }) =>
				useSplitterPanelRegistration({
					panelRef,
					id,
					registerPanel,
					unregisterPanel,
				}),
			{ initialProps: { id: 'panel1' } }
		);

		expect(registerPanel).toHaveBeenCalledWith('panel1', panelRef.current);
		expect(registerPanel).toHaveBeenCalledTimes(1);

		rerender({ id: 'panel2' });

		expect(unregisterPanel).toHaveBeenCalledWith('panel1');
		expect(registerPanel).toHaveBeenCalledWith('panel2', panelRef.current);
		expect(registerPanel).toHaveBeenCalledTimes(2);
	});
});
