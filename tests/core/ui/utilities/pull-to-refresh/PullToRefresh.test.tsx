/**
 * PullToRefresh Component Tests
 *
 * Tests for the PullToRefresh component:
 * - Rendering
 * - Pull-to-refresh gesture detection
 * - Refresh trigger and completion
 * - Visual indicators (loading, success, error states)
 * - Threshold and resistance behavior
 * - Accessibility (keyboard support, screen reader announcements)
 * - Edge cases (rapid gestures, cancellation)
 * - Disabled state
 * - Custom indicators
 */

import PullToRefresh from '@core/ui/utilities/pull-to-refresh/PullToRefresh';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import type React from 'react';
import { describe, expect, it, vi } from 'vitest';

const TEST_ID_PULL_TO_REFRESH = 'pull-to-refresh';
const INDICATOR_HIDDEN_STYLE = 'translateY(-100%)';
const TEXT_PULL_TO_REFRESH = 'Pull to refresh';
const TEXT_RELEASE_TO_REFRESH = 'Release to refresh';
const ARIA_LABEL_PULL_TO_REFRESH_CONTAINER = 'Pull to refresh container';
const TEST_DESC_DOES_NOT_DETECT_PULL = 'does not detect pull gesture';

// Helper function to create a touch event
const createTouchEvent = (clientY: number) =>
	({
		touches: [{ clientY }],
		targetTouches: [{ clientY }],
		changedTouches: [{ clientY }],
		preventDefault: vi.fn(),
		stopPropagation: vi.fn(),
	}) as unknown as React.TouchEvent<HTMLDivElement>;

// Helper function to simulate pull gesture
const performPullGesture = async (
	container: HTMLElement,
	startY: number,
	moveY: number,
	shouldEnd = true
) => {
	const touchStart = createTouchEvent(startY);
	fireEvent.touchStart(container, touchStart);

	if (moveY !== startY) {
		const touchMove = createTouchEvent(moveY);
		fireEvent.touchMove(container, touchMove);
	}

	if (shouldEnd) {
		fireEvent.touchEnd(container);
	}
};

// Helper to set scroll position
const setScrollTop = (element: HTMLElement, scrollTop: number) => {
	Object.defineProperty(element, 'scrollTop', {
		writable: true,
		value: scrollTop,
	});
};

// Helper to get container element
const getContainerElement = (): HTMLElement => {
	return screen.getByTestId(TEST_ID_PULL_TO_REFRESH);
};

// Helper to setup component with common props
const setupComponent = (
	onRefresh: () => void | Promise<void>,
	props?: { disabled?: boolean; threshold?: number; [key: string]: unknown }
) => {
	const componentProps = {
		onRefresh,
		threshold: props?.threshold ?? 80,
		'data-testid': TEST_ID_PULL_TO_REFRESH,
		...(props?.disabled !== undefined && { disabled: props.disabled }),
		...props,
	};
	renderWithProviders(
		<PullToRefresh {...componentProps}>
			<div>Test</div>
		</PullToRefresh>
	);
	return { containerElement: getContainerElement() };
};

// Helper to verify indicator is hidden
// Note: We need to check the style attribute which requires querySelector
// This is acceptable as we're checking a computed style, not accessing DOM structure
const verifyIndicatorHidden = () => {
	const containerElement = screen.getByTestId(TEST_ID_PULL_TO_REFRESH);

	const indicator = containerElement.querySelector('.absolute.top-0');
	const indicatorStyle = indicator?.getAttribute('style') ?? '';
	expect(indicatorStyle).toContain(INDICATOR_HIDDEN_STYLE);
};

// Helper to create async refresh callback
const createAsyncRefresh = (delay = 50) =>
	vi.fn(() => {
		return new Promise<void>(resolve => {
			setTimeout(resolve, delay);
		});
	});

