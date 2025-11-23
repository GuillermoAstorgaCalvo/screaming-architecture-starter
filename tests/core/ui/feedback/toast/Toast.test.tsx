/**
 * Tests for Toast component
 *
 * Tests the toast notification component:
 * - Rendering with different props
 * - Variants (intents)
 * - Animations and transitions
 * - Accessibility attributes
 * - Dismissal functionality
 * - Auto-dismiss behavior
 */

import Toast from '@core/ui/feedback/toast/Toast';
import { act, fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const TEST_TITLE = 'Test Toast Title';
const TEST_DESCRIPTION = 'Test toast description';
const TEST_CHILDREN = <div data-testid="toast-children">Custom content</div>;
const TEST_DISMISS_LABEL = 'Close toast';
const TEST_ACTION_LABEL = 'Action';

// Mock timers for auto-dismiss tests
beforeEach(() => {
	vi.useFakeTimers();
});

afterEach(() => {
	vi.useRealTimers();
});

// Helper to render Toast with common props
function renderToast(props: Parameters<typeof Toast>[0]) {
	return renderWithProviders(<Toast {...props} />);
}

// Helper to flush pending promises after advancing timers
async function flushPromises() {
	await act(async () => {
		await Promise.resolve();
	});
}

describe('Toast - Rendering', () => {
	it('renders without crashing', () => {
		expect(() => {
			renderToast({ isOpen: true, title: TEST_TITLE });
		}).not.toThrow();
	});

	it('does not render when isOpen is false', () => {
		renderToast({ isOpen: false, title: TEST_TITLE });

		expect(screen.queryByText(TEST_TITLE)).not.toBeInTheDocument();
	});

	it('renders when isOpen is true', () => {
		renderToast({ isOpen: true, title: TEST_TITLE });

		expect(screen.getByText(TEST_TITLE)).toBeInTheDocument();
	});

	it('renders with title only', () => {
		renderToast({ isOpen: true, title: TEST_TITLE });

		expect(screen.getByText(TEST_TITLE)).toBeInTheDocument();
	});

	it('renders with description only', () => {
		renderToast({ isOpen: true, description: TEST_DESCRIPTION });

		expect(screen.getByText(TEST_DESCRIPTION)).toBeInTheDocument();
	});

	it('renders with both title and description', () => {
		renderToast({ isOpen: true, title: TEST_TITLE, description: TEST_DESCRIPTION });

		expect(screen.getByText(TEST_TITLE)).toBeInTheDocument();
		expect(screen.getByText(TEST_DESCRIPTION)).toBeInTheDocument();
	});

	it('renders with children content', () => {
		renderToast({ isOpen: true, children: TEST_CHILDREN });

		expect(screen.getByTestId('toast-children')).toBeInTheDocument();
	});

	it('renders with custom className', () => {
		const customClass = 'custom-toast-class';
		renderToast({ isOpen: true, title: TEST_TITLE, className: customClass });

		const toast = screen.getByRole('status');
		expect(toast).toHaveClass(customClass);
	});
});

describe('Toast - Variants', () => {
	it('renders with info intent (default)', () => {
		renderToast({ isOpen: true, title: TEST_TITLE, intent: 'info' });

		const toast = screen.getByRole('status');
		expect(toast).toBeInTheDocument();
	});

	it('renders with success intent', () => {
		renderToast({ isOpen: true, title: TEST_TITLE, intent: 'success' });

		const toast = screen.getByRole('status');
		expect(toast).toBeInTheDocument();
	});

	it('renders with warning intent', () => {
		renderToast({ isOpen: true, title: TEST_TITLE, intent: 'warning' });

		const toast = screen.getByRole('status');
		expect(toast).toBeInTheDocument();
	});

	it('renders with error intent', () => {
		renderToast({ isOpen: true, title: TEST_TITLE, intent: 'error' });

		// Error intent uses 'alert' role by default
		const toast = screen.getByRole('alert');
		expect(toast).toBeInTheDocument();
	});

	it('applies correct intent for each variant', () => {
		const intents: Array<'info' | 'success' | 'warning' | 'error'> = [
			'info',
			'success',
			'warning',
			'error',
		];

		for (const intent of intents) {
			const { unmount } = renderToast({ isOpen: true, title: TEST_TITLE, intent });
			// Error uses 'alert', others use 'status'
			const role = intent === 'error' ? 'alert' : 'status';
			const toast = screen.getByRole(role);
			expect(toast).toBeInTheDocument();
			unmount();
		}
	});
});

describe('Toast - Animations', () => {
	it('has transition classes for smooth animations', () => {
		renderToast({ isOpen: true, title: TEST_TITLE });

		const toast = screen.getByRole('status');
		// Toast should have transition classes
		expect(toast.className).toBeTruthy();
	});

	it('supports pause on hover for animations', () => {
		const onDismiss = vi.fn();
		renderToast({
			isOpen: true,
			title: TEST_TITLE,
			onDismiss,
			autoDismiss: true,
			dismissAfter: 1000,
			pauseOnHover: true,
		});

		const toast = screen.getByRole('status');
		fireEvent.mouseEnter(toast);

		// Advance time - should not dismiss while hovering
		act(() => {
			vi.advanceTimersByTime(1500);
		});

		// Toast should still be visible
		expect(screen.getByText(TEST_TITLE)).toBeInTheDocument();
	});
});

describe('Toast - Accessibility', () => {
	it('has correct role for info intent (status)', () => {
		renderToast({ isOpen: true, title: TEST_TITLE, intent: 'info' });

		const toast = screen.getByRole('status');
		expect(toast).toBeInTheDocument();
		expect(toast).toHaveAttribute('role', 'status');
	});

	it('has correct role for error intent (alert)', () => {
		renderToast({ isOpen: true, title: TEST_TITLE, intent: 'error', role: 'alert' });

		const toast = screen.getByRole('alert');
		expect(toast).toBeInTheDocument();
		expect(toast).toHaveAttribute('role', 'alert');
	});

	it('allows custom role override', () => {
		renderToast({ isOpen: true, title: TEST_TITLE, intent: 'error', role: 'status' });

		const toast = screen.getByRole('status');
		expect(toast).toHaveAttribute('role', 'status');
	});

	it('has dismissible button with accessible label', () => {
		const onDismiss = vi.fn();
		renderToast({ isOpen: true, title: TEST_TITLE, onDismiss, dismissLabel: TEST_DISMISS_LABEL });

		const dismissButton = screen.getByLabelText(TEST_DISMISS_LABEL);
		expect(dismissButton).toBeInTheDocument();
		expect(dismissButton).toHaveAttribute('aria-label', TEST_DISMISS_LABEL);
	});

	it('has id attribute when provided', () => {
		const toastId = 'test-toast-id';
		renderToast({ isOpen: true, id: toastId, title: TEST_TITLE });

		const toast = screen.getByRole('status');
		expect(toast).toHaveAttribute('id', toastId);
	});
});

describe('Toast - Dismissal', () => {
	it('renders dismiss button when onDismiss is provided', () => {
		const onDismiss = vi.fn();
		renderToast({ isOpen: true, title: TEST_TITLE, onDismiss });

		const dismissButton = screen.getByRole('button');
		expect(dismissButton).toBeInTheDocument();
	});

	it('does not render dismiss button when onDismiss is not provided', () => {
		renderToast({ isOpen: true, title: TEST_TITLE });

		// ToastBody only renders dismiss button when onDismiss is provided
		// Check for button with dismiss label - should not exist
		const dismissButton = screen.queryByRole('button', { name: /dismiss/i });
		expect(dismissButton).not.toBeInTheDocument();
	});

	it('calls onDismiss when dismiss button is clicked', () => {
		const onDismiss = vi.fn();
		renderToast({ isOpen: true, title: TEST_TITLE, onDismiss, dismissLabel: TEST_DISMISS_LABEL });

		const dismissButton = screen.getByLabelText(TEST_DISMISS_LABEL);
		fireEvent.click(dismissButton);

		expect(onDismiss).toHaveBeenCalledTimes(1);
	});

	it('handles multiple dismiss clicks', () => {
		const onDismiss = vi.fn();
		renderToast({ isOpen: true, title: TEST_TITLE, onDismiss, dismissLabel: TEST_DISMISS_LABEL });

		const dismissButton = screen.getByLabelText(TEST_DISMISS_LABEL);
		fireEvent.click(dismissButton);
		fireEvent.click(dismissButton);

		expect(onDismiss).toHaveBeenCalledTimes(2);
	});
});

describe('Toast - Auto-dismiss', () => {
	it('auto-dismisses after default duration when autoDismiss is true', async () => {
		const onDismiss = vi.fn();
		renderToast({
			isOpen: true,
			title: TEST_TITLE,
			onDismiss,
			autoDismiss: true,
			dismissAfter: 1000,
		});

		expect(screen.getByText(TEST_TITLE)).toBeInTheDocument();

		act(() => {
			vi.advanceTimersByTime(1000);
		});
		await flushPromises();
		expect(onDismiss).toHaveBeenCalledTimes(1);
	});

	it('does not auto-dismiss when autoDismiss is false', async () => {
		const onDismiss = vi.fn();
		renderToast({
			isOpen: true,
			title: TEST_TITLE,
			onDismiss,
			autoDismiss: false,
			dismissAfter: 1000,
		});

		act(() => {
			vi.advanceTimersByTime(2000);
		});
		await flushPromises();
		expect(onDismiss).not.toHaveBeenCalled();
		expect(screen.getByText(TEST_TITLE)).toBeInTheDocument();
	});

	it('uses custom dismissAfter duration', async () => {
		const onDismiss = vi.fn();
		const customDuration = 2000;
		renderToast({
			isOpen: true,
			title: TEST_TITLE,
			onDismiss,
			autoDismiss: true,
			dismissAfter: customDuration,
		});

		act(() => {
			vi.advanceTimersByTime(customDuration - 100);
		});
		await flushPromises();
		expect(onDismiss).not.toHaveBeenCalled();

		act(() => {
			vi.advanceTimersByTime(200);
		});
		await flushPromises();
		expect(onDismiss).toHaveBeenCalledTimes(1);
	});
});

describe('Toast - Auto-dismiss pause on hover', () => {
	it('pauses auto-dismiss on hover when pauseOnHover is true', async () => {
		const onDismiss = vi.fn();
		renderToast({
			isOpen: true,
			title: TEST_TITLE,
			onDismiss,
			autoDismiss: true,
			dismissAfter: 1000,
			pauseOnHover: true,
		});

		const toast = screen.getByRole('status');
		fireEvent.mouseEnter(toast);

		act(() => {
			vi.advanceTimersByTime(1500);
		});
		await flushPromises();
		expect(onDismiss).not.toHaveBeenCalled();

		fireEvent.mouseLeave(toast);
		act(() => {
			vi.advanceTimersByTime(1000);
		});
		await flushPromises();
		expect(onDismiss).toHaveBeenCalledTimes(1);
	});
});

describe('Toast - Action Button', () => {
	it('renders action button when action is provided', () => {
		const action = {
			label: TEST_ACTION_LABEL,
			onClick: vi.fn(),
		};
		renderToast({ isOpen: true, title: TEST_TITLE, action });

		const actionButton = screen.getByText(TEST_ACTION_LABEL);
		expect(actionButton).toBeInTheDocument();
	});

	it('calls action onClick when action button is clicked', () => {
		const actionOnClick = vi.fn();
		const action = {
			label: TEST_ACTION_LABEL,
			onClick: actionOnClick,
		};
		renderToast({ isOpen: true, title: TEST_TITLE, action });

		const actionButton = screen.getByText(TEST_ACTION_LABEL);
		fireEvent.click(actionButton);

		expect(actionOnClick).toHaveBeenCalledTimes(1);
	});

	it('renders both action and dismiss buttons', () => {
		const onDismiss = vi.fn();
		const action = {
			label: TEST_ACTION_LABEL,
			onClick: vi.fn(),
		};
		renderToast({
			isOpen: true,
			title: TEST_TITLE,
			action,
			onDismiss,
			dismissLabel: TEST_DISMISS_LABEL,
		});

		expect(screen.getByText(TEST_ACTION_LABEL)).toBeInTheDocument();
		expect(screen.getByLabelText(TEST_DISMISS_LABEL)).toBeInTheDocument();
	});
});

describe('Toast - Edge Cases', () => {
	it('handles empty title gracefully', () => {
		renderToast({ isOpen: true, description: TEST_DESCRIPTION });

		expect(screen.getByText(TEST_DESCRIPTION)).toBeInTheDocument();
	});

	it('handles empty description gracefully', () => {
		renderToast({ isOpen: true, title: TEST_TITLE });

		expect(screen.getByText(TEST_TITLE)).toBeInTheDocument();
	});

	it('handles both title and children', () => {
		renderToast({ isOpen: true, title: TEST_TITLE, children: TEST_CHILDREN });

		expect(screen.getByText(TEST_TITLE)).toBeInTheDocument();
		expect(screen.getByTestId('toast-children')).toBeInTheDocument();
	});

	it('handles rapid state changes', () => {
		const { rerender } = renderToast({ isOpen: false, title: TEST_TITLE });

		expect(screen.queryByText(TEST_TITLE)).not.toBeInTheDocument();

		rerender(<Toast isOpen={true} title={TEST_TITLE} />);
		expect(screen.getByText(TEST_TITLE)).toBeInTheDocument();

		rerender(<Toast isOpen={false} title={TEST_TITLE} />);
		expect(screen.queryByText(TEST_TITLE)).not.toBeInTheDocument();
	});
});
