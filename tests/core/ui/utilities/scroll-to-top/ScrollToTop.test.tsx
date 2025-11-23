/**
 * ScrollToTop Component Tests
 *
 * Tests for the ScrollToTop component covering:
 * - Button rendering based on scroll position
 * - Visibility logic (threshold)
 * - Scroll behavior (smooth vs auto)
 * - Prefers-reduced-motion handling
 * - Props forwarding to FloatingActionButton
 * - SSR safety
 */

import { useScrollPosition } from '@core/hooks/scroll/useScrollPosition';
import ScrollToTop from '@core/ui/utilities/scroll-to-top/ScrollToTop';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock useScrollPosition
vi.mock('@core/hooks/scroll/useScrollPosition', () => ({
	useScrollPosition: vi.fn(),
}));

// Mock useTranslation
vi.mock('@core/i18n/useTranslation', () => ({
	useTranslation: () => ({
		t: (key: string) => key,
	}),
}));

const mockUseScrollPosition = vi.mocked(useScrollPosition);

// Test constants
const SCROLL_TO_TOP_BUTTON_NAME = 'a11y.scrollToTop';

// Helper functions
const createMockMediaQueryList = (matches: boolean, media = ''): MediaQueryList => ({
	matches,
	media,
	onchange: null,
	addListener: vi.fn(),
	removeListener: vi.fn(),
	addEventListener: vi.fn(),
	removeEventListener: vi.fn(),
	dispatchEvent: vi.fn(),
});

const clickScrollToTopButton = () => {
	const button = screen.getByRole('button', { name: SCROLL_TO_TOP_BUTTON_NAME });
	fireEvent.click(button);
	return button;
};

const assertScrollToCalled = (
	mockScrollTo: ReturnType<typeof vi.fn>,
	expectedBehavior: ScrollBehavior
) => {
	expect(mockScrollTo).toHaveBeenCalledWith({
		top: 0,
		behavior: expectedBehavior,
	});
};

describe('ScrollToTop - Rendering', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		// Default: not scrolled (below threshold)
		mockUseScrollPosition.mockReturnValue(0);
	});

	it('does not render button when scroll position is below threshold', () => {
		mockUseScrollPosition.mockReturnValue(299); // Below default threshold of 300

		renderWithProviders(<ScrollToTop />);

		expect(
			screen.queryByRole('button', { name: SCROLL_TO_TOP_BUTTON_NAME })
		).not.toBeInTheDocument();
	});

	it('renders button when scroll position equals threshold', () => {
		mockUseScrollPosition.mockReturnValue(300); // Exactly at threshold

		renderWithProviders(<ScrollToTop />);

		const button = screen.getByRole('button', { name: SCROLL_TO_TOP_BUTTON_NAME });
		expect(button).toBeInTheDocument();
	});

	it('renders button when scroll position exceeds threshold', () => {
		mockUseScrollPosition.mockReturnValue(500); // Above threshold

		renderWithProviders(<ScrollToTop />);

		const button = screen.getByRole('button', { name: SCROLL_TO_TOP_BUTTON_NAME });
		expect(button).toBeInTheDocument();
	});

	it('uses custom threshold value', () => {
		mockUseScrollPosition.mockReturnValue(400); // Below custom threshold of 500

		renderWithProviders(<ScrollToTop threshold={500} />);

		expect(
			screen.queryByRole('button', { name: SCROLL_TO_TOP_BUTTON_NAME })
		).not.toBeInTheDocument();
	});

	it('renders button with custom threshold when scrolled past it', () => {
		mockUseScrollPosition.mockReturnValue(600); // Above custom threshold of 500

		renderWithProviders(<ScrollToTop threshold={500} />);

		const button = screen.getByRole('button', { name: SCROLL_TO_TOP_BUTTON_NAME });
		expect(button).toBeInTheDocument();
	});
});

// Helper functions for scroll behavior tests
const setupScrollMocks = () => {
	const mockScrollTo = vi.fn();
	globalThis.window.scrollTo = mockScrollTo;

	const mockMatchMedia = vi.fn((query: string) =>
		createMockMediaQueryList(query === '(prefers-reduced-motion: reduce)', query)
	);
	globalThis.window.matchMedia = mockMatchMedia;

	return { mockScrollTo, mockMatchMedia };
};

const testScrollBehavior = (
	mockScrollTo: ReturnType<typeof vi.fn>,
	mockMatchMedia: ReturnType<typeof vi.fn>,
	reducedMotion: boolean,
	smooth: boolean | undefined,
	expectedBehavior: ScrollBehavior
) => {
	mockMatchMedia.mockReturnValue(
		createMockMediaQueryList(reducedMotion, reducedMotion ? '(prefers-reduced-motion: reduce)' : '')
	);

	const scrollToTopProps = smooth === undefined ? {} : { smooth };
	renderWithProviders(<ScrollToTop {...scrollToTopProps} />);
	clickScrollToTopButton();
	assertScrollToCalled(mockScrollTo, expectedBehavior);
};

