/**
 * Tests for SkipToContent component
 *
 * Tests the skip link component for keyboard navigation:
 * - Skip link rendering
 * - Skip link functionality (focus, scroll, error handling)
 */

import SkipToContent from '@core/a11y/skipToContent';
import { ARIA_LABELS } from '@core/constants/aria';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const DEFAULT_TARGET_ID = 'main-content';
const CUSTOM_TARGET_ID = 'custom-content';
const CUSTOM_LABEL = 'Skip to page content';
const CUSTOM_CLASSNAME = 'custom-skip-link';
const REDUCED_MOTION_MEDIA = '(prefers-reduced-motion: reduce)';

// Helper functions
function createTargetElement(id: string, tagName = 'main'): HTMLElement {
	const element = document.createElement(tagName);
	element.id = id;
	document.body.append(element);
	return element;
}

function createMockLogger() {
	return {
		warn: vi.fn(),
		error: vi.fn(),
		info: vi.fn(),
		debug: vi.fn(),
	};
}

function createMediaQueryList(matches = false) {
	return {
		matches,
		media: REDUCED_MOTION_MEDIA,
		onchange: null,
		addListener: vi.fn(),
		removeListener: vi.fn(),
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn(),
	};
}

function createMatchMediaMock(matches = false) {
	return vi.fn().mockReturnValue(createMediaQueryList(matches));
}

function setupMocks() {
	const mockScrollIntoView = vi.fn();
	HTMLElement.prototype.scrollIntoView =
		mockScrollIntoView as typeof HTMLElement.prototype.scrollIntoView;

	const mockFocus = vi.fn();
	HTMLElement.prototype.focus = mockFocus as typeof HTMLElement.prototype.focus;

	const mockMatchMedia = createMatchMediaMock();
	globalThis.window.matchMedia = mockMatchMedia as typeof globalThis.window.matchMedia;

	return { mockScrollIntoView, mockFocus, mockMatchMedia };
}

function clickSkipLink() {
	const link = screen.getByRole('link');
	fireEvent.click(link);
	return link;
}

describe('SkipToContent - rendering', () => {
	it('renders skip link with default props', () => {
		renderWithProviders(<SkipToContent />);

		const link = screen.getByRole('link');
		expect(link).toBeInTheDocument();
		expect(link).toHaveAttribute('href', `#${DEFAULT_TARGET_ID}`);
	});

	it('renders skip link with custom targetId', () => {
		renderWithProviders(<SkipToContent targetId={CUSTOM_TARGET_ID} />);

		const link = screen.getByRole('link');
		expect(link).toHaveAttribute('href', `#${CUSTOM_TARGET_ID}`);
	});

	it('renders skip link with default label from ARIA_LABELS', () => {
		renderWithProviders(<SkipToContent />);

		const link = screen.getByRole('link');
		expect(link).toHaveTextContent(ARIA_LABELS.SKIP_TO_CONTENT);
	});

	it('renders skip link with custom label', () => {
		renderWithProviders(<SkipToContent label={CUSTOM_LABEL} />);

		const link = screen.getByRole('link');
		expect(link).toHaveTextContent(CUSTOM_LABEL);
	});

	it('renders skip link with custom className', () => {
		renderWithProviders(<SkipToContent className={CUSTOM_CLASSNAME} />);

		const link = screen.getByRole('link');
		expect(link).toHaveClass(CUSTOM_CLASSNAME);
	});

	it('renders skip link with sr-only class by default', () => {
		renderWithProviders(<SkipToContent />);

		const link = screen.getByRole('link');
		expect(link).toHaveClass('sr-only');
	});
});

describe('SkipToContent - click behavior', () => {
	let mockScrollIntoView: ReturnType<typeof vi.fn>;
	let mockFocus: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		document.body.innerHTML = '';
		const { mockScrollIntoView: scrollMock, mockFocus: focusMock } = setupMocks();
		mockScrollIntoView = scrollMock;
		mockFocus = focusMock;
	});

	it('prevents default navigation on click', () => {
		renderWithProviders(<SkipToContent />);

		const link = screen.getByRole('link');
		const preventDefault = vi.fn();
		const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
		Object.defineProperty(clickEvent, 'preventDefault', { value: preventDefault });

		fireEvent(link, clickEvent);

		expect(preventDefault).toHaveBeenCalled();
	});

	it('focuses target element when clicked', () => {
		createTargetElement(DEFAULT_TARGET_ID);
		renderWithProviders(<SkipToContent />);

		clickSkipLink();

		expect(mockFocus).toHaveBeenCalledTimes(1);
	});

	it('scrolls to target element when clicked', () => {
		createTargetElement(DEFAULT_TARGET_ID);
		renderWithProviders(<SkipToContent />);

		clickSkipLink();

		expect(mockScrollIntoView).toHaveBeenCalledTimes(1);
		expect(mockScrollIntoView).toHaveBeenCalledWith({
			behavior: 'smooth',
			block: 'start',
		});
	});
});

