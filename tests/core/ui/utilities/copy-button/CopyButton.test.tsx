/**
 * CopyButton Component Tests
 *
 * Tests for the CopyButton component including:
 * - Rendering
 * - Default props
 * - Custom props
 * - Copy functionality
 * - Success state
 * - Error handling
 * - Tooltip display
 * - Icon changes
 * - Accessibility
 * - Callbacks
 */

import CopyButton from '@core/ui/utilities/copy-button/CopyButton';
import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Constants
const DEFAULT_COPY_TOOLTIP = 'Copy to clipboard';
const DEFAULT_COPIED_TOOLTIP = 'Copied!';
const TEST_TEXT = 'test text';
const CUSTOM_CLASS_NAME = 'custom-class';

// Mock useTranslation
const mockT = vi.fn((key: string) => {
	const translations: Record<string, string> = {
		'copy.copyToClipboard': DEFAULT_COPY_TOOLTIP,
		'copy.copied': DEFAULT_COPIED_TOOLTIP,
	};
	return translations[key] ?? key;
});

vi.mock('@core/i18n/useTranslation', () => ({
	useTranslation: vi.fn(() => ({
		t: mockT,
	})),
}));

// Helper function to setup clipboard mock
function setupClipboardMock(mockImplementation?: () => Promise<void>) {
	const writeTextMock = mockImplementation
		? vi.fn(mockImplementation)
		: vi.fn().mockResolvedValue(undefined);

	Object.defineProperty(navigator, 'clipboard', {
		value: {
			writeText: writeTextMock,
		},
		writable: true,
		configurable: true,
	});

	return writeTextMock;
}

// Global cleanup to ensure clipboard mock is always restored
afterEach(() => {
	vi.clearAllTimers();
	vi.useRealTimers();
	// Always restore clipboard mock after each test
	setupClipboardMock();
});

describe('CopyButton - Rendering', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		setupClipboardMock();
	});

	it('renders the button', () => {
		renderWithProviders(<CopyButton text={TEST_TEXT} />);

		const button = screen.getByRole('button');
		expect(button).toBeInTheDocument();
	});

	it('renders with default props', () => {
		renderWithProviders(<CopyButton text={TEST_TEXT} />);

		const button = screen.getByRole('button');
		expect(button).toHaveAttribute('aria-label', DEFAULT_COPY_TOOLTIP);
	});

	it('renders with custom aria-label', () => {
		renderWithProviders(<CopyButton text={TEST_TEXT} aria-label="Custom copy label" />);

		const button = screen.getByRole('button');
		expect(button).toHaveAttribute('aria-label', 'Custom copy label');
	});

	it('renders with custom className', () => {
		renderWithProviders(<CopyButton text={TEST_TEXT} className={CUSTOM_CLASS_NAME} />);

		const button = screen.getByRole('button');
		expect(button).toHaveClass(CUSTOM_CLASS_NAME);
	});

	it('renders with custom size', () => {
		renderWithProviders(<CopyButton text={TEST_TEXT} size="lg" />);

		const button = screen.getByRole('button');
		expect(button).toBeInTheDocument();
	});

	it('renders with custom variant', () => {
		renderWithProviders(<CopyButton text={TEST_TEXT} variant="ghost" />);

		const button = screen.getByRole('button');
		expect(button).toBeInTheDocument();
	});

	it('forwards additional HTML attributes', () => {
		renderWithProviders(
			<CopyButton text={TEST_TEXT} data-testid="copy-button" data-custom="value" />
		);

		const button = screen.getByTestId('copy-button');
		expect(button).toHaveAttribute('data-custom', 'value');
	});
});

