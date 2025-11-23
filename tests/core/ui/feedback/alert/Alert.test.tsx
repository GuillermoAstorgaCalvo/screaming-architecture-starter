/**
 * Tests for Alert component
 *
 * Tests the alert notification component:
 * - Rendering with different props
 * - Variants (intents)
 * - Animations and transitions
 * - Accessibility attributes
 * - Dismissal functionality
 */

import Alert from '@core/ui/feedback/alert/Alert';
import { ALERT_INTENT_STYLES } from '@core/ui/feedback/alert/constants/Alert.constants';
import { getDefaultRole } from '@core/ui/feedback/alert/helpers/Alert.helpers';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

const TEST_TITLE = 'Test Alert Title';
const TEST_DESCRIPTION = 'Test alert description';
const TEST_CHILDREN = <div data-testid="alert-children">Custom content</div>;
const TEST_DISMISS_LABEL = 'Close alert';
const TEST_ACTION_LABEL = 'Action';

// Helper to render Alert with common props
function renderAlert(props: Parameters<typeof Alert>[0] = {}) {
	return renderWithProviders(<Alert {...props} />);
}

type AlertIntent = 'info' | 'success' | 'warning' | 'error';

// Helper to assert intent styles
function assertIntentStyles(intent: AlertIntent) {
	const alert = screen.getByRole(getDefaultRole(intent));
	expect(alert).toHaveClass(ALERT_INTENT_STYLES[intent]);
}

// Helper to assert accessibility attributes
function assertAccessibility(role: 'alert' | 'status') {
	const alert = screen.getByRole(role);
	expect(alert).toBeInTheDocument();
	expect(alert).toHaveAttribute('role', role);
}

describe('Alert - Rendering', () => {
	it('renders without crashing', () => {
		expect(() => {
			renderAlert({ title: TEST_TITLE });
		}).not.toThrow();
	});

	it('renders with title only', () => {
		renderAlert({ title: TEST_TITLE });

		expect(screen.getByText(TEST_TITLE)).toBeInTheDocument();
	});

	it('renders with description only', () => {
		renderAlert({ description: TEST_DESCRIPTION });

		expect(screen.getByText(TEST_DESCRIPTION)).toBeInTheDocument();
	});

	it('renders with both title and description', () => {
		renderAlert({ title: TEST_TITLE, description: TEST_DESCRIPTION });

		expect(screen.getByText(TEST_TITLE)).toBeInTheDocument();
		expect(screen.getByText(TEST_DESCRIPTION)).toBeInTheDocument();
	});

	it('renders with children content', () => {
		renderAlert({ children: TEST_CHILDREN });

		expect(screen.getByTestId('alert-children')).toBeInTheDocument();
	});

	it('renders with custom className', () => {
		const customClass = 'custom-alert-class';
		renderAlert({ title: TEST_TITLE, className: customClass });

		const alert = screen.getByRole('status');
		expect(alert).toHaveClass(customClass);
	});

	it('renders icon by default', () => {
		renderAlert({ title: TEST_TITLE, intent: 'info' });

		const alert = screen.getByRole('status');
		expect(alert).toBeInTheDocument();
		// Icon is rendered within AlertIcon component
		// Check that alert contains SVG (icon is rendered as SVG path)
		const alertContent = alert.innerHTML;
		expect(alertContent).toContain('<svg');
	});

	it('renders custom icon when provided', () => {
		const customIcon = <div data-testid="custom-icon">Custom Icon</div>;
		renderAlert({ title: TEST_TITLE, icon: customIcon });

		expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
	});
});

describe('Alert - Variants', () => {
	it('renders with info intent (default)', () => {
		renderAlert({ title: TEST_TITLE });

		assertIntentStyles('info');
		assertAccessibility('status');
	});

	it('renders with success intent', () => {
		renderAlert({ title: TEST_TITLE, intent: 'success' });

		assertIntentStyles('success');
		assertAccessibility('status');
	});

	it('renders with warning intent', () => {
		renderAlert({ title: TEST_TITLE, intent: 'warning' });

		assertIntentStyles('warning');
		assertAccessibility('alert');
	});

	it('renders with error intent', () => {
		renderAlert({ title: TEST_TITLE, intent: 'error' });

		assertIntentStyles('error');
		assertAccessibility('alert');
	});

	it('applies correct intent styles for each variant', () => {
		const intents: AlertIntent[] = ['info', 'success', 'warning', 'error'];

		for (const intent of intents) {
			const { unmount } = renderAlert({ title: TEST_TITLE, intent });
			assertIntentStyles(intent);
			const role = getDefaultRole(intent);
			assertAccessibility(role);
			unmount();
		}
	});
});

describe('Alert - Animations', () => {
	it('has transition classes for smooth animations', () => {
		renderAlert({ title: TEST_TITLE });

		const alert = screen.getByRole('status');
		// Check for transition classes (from ALERT_BASE_CLASSES)
		expect(alert.className).toContain('transition');
		expect(alert.className).toContain('duration');
	});

	it('has focus-within ring for keyboard navigation', () => {
		renderAlert({ title: TEST_TITLE });

		const alert = screen.getByRole('status');
		expect(alert.className).toContain('focus-within:ring');
	});
});