describe('SkipToContent - scroll behavior', () => {
	let mockScrollIntoView: ReturnType<typeof vi.fn>;
	let mockMatchMedia: ReturnType<typeof createMatchMediaMock>;

	beforeEach(() => {
		document.body.innerHTML = '';
		const { mockScrollIntoView: scrollMock, mockMatchMedia: mediaMock } = setupMocks();
		mockScrollIntoView = scrollMock;
		mockMatchMedia = mediaMock;
	});

	it('uses smooth scroll behavior by default', () => {
		mockMatchMedia.mockReturnValue(createMediaQueryList(false));
		createTargetElement(DEFAULT_TARGET_ID);
		renderWithProviders(<SkipToContent />);

		clickSkipLink();

		expect(mockScrollIntoView).toHaveBeenCalledWith({
			behavior: 'smooth',
			block: 'start',
		});
	});

	it('uses auto scroll behavior when prefers-reduced-motion is enabled', () => {
		mockMatchMedia.mockReturnValue(createMediaQueryList(true));
		createTargetElement(DEFAULT_TARGET_ID);
		renderWithProviders(<SkipToContent />);

		clickSkipLink();

		expect(mockScrollIntoView).toHaveBeenCalledWith({
			behavior: 'auto',
			block: 'start',
		});
	});
});

describe('SkipToContent - tabindex handling', () => {
	beforeEach(() => {
		document.body.innerHTML = '';
		setupMocks();
	});

	it('sets tabindex="-1" on target element if not present', () => {
		const targetElement = createTargetElement(DEFAULT_TARGET_ID);
		renderWithProviders(<SkipToContent />);

		clickSkipLink();

		expect(targetElement.getAttribute('tabindex')).toBe('-1');
	});

	it('does not override existing tabindex on target element', () => {
		const targetElement = createTargetElement(DEFAULT_TARGET_ID);
		targetElement.setAttribute('tabindex', '0');
		renderWithProviders(<SkipToContent />);

		clickSkipLink();

		expect(targetElement.getAttribute('tabindex')).toBe('0');
	});
});

describe('SkipToContent - error handling', () => {
	let mockScrollIntoView: ReturnType<typeof vi.fn>;
	let mockFocus: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		document.body.innerHTML = '';
		const { mockScrollIntoView: scrollMock, mockFocus: focusMock } = setupMocks();
		mockScrollIntoView = scrollMock;
		mockFocus = focusMock;
	});

	it('handles missing target element gracefully', () => {
		const mockLogger = createMockLogger();
		renderWithProviders(<SkipToContent />, { logger: mockLogger });

		clickSkipLink();

		expect(mockLogger.warn).toHaveBeenCalledWith('SkipToContent: Target element not found', {
			targetId: DEFAULT_TARGET_ID,
		});
		expect(mockFocus).not.toHaveBeenCalled();
		expect(mockScrollIntoView).not.toHaveBeenCalled();
	});

	it('handles non-HTMLElement target gracefully', () => {
		const mockLogger = createMockLogger();
		const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		svgElement.id = DEFAULT_TARGET_ID;
		document.body.append(svgElement);

		renderWithProviders(<SkipToContent />, { logger: mockLogger });

		clickSkipLink();

		expect(mockLogger.warn).toHaveBeenCalledWith(
			'SkipToContent: Target element is not an HTMLElement',
			{ targetId: DEFAULT_TARGET_ID }
		);
		expect(mockFocus).not.toHaveBeenCalled();
		expect(mockScrollIntoView).not.toHaveBeenCalled();
	});
});

describe('SkipToContent - targetId variations', () => {
	let mockScrollIntoView: ReturnType<typeof vi.fn>;
	let mockFocus: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		document.body.innerHTML = '';
		const { mockScrollIntoView: scrollMock, mockFocus: focusMock } = setupMocks();
		mockScrollIntoView = scrollMock;
		mockFocus = focusMock;
	});

	it('works with custom targetId', () => {
		createTargetElement(CUSTOM_TARGET_ID);
		renderWithProviders(<SkipToContent targetId={CUSTOM_TARGET_ID} />);

		clickSkipLink();

		expect(mockFocus).toHaveBeenCalledTimes(1);
		expect(mockScrollIntoView).toHaveBeenCalledTimes(1);
	});

	it('escapes special characters in targetId to prevent CSS injection', () => {
		const specialId = 'test#id';
		createTargetElement(specialId);
		renderWithProviders(<SkipToContent targetId={specialId} />);

		clickSkipLink();

		expect(mockFocus).toHaveBeenCalledTimes(1);
	});

	it('handles targetId with various special characters', () => {
		const specialIds = ['test.id', 'test#id', 'test:id', 'test[id]', 'test(id)'];
		for (const specialId of specialIds) {
			document.body.innerHTML = '';
			const { mockFocus: freshMockFocus } = setupMocks();
			const element = createTargetElement(specialId);
			renderWithProviders(<SkipToContent targetId={specialId} />);

			clickSkipLink();

			expect(freshMockFocus).toHaveBeenCalledTimes(1);
			expect(element.getAttribute('tabindex')).toBe('-1');
		}
	});

	it('preserves existing tabindex values other than null', () => {
		const targetElement = createTargetElement(DEFAULT_TARGET_ID);
		targetElement.setAttribute('tabindex', '1');
		renderWithProviders(<SkipToContent />);

		clickSkipLink();

		expect(targetElement.getAttribute('tabindex')).toBe('1');
	});

	it('preserves existing tabindex="0" on target element', () => {
		const targetElement = createTargetElement(DEFAULT_TARGET_ID);
		targetElement.setAttribute('tabindex', '0');
		renderWithProviders(<SkipToContent />);

		clickSkipLink();

		expect(targetElement.getAttribute('tabindex')).toBe('0');
	});
});