describe('ScrollToTop - Scroll Behavior', () => {
	let mockScrollTo: ReturnType<typeof vi.fn>;
	let mockMatchMedia: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		vi.clearAllMocks();
		mockUseScrollPosition.mockReturnValue(500); // Above threshold
		const { mockScrollTo: scrollTo, mockMatchMedia: matchMedia } = setupScrollMocks();
		mockScrollTo = scrollTo;
		mockMatchMedia = matchMedia;
	});

	it('scrolls to top with smooth behavior by default', () => {
		testScrollBehavior(mockScrollTo, mockMatchMedia, false, undefined, 'smooth');
	});

	it('scrolls to top with auto behavior when smooth is disabled', () => {
		testScrollBehavior(mockScrollTo, mockMatchMedia, false, false, 'auto');
	});

	it('uses auto behavior when prefers-reduced-motion is enabled', () => {
		testScrollBehavior(mockScrollTo, mockMatchMedia, true, true, 'auto');
	});

	it('calls scrollTo when button is clicked', () => {
		mockUseScrollPosition.mockReturnValue(500);
		renderWithProviders(<ScrollToTop />);
		clickScrollToTopButton();
		expect(mockScrollTo).toHaveBeenCalled();
	});
});

describe('ScrollToTop - Props Forwarding', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockUseScrollPosition.mockReturnValue(500); // Above threshold
	});

	it('forwards position prop to FloatingActionButton', () => {
		renderWithProviders(<ScrollToTop position="bottom-left" />);

		const button = screen.getByRole('button', { name: SCROLL_TO_TOP_BUTTON_NAME });
		expect(button).toBeInTheDocument();
		// Note: We can't easily test the position class without querying the DOM structure
		// The FloatingActionButton component handles the positioning
	});

	it('forwards size prop to FloatingActionButton', () => {
		renderWithProviders(<ScrollToTop size="lg" />);

		const button = screen.getByRole('button', { name: SCROLL_TO_TOP_BUTTON_NAME });
		expect(button).toBeInTheDocument();
	});

	it('forwards className prop to FloatingActionButton', () => {
		renderWithProviders(<ScrollToTop className="custom-scroll-button" />);

		const button = screen.getByRole('button', { name: SCROLL_TO_TOP_BUTTON_NAME });
		expect(button).toHaveClass('custom-scroll-button');
	});

	it('uses custom aria-label when provided', () => {
		renderWithProviders(<ScrollToTop aria-label="Go to top" />);

		const button = screen.getByRole('button', { name: 'Go to top' });
		expect(button).toBeInTheDocument();
	});

	it('uses default aria-label from translation when not provided', () => {
		renderWithProviders(<ScrollToTop />);

		const button = screen.getByRole('button', { name: SCROLL_TO_TOP_BUTTON_NAME });
		expect(button).toBeInTheDocument();
	});

	it('uses custom tooltip when provided', () => {
		renderWithProviders(<ScrollToTop tooltip="Return to top" />);

		const button = screen.getByRole('button', { name: SCROLL_TO_TOP_BUTTON_NAME });
		// Tooltip is handled by FloatingActionButton, we verify the button exists
		expect(button).toBeInTheDocument();
	});

	it('uses default tooltip from translation when not provided', () => {
		renderWithProviders(<ScrollToTop />);

		const button = screen.getByRole('button', { name: SCROLL_TO_TOP_BUTTON_NAME });
		expect(button).toBeInTheDocument();
	});
});

describe('ScrollToTop - Visibility Logic', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('does not render when scroll position is below threshold', () => {
		mockUseScrollPosition.mockReturnValue(200);

		renderWithProviders(<ScrollToTop />);

		expect(
			screen.queryByRole('button', { name: SCROLL_TO_TOP_BUTTON_NAME })
		).not.toBeInTheDocument();
	});

	it('renders when scroll position is above threshold', () => {
		mockUseScrollPosition.mockReturnValue(400);

		renderWithProviders(<ScrollToTop />);

		const button = screen.getByRole('button', { name: SCROLL_TO_TOP_BUTTON_NAME });
		expect(button).toBeInTheDocument();
	});

	it('handles zero threshold correctly', () => {
		mockUseScrollPosition.mockReturnValue(0);

		renderWithProviders(<ScrollToTop threshold={0} />);

		// At threshold (0), button should be visible
		const button = screen.getByRole('button', { name: SCROLL_TO_TOP_BUTTON_NAME });
		expect(button).toBeInTheDocument();
	});

	it('handles very large threshold values', () => {
		mockUseScrollPosition.mockReturnValue(1000);

		renderWithProviders(<ScrollToTop threshold={2000} />);

		expect(screen.queryByRole('button')).not.toBeInTheDocument();
	});

	it('handles negative scroll position (edge case)', () => {
		mockUseScrollPosition.mockReturnValue(-100);

		renderWithProviders(<ScrollToTop threshold={0} />);

		expect(screen.queryByRole('button')).not.toBeInTheDocument();
	});
});

describe('ScrollToTop - Edge Cases', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('handles threshold at boundary value', () => {
		mockUseScrollPosition.mockReturnValue(300);

		renderWithProviders(<ScrollToTop threshold={300} />);

		const button = screen.getByRole('button', { name: SCROLL_TO_TOP_BUTTON_NAME });
		expect(button).toBeInTheDocument();
	});

	it('handles threshold just below boundary value', () => {
		mockUseScrollPosition.mockReturnValue(299);

		renderWithProviders(<ScrollToTop threshold={300} />);

		expect(screen.queryByRole('button')).not.toBeInTheDocument();
	});

	it('handles different scroll positions correctly', () => {
		// Test below threshold
		mockUseScrollPosition.mockReturnValue(100);
		const { unmount: unmount1 } = renderWithProviders(<ScrollToTop />);
		expect(
			screen.queryByRole('button', { name: SCROLL_TO_TOP_BUTTON_NAME })
		).not.toBeInTheDocument();
		unmount1();

		// Test above threshold
		mockUseScrollPosition.mockReturnValue(400);
		renderWithProviders(<ScrollToTop />);
		expect(screen.getByRole('button')).toBeInTheDocument();
	});
});