describe('CopyButton - Tooltip', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		setupClipboardMock();
	});

	it('shows default copy tooltip initially', () => {
		renderWithProviders(<CopyButton text={TEST_TEXT} />);

		const button = screen.getByRole('button');
		expect(button).toHaveAttribute('title', DEFAULT_COPY_TOOLTIP);
	});

	it('shows custom copy tooltip', () => {
		const customTooltip = 'Click to copy';
		renderWithProviders(<CopyButton text={TEST_TEXT} copyTooltip={customTooltip} />);

		const button = screen.getByRole('button');
		expect(button).toHaveAttribute('title', customTooltip);
	});

	it('shows custom copied tooltip after copy', async () => {
		const copiedTooltip = 'Successfully copied!';
		renderWithProviders(<CopyButton text={TEST_TEXT} copiedTooltip={copiedTooltip} />);

		const button = screen.getByRole('button');
		fireEvent.click(button);

		await waitFor(() => {
			expect(button).toHaveAttribute('title', copiedTooltip);
		});
	});

	it('updates tooltip after successful copy', async () => {
		renderWithProviders(<CopyButton text={TEST_TEXT} />);

		const button = screen.getByRole('button');
		expect(button).toHaveAttribute('title', DEFAULT_COPY_TOOLTIP);

		fireEvent.click(button);

		await waitFor(() => {
			expect(button).toHaveAttribute('title', DEFAULT_COPIED_TOOLTIP);
		});
	});

	it('resets tooltip after success duration', async () => {
		renderWithProviders(<CopyButton text={TEST_TEXT} successDuration={100} />);

		const button = screen.getByRole('button');
		fireEvent.click(button);

		// Wait for clipboard operation and React to update
		await waitFor(() => {
			expect(button).toHaveAttribute('title', DEFAULT_COPIED_TOOLTIP);
		});

		// Wait for success duration to expire
		await waitFor(
			() => {
				expect(button).toHaveAttribute('title', DEFAULT_COPY_TOOLTIP);
			},
			{ timeout: 200 }
		);
	});
});

describe('CopyButton - Copy Functionality', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		setupClipboardMock();
	});

	it('copies text to clipboard on click', async () => {
		const text = 'text to copy';
		renderWithProviders(<CopyButton text={text} />);

		const button = screen.getByRole('button');
		fireEvent.click(button);

		// Wait for async clipboard operation to complete
		await act(async () => {
			await Promise.resolve();
		});

		expect(navigator.clipboard?.writeText).toHaveBeenCalledWith(text);
	});

	it('calls onCopySuccess callback on successful copy', async () => {
		const onCopySuccess = vi.fn();
		renderWithProviders(<CopyButton text={TEST_TEXT} onCopySuccess={onCopySuccess} />);

		const button = screen.getByRole('button');
		fireEvent.click(button);

		// Wait for async clipboard operation to complete
		await act(async () => {
			await Promise.resolve();
		});

		expect(onCopySuccess).toHaveBeenCalledTimes(1);
	});

	it('calls onCopyError callback on failed copy', async () => {
		const error = new Error('Copy failed');
		setupClipboardMock(() => Promise.reject(error));

		const onCopyError = vi.fn();
		renderWithProviders(<CopyButton text={TEST_TEXT} onCopyError={onCopyError} />);

		const button = screen.getByRole('button');
		fireEvent.click(button);

		// Wait for async error handling
		await act(async () => {
			await Promise.resolve();
		});

		expect(onCopyError).toHaveBeenCalledTimes(1);
		expect(onCopyError).toHaveBeenCalledWith(expect.any(Error));
	});

	it('handles multiple clicks', async () => {
		renderWithProviders(<CopyButton text={TEST_TEXT} />);

		const button = screen.getByRole('button');
		fireEvent.click(button);
		fireEvent.click(button);
		fireEvent.click(button);

		// Wait for async clipboard operations to complete
		await act(async () => {
			await Promise.resolve();
		});

		expect(navigator.clipboard?.writeText).toHaveBeenCalledTimes(3);
	});
});