describe('Alert - Accessibility', () => {
	it('has correct role for info intent (status)', () => {
		renderAlert({ title: TEST_TITLE, intent: 'info' });

		assertAccessibility('status');
	});

	it('has correct role for success intent (status)', () => {
		renderAlert({ title: TEST_TITLE, intent: 'success' });

		assertAccessibility('status');
	});

	it('has correct role for warning intent (alert)', () => {
		renderAlert({ title: TEST_TITLE, intent: 'warning' });

		assertAccessibility('alert');
	});

	it('has correct role for error intent (alert)', () => {
		renderAlert({ title: TEST_TITLE, intent: 'error' });

		assertAccessibility('alert');
	});

	it('allows custom role override', () => {
		renderAlert({ title: TEST_TITLE, intent: 'error', role: 'status' });

		const alert = screen.getByRole('status');
		expect(alert).toHaveAttribute('role', 'status');
	});

	it('has dismissible button with accessible label', () => {
		const onDismiss = vi.fn();
		renderAlert({ title: TEST_TITLE, onDismiss, dismissLabel: TEST_DISMISS_LABEL });

		const dismissButton = screen.getByLabelText(TEST_DISMISS_LABEL);
		expect(dismissButton).toBeInTheDocument();
		expect(dismissButton).toHaveAttribute('aria-label', TEST_DISMISS_LABEL);
	});

	it('uses default dismiss label when not provided', () => {
		const onDismiss = vi.fn();
		renderAlert({ title: TEST_TITLE, onDismiss });

		// Default label comes from translation
		const dismissButton = screen.getByRole('button');
		expect(dismissButton).toBeInTheDocument();
	});
});

describe('Alert - Dismissal', () => {
	it('renders dismiss button when onDismiss is provided', () => {
		const onDismiss = vi.fn();
		renderAlert({ title: TEST_TITLE, onDismiss });

		const dismissButton = screen.getByRole('button');
		expect(dismissButton).toBeInTheDocument();
	});

	it('does not render dismiss button when onDismiss is not provided', () => {
		renderAlert({ title: TEST_TITLE });

		const buttons = screen.queryAllByRole('button');
		expect(buttons).toHaveLength(0);
	});

	it('calls onDismiss when dismiss button is clicked', () => {
		const onDismiss = vi.fn();
		renderAlert({ title: TEST_TITLE, onDismiss, dismissLabel: TEST_DISMISS_LABEL });

		const dismissButton = screen.getByLabelText(TEST_DISMISS_LABEL);
		fireEvent.click(dismissButton);

		expect(onDismiss).toHaveBeenCalledTimes(1);
	});

	it('handles multiple dismiss clicks', () => {
		const onDismiss = vi.fn();
		renderAlert({ title: TEST_TITLE, onDismiss, dismissLabel: TEST_DISMISS_LABEL });

		const dismissButton = screen.getByLabelText(TEST_DISMISS_LABEL);
		fireEvent.click(dismissButton);
		fireEvent.click(dismissButton);

		expect(onDismiss).toHaveBeenCalledTimes(2);
	});
});

describe('Alert - Action Button', () => {
	it('renders action button when action is provided', () => {
		const action = {
			label: TEST_ACTION_LABEL,
			onClick: vi.fn(),
		};
		renderAlert({ title: TEST_TITLE, action });

		const actionButton = screen.getByText(TEST_ACTION_LABEL);
		expect(actionButton).toBeInTheDocument();
	});

	it('calls action onClick when action button is clicked', () => {
		const actionOnClick = vi.fn();
		const action = {
			label: TEST_ACTION_LABEL,
			onClick: actionOnClick,
		};
		renderAlert({ title: TEST_TITLE, action });

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
		renderAlert({ title: TEST_TITLE, action, onDismiss, dismissLabel: TEST_DISMISS_LABEL });

		expect(screen.getByText(TEST_ACTION_LABEL)).toBeInTheDocument();
		expect(screen.getByLabelText(TEST_DISMISS_LABEL)).toBeInTheDocument();
	});
});

describe('Alert - Edge Cases', () => {
	it('handles empty title gracefully', () => {
		renderAlert({ description: TEST_DESCRIPTION });

		expect(screen.getByText(TEST_DESCRIPTION)).toBeInTheDocument();
	});

	it('handles empty description gracefully', () => {
		renderAlert({ title: TEST_TITLE });

		expect(screen.getByText(TEST_TITLE)).toBeInTheDocument();
	});

	it('handles both title and children', () => {
		renderAlert({ title: TEST_TITLE, children: TEST_CHILDREN });

		expect(screen.getByText(TEST_TITLE)).toBeInTheDocument();
		expect(screen.getByTestId('alert-children')).toBeInTheDocument();
	});

	it('handles rapid dismiss clicks', async () => {
		const onDismiss = vi.fn();
		renderAlert({ title: TEST_TITLE, onDismiss, dismissLabel: TEST_DISMISS_LABEL });

		const dismissButton = screen.getByLabelText(TEST_DISMISS_LABEL);
		for (let i = 0; i < 5; i++) {
			fireEvent.click(dismissButton);
		}

		await waitFor(() => {
			expect(onDismiss).toHaveBeenCalledTimes(5);
		});
	});
});
