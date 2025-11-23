/**
 * Shared test helpers and constants for Affix component tests
 */

import Affix from '@core/ui/affix/Affix';
import { renderWithProviders } from '@tests/utils/testUtils';
import type React from 'react';
import { expect, vi } from 'vitest';

export const CONTENT_TEXT = 'Affix Content';
export const HEADER_LABEL = 'Header';
export const BANNER_ROLE = 'banner';

export type AffixPosition = 'top' | 'bottom' | 'left' | 'right';
export const ALL_POSITIONS: Array<AffixPosition> = ['top', 'bottom', 'left', 'right'];

// Helper to get the affix root element
export function getAffixElement(container: HTMLElement): HTMLElement {
	return container.firstChild as HTMLElement;
}

// Helper to render and assert affix element exists
export function renderAndAssertAffixExists(jsx: React.ReactElement) {
	const { container } = renderWithProviders(jsx);
	const affix = getAffixElement(container);
	expect(affix).toBeInTheDocument();
	return { container, affix };
}

// Helper to test edge case with simple existence check
export function assertAffixExists(jsx: React.ReactElement) {
	renderAndAssertAffixExists(jsx);
}

// Helper to test inline styles for a position
export function testPositionInlineStyles(position: AffixPosition, offset: number, zIndex: number) {
	const { container } = renderWithProviders(
		<Affix position={position} offset={offset} zIndex={zIndex}>
			<div>{CONTENT_TEXT}</div>
		</Affix>
	);

	const affix = getAffixElement(container);
	expect(affix).toBeInTheDocument();
}

// Helper to test all position variants with offset
export function testAllPositionsWithOffset() {
	for (const position of ALL_POSITIONS) {
		const { container, unmount } = renderWithProviders(
			<Affix position={position} offset={20}>
				<div>{position} content</div>
			</Affix>
		);

		const affix = getAffixElement(container);
		expect(affix).toBeInTheDocument();
		unmount();
	}
}

// Helper to test disabled state with all position variants
export function testDisabledStateWithAllPositions() {
	for (const position of ALL_POSITIONS) {
		const { container, unmount } = renderWithProviders(
			<Affix position={position} enabled={false}>
				<div>{position} content</div>
			</Affix>
		);

		const affix = getAffixElement(container);
		expect(affix).toHaveClass('relative');
		unmount();
	}
}

// Mock scroll behavior
export const mockScrollY = vi.fn(() => 0);
export const mockScrollX = vi.fn(() => 0);
export const mockGetBoundingClientRect = vi.fn(
	(): DOMRect => ({
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		width: 0,
		height: 0,
		x: 0,
		y: 0,
		toJSON: vi.fn(),
	})
);

export function setupScrollMocks() {
	// Reset mocks
	vi.clearAllMocks();
	mockScrollY.mockReturnValue(0);
	mockScrollX.mockReturnValue(0);

	// Mock scrollY and scrollX on window
	const windowObj = globalThis.window || globalThis;
	Object.defineProperty(windowObj, 'scrollY', {
		configurable: true,
		get: mockScrollY,
	});

	Object.defineProperty(windowObj, 'scrollX', {
		configurable: true,
		get: mockScrollX,
	});

	// Mock getBoundingClientRect
	Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;
}