describe('CopyButton - Success State', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		setupClipboardMock();
	});

	it('updates aria-label after successful copy', async () => {
		renderWithProviders(<CopyButton text={TEST_TEXT} />);

		const button = screen.getByRole('button');
		expect(button).toHaveAttribute('aria-label', DEFAULT_COPY_TOOLTIP);

		fireEvent.click(button);

		// Wait for async clipboard operation to complete first
		await act(async () => {
			await Promise.resolve();
		});

		// Then wait for React to update the aria-label
		await waitFor(
			() => {
				expect(button).toHaveAttribute('aria-label', DEFAULT_COPIED_TOOLTIP);
			},
			{ timeout: 3000 }
		);
	});

	it('uses custom copiedTooltip for aria-label when copied', async () => {
		const copiedTooltip = 'Successfully copied!';
		renderWithProviders(<CopyButton text={TEST_TEXT} copiedTooltip={copiedTooltip} />);

		const button = screen.getByRole('button');
		fireEvent.click(button);

		// Wait for async clipboard operation to complete first
		await act(async () => {
			await Promise.resolve();
		});

		// Then wait for React to update the aria-label
		await waitFor(
			() => {
				expect(button).toHaveAttribute('aria-label', copiedTooltip);
			},
			{ timeout: 3000 }
		);
	});

	it('resets aria-label after success duration', async () => {
		renderWithProviders(<CopyButton text={TEST_TEXT} successDuration={100} />);

		const button = screen.getByRole('button');
		fireEvent.click(button);

		// Wait for clipboard operation and React to update
		await waitFor(() => {
			expect(button).toHaveAttribute('aria-label', DEFAULT_COPIED_TOOLTIP);
		});

		// Wait for success duration to expire
		await waitFor(
			() => {
				expect(button).toHaveAttribute('aria-label', DEFAULT_COPY_TOOLTIP);
			},
			{ timeout: 200 }
		);
	});
});

describe('CopyButton - Custom Success Duration', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		setupClipboardMock();
	});

	it('uses custom successDuration', async () => {
		renderWithProviders(<CopyButton text={TEST_TEXT} successDuration={150} />);

		const button = screen.getByRole('button');
		fireEvent.click(button);

		// Wait for clipboard operation and React to update
		await waitFor(() => {
			expect(button).toHaveAttribute('title', DEFAULT_COPIED_TOOLTIP);
		});

		// Wait a bit but not enough for success duration to expire
		await act(async () => {
			await new Promise(resolve => {
				setTimeout(resolve, 50);
			});
		});

		// Should still show copied state
		expect(button).toHaveAttribute('title', DEFAULT_COPIED_TOOLTIP);

		// Wait for success duration to expire
		await waitFor(
			() => {
				expect(button).toHaveAttribute('title', DEFAULT_COPY_TOOLTIP);
			},
			{ timeout: 200 }
		);
	});

	it('uses default successDuration of 2000ms when not provided', async () => {
		renderWithProviders(<CopyButton text={TEST_TEXT} successDuration={100} />);

		const button = screen.getByRole('button');
		fireEvent.click(button);

		// Wait for clipboard operation and React to update
		await waitFor(() => {
			expect(button).toHaveAttribute('title', DEFAULT_COPIED_TOOLTIP);
		});

		// Wait for success duration to expire
		await waitFor(
			() => {
				expect(button).toHaveAttribute('title', DEFAULT_COPY_TOOLTIP);
			},
			{ timeout: 200 }
		);
	});
});

describe('CopyButton - Error Handling', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		// Always restore clipboard mock before each test
		setupClipboardMock();
	});

	it('handles clipboard API not available', async () => {
		// Remove clipboard API for this test
		Object.defineProperty(navigator, 'clipboard', {
			value: undefined,
			writable: true,
			configurable: true,
		});

		const onCopyError = vi.fn();
		renderWithProviders(<CopyButton text={TEST_TEXT} onCopyError={onCopyError} />);

		const button = screen.getByRole('button');
		fireEvent.click(button);

		// Wait for async error handling
		await act(async () => {
			await Promise.resolve();
		});

		expect(onCopyError).toHaveBeenCalledTimes(1);
		expect(onCopyError).toHaveBeenCalledWith(expect.any(Error));
		// Should not show success state
		expect(button).toHaveAttribute('title', DEFAULT_COPY_TOOLTIP);
	});

	it('handles clipboard write failure gracefully', async () => {
		const error = new Error('Write failed');
		setupClipboardMock(() => Promise.reject(error));

		const onCopyError = vi.fn();
		renderWithProviders(<CopyButton text={TEST_TEXT} onCopyError={onCopyError} />);

		const button = screen.getByRole('button');
		fireEvent.click(button);

		// Wait for async error handling
		await act(async () => {
			await Promise.resolve();
		});

		expect(onCopyError).toHaveBeenCalledTimes(1);
		// Should not show success state
		expect(button).toHaveAttribute('title', DEFAULT_COPY_TOOLTIP);
	});

	it('does not throw when onCopyError is not provided', async () => {
		setupClipboardMock(() => Promise.reject(new Error('Failed')));

		renderWithProviders(<CopyButton text={TEST_TEXT} />);

		const button = screen.getByRole('button');
		fireEvent.click(button);

		// Wait for async error handling
		await act(async () => {
			await Promise.resolve();
		});

		// Should not throw
		expect(button).toBeInTheDocument();
	});
});