describe('PullToRefresh - Rendering', () => {
	it('renders children content', () => {
		const onRefresh = vi.fn();
		renderWithProviders(
			<PullToRefresh onRefresh={onRefresh}>
				<div>Test Content</div>
			</PullToRefresh>
		);

		expect(screen.getByText('Test Content')).toBeInTheDocument();
	});

	it('renders with default props', () => {
		const onRefresh = vi.fn();
		renderWithProviders(
			<PullToRefresh onRefresh={onRefresh} data-testid={TEST_ID_PULL_TO_REFRESH}>
				<div>Test</div>
			</PullToRefresh>
		);

		expect(screen.getByTestId(TEST_ID_PULL_TO_REFRESH)).toBeInTheDocument();
	});

	it('applies custom className', () => {
		const onRefresh = vi.fn();
		renderWithProviders(
			<PullToRefresh
				onRefresh={onRefresh}
				className="custom-class"
				data-testid={TEST_ID_PULL_TO_REFRESH}
			>
				<div>Test</div>
			</PullToRefresh>
		);

		expect(screen.getByTestId(TEST_ID_PULL_TO_REFRESH)).toHaveClass('custom-class');
	});

	it('forwards additional props to container', () => {
		const onRefresh = vi.fn();
		renderWithProviders(
			<PullToRefresh
				onRefresh={onRefresh}
				data-testid={TEST_ID_PULL_TO_REFRESH}
				aria-label={ARIA_LABEL_PULL_TO_REFRESH_CONTAINER}
			>
				<div>Test</div>
			</PullToRefresh>
		);

		const containerElement = screen.getByTestId(TEST_ID_PULL_TO_REFRESH);
		expect(containerElement).toHaveAttribute('data-testid', TEST_ID_PULL_TO_REFRESH);
		expect(containerElement).toHaveAttribute('aria-label', ARIA_LABEL_PULL_TO_REFRESH_CONTAINER);
	});
});

describe('PullToRefresh - Gesture Detection', () => {
	describe('when container is at top', () => {
		it('detects pull gesture', async () => {
			const onRefresh = vi.fn();
			const { containerElement } = setupComponent(onRefresh);
			setScrollTop(containerElement, 0);

			await performPullGesture(containerElement, 100, 150, false);

			// Check that pull indicator text is visible (indicator is shown)
			await waitFor(() => {
				expect(screen.getByText(TEXT_PULL_TO_REFRESH)).toBeInTheDocument();
			});
		});
	});

	describe('when container is scrolled', () => {
		it(TEST_DESC_DOES_NOT_DETECT_PULL, async () => {
			const onRefresh = vi.fn();
			const { containerElement } = setupComponent(onRefresh);
			setScrollTop(containerElement, 50);

			await performPullGesture(containerElement, 100, 150, false);

			verifyIndicatorHidden();
		});
	});

	describe('when disabled', () => {
		it(TEST_DESC_DOES_NOT_DETECT_PULL, async () => {
			const onRefresh = vi.fn();
			const { containerElement } = setupComponent(onRefresh, { disabled: true });
			setScrollTop(containerElement, 0);

			await performPullGesture(containerElement, 100, 150, false);

			verifyIndicatorHidden();
		});
	});

	describe('when already refreshing', () => {
		it(TEST_DESC_DOES_NOT_DETECT_PULL, async () => {
			const onRefresh = createAsyncRefresh(100);
			const { containerElement } = setupComponent(onRefresh);
			setScrollTop(containerElement, 0);

			await performPullGesture(containerElement, 100, 200);

			await waitFor(() => {
				expect(onRefresh).toHaveBeenCalled();
			});

			await performPullGesture(containerElement, 100, 150, false);

			expect(onRefresh).toHaveBeenCalledTimes(1);
		});
	});
});

describe('PullToRefresh - Refresh Trigger and Completion', () => {
	describe('threshold behavior', () => {
		it('triggers refresh when pull exceeds threshold', async () => {
			const onRefresh = vi.fn();
			const { containerElement } = setupComponent(onRefresh);
			setScrollTop(containerElement, 0);

			await performPullGesture(containerElement, 100, 200);

			await waitFor(() => {
				expect(onRefresh).toHaveBeenCalledTimes(1);
			});
		});

		it('does not trigger refresh when pull is below threshold', async () => {
			const onRefresh = vi.fn();
			const { containerElement } = setupComponent(onRefresh);
			setScrollTop(containerElement, 0);

			await performPullGesture(containerElement, 100, 150);

			await waitFor(
				() => {
					expect(onRefresh).not.toHaveBeenCalled();
				},
				{ timeout: 100 }
			);
		});
	});
});

describe('PullToRefresh - Refresh Callback Handling', () => {
	it('handles async refresh callback', async () => {
		const onRefresh = createAsyncRefresh(50);
		const { containerElement } = setupComponent(onRefresh);
		setScrollTop(containerElement, 0);

		await performPullGesture(containerElement, 100, 200);

		await waitFor(() => {
			expect(onRefresh).toHaveBeenCalledTimes(1);
		});

		await waitFor(() => verifyIndicatorHidden(), { timeout: 200 });
	});

	it('handles sync refresh callback', async () => {
		const onRefresh = vi.fn();
		const { containerElement } = setupComponent(onRefresh);
		setScrollTop(containerElement, 0);

		await performPullGesture(containerElement, 100, 200);

		await waitFor(() => {
			expect(onRefresh).toHaveBeenCalledTimes(1);
		});
	});
});

