/**
 * Swipeable Component Tests
 *
 * Tests for the main Swipeable component:
 * - Rendering
 * - Touch gesture handling
 * - Direction support
 * - Action handling
 * - Disabled state
 * - onSwipe callback
 * - Props forwarding
 */

import Swipeable from '@core/ui/utilities/swipeable/Swipeable';
import type { SwipeableAction } from '@src-types/ui/overlays/interactions';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

// Helper functions for common test patterns
const performSwipe = (
	containerElement: HTMLElement,
	startX: number,
	startY: number,
	endX: number,
	endY: number
) => {
	fireEvent.touchStart(containerElement, {
		touches: [{ clientX: startX, clientY: startY }],
	});
	fireEvent.touchMove(containerElement, {
		touches: [{ clientX: endX, clientY: endY }],
	});
};

const performSwipeWithEnd = (
	containerElement: HTMLElement,
	startX: number,
	startY: number,
	endX: number,
	endY: number
) => {
	performSwipe(containerElement, startX, startY, endX, endY);
	fireEvent.touchEnd(containerElement);
};

const createRightAction = (id: string, content: string, onAction = vi.fn()): SwipeableAction => ({
	id,
	content,
	onAction,
});

describe('Swipeable - Rendering', () => {
	it('renders children content', () => {
		renderWithProviders(
			<Swipeable>
				<div>Test Content</div>
			</Swipeable>
		);

		expect(screen.getByText('Test Content')).toBeInTheDocument();
	});

	it('renders with default props', () => {
		renderWithProviders(
			<Swipeable data-testid="swipeable">
				<div>Test</div>
			</Swipeable>
		);

		const containerElement = screen.getByTestId('swipeable');
		expect(containerElement).toBeInTheDocument();
		expect(containerElement).toHaveClass('relative');
		expect(containerElement).toHaveClass('overflow-hidden');
	});

	it('applies custom className', () => {
		renderWithProviders(
			<Swipeable className="custom-class" data-testid="swipeable">
				<div>Test</div>
			</Swipeable>
		);

		const containerElement = screen.getByTestId('swipeable');
		expect(containerElement).toHaveClass('custom-class');
	});

	it('forwards additional props to container', () => {
		renderWithProviders(
			<Swipeable data-testid="swipeable" aria-label="Swipeable item">
				<div>Test</div>
			</Swipeable>
		);

		const containerElement = screen.getByTestId('swipeable');
		expect(containerElement).toHaveAttribute('data-testid', 'swipeable');
		expect(containerElement).toHaveAttribute('aria-label', 'Swipeable item');
	});
});

describe('Swipeable - Touch Gesture Handling', () => {
	it('handles touch start event', () => {
		renderWithProviders(
			<Swipeable data-testid="swipeable">
				<div>Test</div>
			</Swipeable>
		);

		const containerElement = screen.getByTestId('swipeable');
		fireEvent.touchStart(containerElement, {
			touches: [{ clientX: 100, clientY: 50 }],
		});

		// Component should handle the event without errors
		expect(containerElement).toBeInTheDocument();
	});

	it('handles touch move event', () => {
		renderWithProviders(
			<Swipeable data-testid="swipeable">
				<div>Test</div>
			</Swipeable>
		);

		const containerElement = screen.getByTestId('swipeable');
		fireEvent.touchStart(containerElement, {
			touches: [{ clientX: 100, clientY: 50 }],
		});
		fireEvent.touchMove(containerElement, {
			touches: [{ clientX: 150, clientY: 50 }],
		});

		// Component should handle the event without errors
		expect(containerElement).toBeInTheDocument();
	});

	it('handles touch end event', () => {
		renderWithProviders(
			<Swipeable data-testid="swipeable">
				<div>Test</div>
			</Swipeable>
		);

		const containerElement = screen.getByTestId('swipeable');
		fireEvent.touchStart(containerElement, {
			touches: [{ clientX: 100, clientY: 50 }],
		});
		fireEvent.touchEnd(containerElement);

		// Component should handle the event without errors
		expect(containerElement).toBeInTheDocument();
	});

	it('does not handle touch events when disabled', () => {
		renderWithProviders(
			<Swipeable disabled data-testid="swipeable">
				<div>Test</div>
			</Swipeable>
		);

		const containerElement = screen.getByTestId('swipeable');
		const contentElement = screen.getByTestId('swipeable-content');
		const initialTransform = contentElement.getAttribute('style');

		fireEvent.touchStart(containerElement, {
			touches: [{ clientX: 100, clientY: 50 }],
		});
		fireEvent.touchMove(containerElement, {
			touches: [{ clientX: 150, clientY: 50 }],
		});

		// Transform should remain unchanged when disabled
		const afterTransform = contentElement.getAttribute('style');
		expect(afterTransform).toBe(initialTransform);
	});
});