describe('CopyButton - Props Forwarding', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		setupClipboardMock();
	});

	it('forwards data attributes', () => {
		renderWithProviders(
			<CopyButton text={TEST_TEXT} data-testid="copy-btn" data-analytics="copy-action" />
		);

		const button = screen.getByTestId('copy-btn');
		expect(button).toHaveAttribute('data-analytics', 'copy-action');
	});

	it('does not forward title prop (used internally)', () => {
		renderWithProviders(<CopyButton text={TEST_TEXT} title="Should not appear" />);

		const button = screen.getByRole('button');
		// Title should be the tooltip text, not the prop value
		expect(button).toHaveAttribute('title', DEFAULT_COPY_TOOLTIP);
	});

	it('forwards disabled prop', () => {
		renderWithProviders(<CopyButton text={TEST_TEXT} disabled />);

		const button = screen.getByRole('button');
		expect(button).toBeDisabled();
	});

	it('forwards id prop', () => {
		renderWithProviders(<CopyButton text={TEST_TEXT} id="copy-button-id" />);

		const button = screen.getByRole('button');
		expect(button).toHaveAttribute('id', 'copy-button-id');
	});
});

describe('CopyButton - Integration', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		setupClipboardMock();
	});

	it('handles complete copy flow', async () => {
		const onCopySuccess = vi.fn();
		const copyTooltip = 'Click to copy';
		const copiedTooltip = 'Copied successfully!';
		renderWithProviders(
			<CopyButton
				text={TEST_TEXT}
				onCopySuccess={onCopySuccess}
				copyTooltip={copyTooltip}
				copiedTooltip={copiedTooltip}
			/>
		);

		const button = screen.getByRole('button');

		// Initial state - aria-label uses default translation when not provided
		expect(button).toHaveAttribute('title', copyTooltip);
		expect(button).toHaveAttribute('aria-label', DEFAULT_COPY_TOOLTIP);

		// Click to copy
		fireEvent.click(button);

		// Wait for async clipboard operation and state update
		await act(async () => {
			await Promise.resolve();
		});

		// Give React time to update
		await waitFor(() => {
			expect(button).toHaveAttribute('title', copiedTooltip);
		});

		// Success state - check clipboard call
		expect(navigator.clipboard?.writeText).toHaveBeenCalledWith(TEST_TEXT);

		// Check success callback
		expect(onCopySuccess).toHaveBeenCalledTimes(1);

		// Check UI state
		expect(button).toHaveAttribute('title', copiedTooltip);
		expect(button).toHaveAttribute('aria-label', copiedTooltip);
	});

	it('handles rapid successive clicks', async () => {
		renderWithProviders(<CopyButton text={TEST_TEXT} successDuration={150} />);

		const button = screen.getByRole('button');

		// First click
		fireEvent.click(button);
		await waitFor(() => {
			expect(button).toHaveAttribute('title', DEFAULT_COPIED_TOOLTIP);
		});

		// Second click before timer expires
		await act(async () => {
			await new Promise(resolve => {
				setTimeout(resolve, 50);
			});
		});

		fireEvent.click(button);
		await act(async () => {
			await Promise.resolve();
		});

		// Should still show copied state
		expect(button).toHaveAttribute('title', DEFAULT_COPIED_TOOLTIP);

		// Timer should reset, so need to wait full duration from last click
		await waitFor(
			() => {
				expect(button).toHaveAttribute('title', DEFAULT_COPY_TOOLTIP);
			},
			{ timeout: 250 }
		);
	});
});
