/**
 * Tests for Snackbar component
 *
 * Tests the snackbar notification component:
 * - Rendering with different props
 * - Variants (intents)
 * - Animations and transitions
 * - Accessibility attributes
 * - Dismissal functionality
 * - Auto-dismiss behavior
 */

import { SNACKBAR_INTENT_STYLES } from '@core/ui/feedback/snackbar/constants/snackbar.constants';
import Snackbar from '@core/ui/feedback/snackbar/Snackbar';
import { act, fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const TEST_MESSAGE = 'Test snackbar message';
const TEST_ACTION_LABEL = 'Action';

// Mock timers for auto-dismiss tests
beforeEach(() => {
	vi.useFakeTimers();
});

afterEach(() => {
	vi.useRealTimers();
});

// Helper to render Snackbar with common props
function renderSnackbar(props: Parameters<typeof Snackbar>[0]) {
	return renderWithProviders(<Snackbar {...props} />);
}

// Helper to assert intent styles
function assertIntentStyles(intent: 'info' | 'success' | 'warning' | 'error') {
	const snackbar = screen.getByRole('status');
	expect(snackbar).toHaveClass(SNACKBAR_INTENT_STYLES[intent]);
}

describe('Snackbar - Rendering', () => {
	it('renders without crashing', () => {
		expect(() => {
			renderSnackbar({ isOpen: true, message: TEST_MESSAGE });
		}).not.toThrow();
	});

	it('does not render when isOpen is false', () => {
		renderSnackbar({ isOpen: false, message: TEST_MESSAGE });

		expect(screen.queryByText(TEST_MESSAGE)).not.toBeInTheDocument();
	});

	it('renders when isOpen is true', () => {
		renderSnackbar({ isOpen: true, message: TEST_MESSAGE });

		expect(screen.getByText(TEST_MESSAGE)).toBeInTheDocument();
	});

	it('renders message text', () => {
		renderSnackbar({ isOpen: true, message: TEST_MESSAGE });

		expect(screen.getByText(TEST_MESSAGE)).toBeInTheDocument();
	});

	it('renders with ReactNode message', () => {
		const nodeMessage = <div data-testid="node-message">Node message</div>;
		renderSnackbar({ isOpen: true, message: nodeMessage });

		expect(screen.getByTestId('node-message')).toBeInTheDocument();
	});

	it('renders with custom className', () => {
		const customClass = 'custom-snackbar-class';
		renderSnackbar({ isOpen: true, message: TEST_MESSAGE, className: customClass });

		const snackbar = screen.getByRole('status');
		expect(snackbar).toHaveClass(customClass);
	});

	it('has fixed positioning via className', () => {
		renderSnackbar({ isOpen: true, message: TEST_MESSAGE });

		const snackbar = screen.getByRole('status');
		// Fixed positioning is applied via className 'fixed'
		expect(snackbar.className).toContain('fixed');
	});
});

describe('Snackbar - Variants', () => {
	it('renders with info intent (default)', () => {
		renderSnackbar({ isOpen: true, message: TEST_MESSAGE, intent: 'info' });

		assertIntentStyles('info');
		const snackbar = screen.getByRole('status');
		expect(snackbar).toBeInTheDocument();
	});

	it('renders with success intent', () => {
		renderSnackbar({ isOpen: true, message: TEST_MESSAGE, intent: 'success' });

		assertIntentStyles('success');
		const snackbar = screen.getByRole('status');
		expect(snackbar).toBeInTheDocument();
	});

	it('renders with warning intent', () => {
		renderSnackbar({ isOpen: true, message: TEST_MESSAGE, intent: 'warning' });

		assertIntentStyles('warning');
		const snackbar = screen.getByRole('status');
		expect(snackbar).toBeInTheDocument();
	});

	it('renders with error intent', () => {
		renderSnackbar({ isOpen: true, message: TEST_MESSAGE, intent: 'error' });

		assertIntentStyles('error');
		const snackbar = screen.getByRole('status');
		expect(snackbar).toBeInTheDocument();
	});

	it('applies correct intent styles for each variant', () => {
		const intents: Array<'info' | 'success' | 'warning' | 'error'> = [
			'info',
			'success',
			'warning',
			'error',
		];

		for (const intent of intents) {
			const { unmount } = renderSnackbar({ isOpen: true, message: TEST_MESSAGE, intent });
			assertIntentStyles(intent);
			unmount();
		}
	});
});

describe('Snackbar - Animations', () => {
	it('has transition classes for smooth animations', () => {
		renderSnackbar({ isOpen: true, message: TEST_MESSAGE });

		const snackbar = screen.getByRole('status');
		// Check for transition classes
		expect(snackbar.className).toContain('transition');
		expect(snackbar.className).toContain('duration');
	});

	it('has shadow for visual depth', () => {
		renderSnackbar({ isOpen: true, message: TEST_MESSAGE });

		const snackbar = screen.getByRole('status');
		expect(snackbar.className).toContain('shadow');
	});
});

describe('Snackbar - Accessibility', () => {
	it('has aria-live="polite" attribute', () => {
		renderSnackbar({ isOpen: true, message: TEST_MESSAGE });

		const snackbar = screen.getByRole('status');
		expect(snackbar).toHaveAttribute('aria-live', 'polite');
	});

	it('uses output element for semantic meaning', () => {
		renderSnackbar({ isOpen: true, message: TEST_MESSAGE });

		const snackbar = screen.getByRole('status');
		expect(snackbar.tagName.toLowerCase()).toBe('output');
	});

	it('has proper z-index for layering', () => {
		renderSnackbar({ isOpen: true, message: TEST_MESSAGE });

		const snackbar = screen.getByRole('status');
		expect(snackbar).toHaveStyle({ zIndex: expect.any(String) });
	});
});

describe('Snackbar - Dismissal', () => {
	it('renders dismiss button when onDismiss is provided', () => {
		const onDismiss = vi.fn();
		renderSnackbar({ isOpen: true, message: TEST_MESSAGE, onDismiss });

		const dismissButton = screen.getByRole('button');
		expect(dismissButton).toBeInTheDocument();
	});

	it('does not render dismiss button when onDismiss is not provided', () => {
		renderSnackbar({ isOpen: true, message: TEST_MESSAGE });

		const buttons = screen.queryAllByRole('button');
		expect(buttons).toHaveLength(0);
	});

	it('calls onDismiss when dismiss button is clicked', () => {
		const onDismiss = vi.fn();
		renderSnackbar({ isOpen: true, message: TEST_MESSAGE, onDismiss });

		const dismissButton = screen.getByRole('button');
		fireEvent.click(dismissButton);

		expect(onDismiss).toHaveBeenCalledTimes(1);
	});

	it('handles multiple dismiss clicks', () => {
		const onDismiss = vi.fn();
		renderSnackbar({ isOpen: true, message: TEST_MESSAGE, onDismiss });

		const dismissButton = screen.getByRole('button');
		fireEvent.click(dismissButton);
		fireEvent.click(dismissButton);

		expect(onDismiss).toHaveBeenCalledTimes(2);
	});
});

describe('Snackbar - Auto-dismiss', () => {
	it('auto-dismisses after default duration when autoDismiss is true', () => {
		const onDismiss = vi.fn();
		renderSnackbar({
			isOpen: true,
			message: TEST_MESSAGE,
			onDismiss,
			autoDismiss: true,
			dismissAfter: 1000,
		});

		expect(screen.getByText(TEST_MESSAGE)).toBeInTheDocument();

		act(() => {
			vi.advanceTimersByTime(1000);
		});
		expect(onDismiss).toHaveBeenCalledTimes(1);
	});

	it('does not auto-dismiss when autoDismiss is false', () => {
		const onDismiss = vi.fn();
		renderSnackbar({
			isOpen: true,
			message: TEST_MESSAGE,
			onDismiss,
			autoDismiss: false,
			dismissAfter: 1000,
		});

		act(() => {
			vi.advanceTimersByTime(2000);
		});
		expect(onDismiss).not.toHaveBeenCalled();
		expect(screen.getByText(TEST_MESSAGE)).toBeInTheDocument();
	});

	it('uses custom dismissAfter duration', () => {
		const onDismiss = vi.fn();
		const customDuration = 2000;
		renderSnackbar({
			isOpen: true,
			message: TEST_MESSAGE,
			onDismiss,
			autoDismiss: true,
			dismissAfter: customDuration,
		});

		act(() => {
			vi.advanceTimersByTime(customDuration - 100);
		});
		expect(onDismiss).not.toHaveBeenCalled();

		act(() => {
			vi.advanceTimersByTime(200);
		});
		expect(onDismiss).toHaveBeenCalledTimes(1);
	});
});

describe('Snackbar - Auto-dismiss cleanup', () => {
	it('cleans up timeout when component unmounts', () => {
		const onDismiss = vi.fn();
		const { unmount } = renderSnackbar({
			isOpen: true,
			message: TEST_MESSAGE,
			onDismiss,
			autoDismiss: true,
			dismissAfter: 1000,
		});

		unmount();

		act(() => {
			vi.advanceTimersByTime(2000);
		});
		expect(onDismiss).not.toHaveBeenCalled();
	});

	it('resets timeout when isOpen changes', () => {
		const onDismiss = vi.fn();
		const { rerender } = renderSnackbar({
			isOpen: true,
			message: TEST_MESSAGE,
			onDismiss,
			autoDismiss: true,
			dismissAfter: 1000,
		});

		act(() => {
			vi.advanceTimersByTime(500);
		});

		rerender(
			<Snackbar
				isOpen={false}
				message={TEST_MESSAGE}
				onDismiss={onDismiss}
				autoDismiss={true}
				dismissAfter={1000}
			/>
		);

		act(() => {
			vi.advanceTimersByTime(1000);
		});
		expect(onDismiss).not.toHaveBeenCalled();
	});
});

describe('Snackbar - Action Button', () => {
	it('renders action button when action is provided', () => {
		const action = {
			label: TEST_ACTION_LABEL,
			onClick: vi.fn(),
		};
		renderSnackbar({ isOpen: true, message: TEST_MESSAGE, action });

		const actionButton = screen.getByText(TEST_ACTION_LABEL);
		expect(actionButton).toBeInTheDocument();
	});

	it('calls action onClick when action button is clicked', () => {
		const actionOnClick = vi.fn();
		const action = {
			label: TEST_ACTION_LABEL,
			onClick: actionOnClick,
		};
		renderSnackbar({ isOpen: true, message: TEST_MESSAGE, action });

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
		renderSnackbar({ isOpen: true, message: TEST_MESSAGE, action, onDismiss });

		expect(screen.getByText(TEST_ACTION_LABEL)).toBeInTheDocument();
		const buttons = screen.getAllByRole('button');
		expect(buttons.length).toBeGreaterThanOrEqual(2);
	});
});

describe('Snackbar - Edge Cases', () => {
	it('handles empty message gracefully', () => {
		renderSnackbar({ isOpen: true, message: '' });

		const snackbar = screen.getByRole('status');
		expect(snackbar).toBeInTheDocument();
	});

	it('handles rapid state changes', () => {
		const { rerender } = renderSnackbar({ isOpen: false, message: TEST_MESSAGE });

		expect(screen.queryByText(TEST_MESSAGE)).not.toBeInTheDocument();

		rerender(<Snackbar isOpen={true} message={TEST_MESSAGE} />);
		expect(screen.getByText(TEST_MESSAGE)).toBeInTheDocument();

		rerender(<Snackbar isOpen={false} message={TEST_MESSAGE} />);
		expect(screen.queryByText(TEST_MESSAGE)).not.toBeInTheDocument();
	});

	it('handles rapid dismiss clicks', () => {
		const onDismiss = vi.fn();
		renderSnackbar({ isOpen: true, message: TEST_MESSAGE, onDismiss });

		const dismissButton = screen.getByRole('button');
		for (let i = 0; i < 5; i++) {
			fireEvent.click(dismissButton);
		}

		expect(onDismiss).toHaveBeenCalledTimes(5);
	});
});