describe('Swipeable - Action Handling', () => {
	describe('Action visibility', () => {
		it('shows actions when swipe exceeds threshold', async () => {
			const rightActions: readonly SwipeableAction[] = [createRightAction('edit', 'Edit')];

			renderWithProviders(
				<Swipeable rightActions={rightActions} threshold={50} data-testid="swipeable">
					<div>Test</div>
				</Swipeable>
			);

			const containerElement = screen.getByTestId('swipeable');
			performSwipe(containerElement, 0, 50, 100, 50);

			await waitFor(() => {
				expect(screen.getByText('Edit')).toBeInTheDocument();
			});
		});

		it('does not show actions when swipe is below threshold', () => {
			const rightActions: readonly SwipeableAction[] = [createRightAction('edit', 'Edit')];

			renderWithProviders(
				<Swipeable rightActions={rightActions} threshold={50} data-testid="swipeable">
					<div>Test</div>
				</Swipeable>
			);

			const containerElement = screen.getByTestId('swipeable');
			performSwipe(containerElement, 0, 50, 30, 50);

			expect(screen.queryByText('Edit')).not.toBeInTheDocument();
		});
	});

	describe('Action interaction', () => {
		it('handles action click', async () => {
			const onAction = vi.fn();
			const rightActions: readonly SwipeableAction[] = [
				createRightAction('edit', 'Edit', onAction),
			];

			renderWithProviders(
				<Swipeable rightActions={rightActions} threshold={50} data-testid="swipeable">
					<div>Test</div>
				</Swipeable>
			);

			const containerElement = screen.getByTestId('swipeable');
			performSwipe(containerElement, 0, 50, 100, 50);

			await waitFor(() => {
				expect(screen.getByText('Edit')).toBeInTheDocument();
			});

			const editButton = screen.getByText('Edit');
			fireEvent.click(editButton);

			await waitFor(() => {
				expect(onAction).toHaveBeenCalledTimes(1);
			});
		});
	});
});

describe('Swipeable - Direction Support - Horizontal', () => {
	it('handles horizontal swipe', async () => {
		const rightActions: readonly SwipeableAction[] = [createRightAction('edit', 'Edit')];

		renderWithProviders(
			<Swipeable
				direction="horizontal"
				rightActions={rightActions}
				threshold={50}
				data-testid="swipeable"
			>
				<div>Test</div>
			</Swipeable>
		);

		const containerElement = screen.getByTestId('swipeable');
		performSwipe(containerElement, 0, 50, 100, 50);

		await waitFor(() => {
			expect(screen.getByText('Edit')).toBeInTheDocument();
		});
	});
});

describe('Swipeable - Direction Support - Vertical', () => {
	it('handles vertical swipe', async () => {
		const upActions: readonly SwipeableAction[] = [{ id: 'up', content: 'Up', onAction: vi.fn() }];

		renderWithProviders(
			<Swipeable direction="vertical" upActions={upActions} threshold={50} data-testid="swipeable">
				<div>Test</div>
			</Swipeable>
		);

		const containerElement = screen.getByTestId('swipeable');
		performSwipe(containerElement, 50, 100, 50, 0);

		await waitFor(() => {
			expect(screen.getByText('Up')).toBeInTheDocument();
		});
	});
});

describe('Swipeable - Direction Support - Left', () => {
	it('handles left swipe', async () => {
		const leftActions: readonly SwipeableAction[] = [
			{ id: 'delete', content: 'Delete', onAction: vi.fn() },
		];

		renderWithProviders(
			<Swipeable direction="left" leftActions={leftActions} threshold={50} data-testid="swipeable">
				<div>Test</div>
			</Swipeable>
		);

		const containerElement = screen.getByTestId('swipeable');
		performSwipe(containerElement, 100, 50, 0, 50);

		await waitFor(() => {
			expect(screen.getByText('Delete')).toBeInTheDocument();
		});
	});
});