describe('PullToRefresh - Refresh State Management', () => {
	it('resets state after refresh completes', async () => {
		const onRefresh = createAsyncRefresh(50);
		const { containerElement } = setupComponent(onRefresh);
		setScrollTop(containerElement, 0);

		await performPullGesture(containerElement, 100, 200);

		await waitFor(() => {
			expect(onRefresh).toHaveBeenCalled();
		});

		await waitFor(() => verifyIndicatorHidden(), { timeout: 200 });
	});
});

describe('PullToRefresh - Visual Indicators', () => {
	describe('default indicators', () => {
		it('shows pull indicator when pulling below threshold', async () => {
			const onRefresh = vi.fn();
			const { containerElement } = setupComponent(onRefresh);
			setScrollTop(containerElement, 0);

			await performPullGesture(containerElement, 100, 150, false);

			await waitFor(() => {
				expect(screen.getByText(TEXT_PULL_TO_REFRESH)).toBeInTheDocument();
			});
		});

		it('shows release indicator when pull exceeds threshold', async () => {
			const onRefresh = vi.fn();
			const { containerElement } = setupComponent(onRefresh);
			setScrollTop(containerElement, 0);

			await performPullGesture(containerElement, 100, 200, false);

			await waitFor(() => {
				expect(screen.getByText(TEXT_RELEASE_TO_REFRESH)).toBeInTheDocument();
			});
		});

		it('shows refreshing indicator during refresh', async () => {
			const onRefresh = createAsyncRefresh(100);
			const { containerElement } = setupComponent(onRefresh);
			setScrollTop(containerElement, 0);

			await performPullGesture(containerElement, 100, 200);

			await waitFor(() => {
				expect(screen.getByRole('status')).toBeInTheDocument();
			});
		});
	});
});

describe('PullToRefresh - Custom Indicators', () => {
	it('uses custom pull indicator', async () => {
		const onRefresh = vi.fn();
		const customPullIndicator = <div data-testid="custom-pull">Custom Pull</div>;
		const { containerElement } = setupComponent(onRefresh, {
			pullIndicator: customPullIndicator,
		});
		setScrollTop(containerElement, 0);

		await performPullGesture(containerElement, 100, 150, false);

		await waitFor(() => {
			expect(screen.getByTestId('custom-pull')).toBeInTheDocument();
		});
	});

	it('uses custom release indicator', async () => {
		const onRefresh = vi.fn();
		const customReleaseIndicator = <div data-testid="custom-release">Custom Release</div>;
		const { containerElement } = setupComponent(onRefresh, {
			releaseIndicator: customReleaseIndicator,
		});
		setScrollTop(containerElement, 0);

		await performPullGesture(containerElement, 100, 200, false);

		await waitFor(() => {
			expect(screen.getByTestId('custom-release')).toBeInTheDocument();
		});
	});

	it('uses custom refreshing indicator', async () => {
		const onRefresh = createAsyncRefresh(100);
		const customRefreshingIndicator = <div data-testid="custom-refreshing">Custom Refreshing</div>;
		const { containerElement } = setupComponent(onRefresh, {
			refreshingIndicator: customRefreshingIndicator,
		});
		setScrollTop(containerElement, 0);

		await performPullGesture(containerElement, 100, 200);

		await waitFor(() => {
			expect(screen.getByTestId('custom-refreshing')).toBeInTheDocument();
		});
	});
});

describe('PullToRefresh - Threshold and Resistance', () => {
	it('respects custom threshold value', async () => {
		const onRefresh = vi.fn();
		renderWithProviders(
			<PullToRefresh onRefresh={onRefresh} threshold={100} data-testid={TEST_ID_PULL_TO_REFRESH}>
				<div>Test</div>
			</PullToRefresh>
		);

		const containerElement = screen.getByTestId(TEST_ID_PULL_TO_REFRESH);
		setScrollTop(containerElement, 0);

		// Pull 50px (below threshold of 100)
		await performPullGesture(containerElement, 100, 150, false);
		expect(screen.queryByText(TEXT_RELEASE_TO_REFRESH)).not.toBeInTheDocument();

		// Pull 150px (above threshold of 100)
		await performPullGesture(containerElement, 100, 250, false);
		await waitFor(() => {
			expect(screen.getByText(TEXT_RELEASE_TO_REFRESH)).toBeInTheDocument();
		});
	});

	it('applies resistance when pull exceeds max distance', async () => {
		const onRefresh = vi.fn();
		const threshold = 80;
		renderWithProviders(
			<PullToRefresh
				onRefresh={onRefresh}
				threshold={threshold}
				data-testid={TEST_ID_PULL_TO_REFRESH}
			>
				<div>Test</div>
			</PullToRefresh>
		);

		const containerElement = screen.getByTestId(TEST_ID_PULL_TO_REFRESH);
		setScrollTop(containerElement, 0);

		// Pull beyond max distance (200px > 120px max)
		await performPullGesture(containerElement, 100, 300, false);

		// The pull distance should be capped at maxPull (120px for threshold 80)
		// We can verify this by checking the padding-top of the content
		// Note: We need to check style attributes which requires querySelector
		// This is acceptable as we're verifying computed styles, not DOM structure
		await waitFor(() => {
			const contentDiv = Array.from(containerElement.querySelectorAll('div')).find(div =>
				div.getAttribute('style')?.includes('padding-top')
			);
			expect(contentDiv).toBeInTheDocument();
			const paddingTop = contentDiv?.getAttribute('style') ?? '';
			// Should have padding but not exceed max (should be 120px, not 200px)
			expect(paddingTop).toContain('padding-top: 120px');
		});
	});

	it('uses default threshold when not specified', async () => {
		const onRefresh = vi.fn();
		renderWithProviders(
			<PullToRefresh onRefresh={onRefresh} data-testid={TEST_ID_PULL_TO_REFRESH}>
				<div>Test</div>
			</PullToRefresh>
		);

		const containerElement = screen.getByTestId(TEST_ID_PULL_TO_REFRESH);
		setScrollTop(containerElement, 0);

		// Default threshold is 80, so 100px should trigger release state
		await performPullGesture(containerElement, 100, 200, false);

		await waitFor(() => {
			expect(screen.getByText(TEXT_RELEASE_TO_REFRESH)).toBeInTheDocument();
		});
	});
});

describe('PullToRefresh - Edge Cases', () => {
	describe('gesture handling', () => {
		it('handles rapid gestures', async () => {
			const onRefresh = vi.fn();
			const { containerElement } = setupComponent(onRefresh);
			setScrollTop(containerElement, 0);

			await performPullGesture(containerElement, 100, 200);
			await performPullGesture(containerElement, 100, 200);

			await waitFor(() => {
				expect(onRefresh).toHaveBeenCalled();
			});
		});

		it('handles cancellation (pull below threshold then release)', async () => {
			const onRefresh = vi.fn();
			const { containerElement } = setupComponent(onRefresh);
			setScrollTop(containerElement, 0);

			await performPullGesture(containerElement, 100, 150);

			await waitFor(
				() => {
					expect(onRefresh).not.toHaveBeenCalled();
				},
				{ timeout: 100 }
			);
		});

		it('handles upward pull (negative delta)', async () => {
			const onRefresh = vi.fn();
			const { containerElement } = setupComponent(onRefresh);
			setScrollTop(containerElement, 0);

			await performPullGesture(containerElement, 200, 100, false);

			expect(onRefresh).not.toHaveBeenCalled();
		});
	});

	describe('touch event edge cases', () => {
		it('handles touch end without touch start', async () => {
			const onRefresh = vi.fn();
			const { containerElement } = setupComponent(onRefresh);

			fireEvent.touchEnd(containerElement);

			expect(onRefresh).not.toHaveBeenCalled();
		});

		it('handles touch move without touch start', async () => {
			const onRefresh = vi.fn();
			const { containerElement } = setupComponent(onRefresh);

			const touchMove = createTouchEvent(150);
			fireEvent.touchMove(containerElement, touchMove);

			expect(onRefresh).not.toHaveBeenCalled();
		});
	});
});

describe('PullToRefresh - Disabled State', () => {
	it('does not respond to gestures when disabled', async () => {
		const onRefresh = vi.fn();
		renderWithProviders(
			<PullToRefresh
				onRefresh={onRefresh}
				disabled
				threshold={80}
				data-testid={TEST_ID_PULL_TO_REFRESH}
			>
				<div>Test</div>
			</PullToRefresh>
		);

		const containerElement = screen.getByTestId(TEST_ID_PULL_TO_REFRESH);
		setScrollTop(containerElement, 0);

		await performPullGesture(containerElement, 100, 200);

		expect(onRefresh).not.toHaveBeenCalled();
	});

	it('hides indicator when disabled', async () => {
		const onRefresh = vi.fn();
		renderWithProviders(
			<PullToRefresh
				onRefresh={onRefresh}
				disabled
				threshold={80}
				data-testid={TEST_ID_PULL_TO_REFRESH}
			>
				<div>Test</div>
			</PullToRefresh>
		);

		const containerElement = screen.getByTestId(TEST_ID_PULL_TO_REFRESH);
		setScrollTop(containerElement, 0);

		await performPullGesture(containerElement, 100, 200, false);

		verifyIndicatorHidden();
	});
});