describe('Swipeable - Direction Support - All Directions', () => {
	it('handles all directions', async () => {
		const rightActions: readonly SwipeableAction[] = [createRightAction('edit', 'Edit')];
		const leftActions: readonly SwipeableAction[] = [
			{ id: 'delete', content: 'Delete', onAction: vi.fn() },
		];
		const upActions: readonly SwipeableAction[] = [{ id: 'up', content: 'Up', onAction: vi.fn() }];
		const downActions: readonly SwipeableAction[] = [
			{ id: 'down', content: 'Down', onAction: vi.fn() },
		];

		renderWithProviders(
			<Swipeable
				direction="all"
				rightActions={rightActions}
				leftActions={leftActions}
				upActions={upActions}
				downActions={downActions}
				threshold={50}
				data-testid="swipeable"
			>
				<div>Test</div>
			</Swipeable>
		);

		const containerElement = screen.getByTestId('swipeable');
		performSwipe(containerElement, 0, 50, 100, 50);

		await waitFor(() => {
			expect(screen.getByText('Edit')).toBeInTheDocument();
		});
	});
});

describe('Swipeable - onSwipe Callback', () => {
	describe('Callback invocation', () => {
		it('calls onSwipe when swipe exceeds threshold', async () => {
			const onSwipe = vi.fn();
			const rightActions: readonly SwipeableAction[] = [createRightAction('edit', 'Edit')];

			renderWithProviders(
				<Swipeable
					rightActions={rightActions}
					threshold={50}
					onSwipe={onSwipe}
					data-testid="swipeable"
				>
					<div>Test</div>
				</Swipeable>
			);

			const containerElement = screen.getByTestId('swipeable');
			performSwipeWithEnd(containerElement, 0, 50, 100, 50);

			await waitFor(() => {
				expect(onSwipe).toHaveBeenCalledWith('right');
			});
		});
	});

	describe('Callback suppression', () => {
		it('does not call onSwipe when swipe is below threshold', () => {
			const onSwipe = vi.fn();
			const rightActions: readonly SwipeableAction[] = [createRightAction('edit', 'Edit')];

			renderWithProviders(
				<Swipeable
					rightActions={rightActions}
					threshold={50}
					onSwipe={onSwipe}
					data-testid="swipeable"
				>
					<div>Test</div>
				</Swipeable>
			);

			const containerElement = screen.getByTestId('swipeable');
			performSwipeWithEnd(containerElement, 0, 50, 30, 50);

			expect(onSwipe).not.toHaveBeenCalled();
		});

		it('does not call onSwipe when disabled', () => {
			const onSwipe = vi.fn();

			renderWithProviders(
				<Swipeable disabled onSwipe={onSwipe} data-testid="swipeable">
					<div>Test</div>
				</Swipeable>
			);

			const containerElement = screen.getByTestId('swipeable');
			fireEvent.touchStart(containerElement, {
				touches: [{ clientX: 0, clientY: 50 }],
			});
			fireEvent.touchEnd(containerElement);

			expect(onSwipe).not.toHaveBeenCalled();
		});
	});
});

describe('Swipeable - Threshold', () => {
	it('respects custom threshold value', async () => {
		const rightActions: readonly SwipeableAction[] = [
			{ id: 'edit', content: 'Edit', onAction: vi.fn() },
		];

		renderWithProviders(
			<Swipeable rightActions={rightActions} threshold={100} data-testid="swipeable">
				<div>Test</div>
			</Swipeable>
		);

		const containerElement = screen.getByTestId('swipeable');

		// Swipe 50px (below threshold of 100)
		fireEvent.touchStart(containerElement, {
			touches: [{ clientX: 0, clientY: 50 }],
		});
		fireEvent.touchMove(containerElement, {
			touches: [{ clientX: 50, clientY: 50 }],
		});

		expect(screen.queryByText('Edit')).not.toBeInTheDocument();

		// Swipe 150px (above threshold of 100)
		fireEvent.touchMove(containerElement, {
			touches: [{ clientX: 150, clientY: 50 }],
		});

		await waitFor(() => {
			expect(screen.getByText('Edit')).toBeInTheDocument();
		});
	});
});
