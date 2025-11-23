/**
 * Tests for Progress component
 *
 * Tests the progress indicator component:
 * - Rendering with different props
 * - Variants (sizes)
 * - Animations
 * - Accessibility attributes
 * - Value calculations
 */

import { PROGRESS_BASE_CLASSES, PROGRESS_SIZE_CLASSES } from '@core/constants/ui/display/progress';
import Progress from '@core/ui/feedback/progress/Progress';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it } from 'vitest';

const TEST_VALUE = 50;
const TEST_MAX = 100;
const CUSTOM_ARIA_LABEL = 'Custom progress label';
const CUSTOM_CLASSNAME = 'custom-progress-class';

// Helper to render Progress with common props
function renderProgress(props: Parameters<typeof Progress>[0]) {
	return renderWithProviders(<Progress {...props} />);
}

// Helper to get progress element
// Note: Native progress element doesn't need explicit role="progressbar"
function getProgress(): HTMLElement {
	return screen.getByRole('progressbar');
}

// Helper to get progress bar element safely
function getProgressBar(): HTMLElement {
	return screen.getByTestId('progress-bar');
}

// Helper to calculate expected percentage
function calculatePercentage(value: number, max: number): number {
	return Math.min(Math.max((value / max) * 100, 0), 100);
}

describe('Progress - Rendering', () => {
	it('renders without crashing', () => {
		expect(() => {
			renderProgress({ value: TEST_VALUE });
		}).not.toThrow();
	});

	it('renders progress element', () => {
		renderProgress({ value: TEST_VALUE });

		const progress = getProgress();
		expect(progress).toBeInTheDocument();
	});

	it('renders with custom className', () => {
		renderProgress({ value: TEST_VALUE, className: CUSTOM_CLASSNAME });

		const progress = getProgress();
		expect(progress).toHaveClass(CUSTOM_CLASSNAME);
	});

	it('renders progress bar inside', () => {
		renderProgress({ value: TEST_VALUE });

		const progressBar = getProgressBar();
		expect(progressBar).toBeInTheDocument();
	});
});

describe('Progress - Value and Max', () => {
	it('renders with default max value (100)', () => {
		renderProgress({ value: TEST_VALUE });

		const progress = getProgress();
		expect(progress).toHaveAttribute('max', '100');
	});

	it('renders with custom max value', () => {
		const customMax = 200;
		renderProgress({ value: TEST_VALUE, max: customMax });

		const progress = getProgress();
		expect(progress).toHaveAttribute('max', String(customMax));
	});

	it('renders with correct value attribute', () => {
		renderProgress({ value: TEST_VALUE });

		const progress = getProgress();
		expect(progress).toHaveAttribute('value', String(TEST_VALUE));
	});

	it('calculates percentage correctly', () => {
		renderProgress({ value: 25, max: 100 });

		const progressBar = getProgressBar();
		expect(progressBar).toHaveStyle({ width: '25%' });
	});

	it('handles value at 0', () => {
		renderProgress({ value: 0, max: TEST_MAX });

		const progressBar = getProgressBar();
		expect(progressBar).toHaveStyle({ width: '0%' });
	});

	it('handles value at max', () => {
		renderProgress({ value: TEST_MAX, max: TEST_MAX });

		const progressBar = getProgressBar();
		expect(progressBar).toHaveStyle({ width: '100%' });
	});

	it('clamps value above max to 100%', () => {
		renderProgress({ value: 150, max: TEST_MAX });

		const progressBar = getProgressBar();
		expect(progressBar).toHaveStyle({ width: '100%' });
	});

	it('clamps value below 0 to 0%', () => {
		renderProgress({ value: -10, max: TEST_MAX });

		const progressBar = getProgressBar();
		expect(progressBar).toHaveStyle({ width: '0%' });
	});

	it('handles custom max value correctly', () => {
		renderProgress({ value: 50, max: 200 });

		const progressBar = getProgressBar();
		const expectedPercentage = calculatePercentage(50, 200);
		expect(progressBar).toHaveStyle({ width: `${expectedPercentage}%` });
	});
});

describe('Progress - Variants', () => {
	it('renders with sm size', () => {
		renderProgress({ value: TEST_VALUE, size: 'sm' });

		const progress = getProgress();
		expect(progress).toHaveClass(PROGRESS_SIZE_CLASSES.sm);
	});

	it('renders with md size (default)', () => {
		renderProgress({ value: TEST_VALUE, size: 'md' });

		const progress = getProgress();
		expect(progress).toHaveClass(PROGRESS_SIZE_CLASSES.md);
	});

	it('renders with lg size', () => {
		renderProgress({ value: TEST_VALUE, size: 'lg' });

		const progress = getProgress();
		expect(progress).toHaveClass(PROGRESS_SIZE_CLASSES.lg);
	});

	it('applies base classes', () => {
		renderProgress({ value: TEST_VALUE });

		const progress = getProgress();
		expect(progress).toHaveClass(PROGRESS_BASE_CLASSES);
	});

	it('applies correct size classes for each variant', () => {
		const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];

		for (const size of sizes) {
			const { unmount } = renderProgress({ value: TEST_VALUE, size });
			const progress = getProgress();
			expect(progress).toHaveClass(PROGRESS_SIZE_CLASSES[size]);
			unmount();
		}
	});
});

describe('Progress - Show Value', () => {
	it('does not show value by default', () => {
		renderProgress({ value: TEST_VALUE });

		const valueText = screen.queryByText(`${TEST_VALUE}%`);
		expect(valueText).not.toBeInTheDocument();
	});

	it('shows value when showValue is true', () => {
		renderProgress({ value: TEST_VALUE, showValue: true });

		const valueText = screen.getByText(`${TEST_VALUE}%`);
		expect(valueText).toBeInTheDocument();
	});

	it('shows rounded percentage value', () => {
		renderProgress({ value: 33.7, showValue: true });

		const valueText = screen.getByText('34%');
		expect(valueText).toBeInTheDocument();
	});

	it('does not show value when aria-label is provided', () => {
		renderProgress({ value: TEST_VALUE, showValue: true, 'aria-label': CUSTOM_ARIA_LABEL });

		const valueText = screen.queryByText(`${TEST_VALUE}%`);
		expect(valueText).not.toBeInTheDocument();
	});

	it('shows value text with correct styling', () => {
		renderProgress({ value: TEST_VALUE, showValue: true });

		const valueText = screen.getByText(`${TEST_VALUE}%`);
		expect(valueText).toHaveClass('text-xs');
	});
});

describe('Progress - Accessibility', () => {
	it('has implicit progressbar role (native progress element)', () => {
		renderProgress({ value: TEST_VALUE });

		const progress = getProgress();
		expect(progress).toBeInTheDocument();
		// Native progress element has implicit role="progressbar"
		expect(progress.tagName.toLowerCase()).toBe('progress');
	});

	it('has aria-label when provided', () => {
		renderProgress({ value: TEST_VALUE, 'aria-label': CUSTOM_ARIA_LABEL });

		const progress = getProgress();
		expect(progress).toHaveAttribute('aria-label', CUSTOM_ARIA_LABEL);
	});

	it('uses percentage as aria-label when showValue is true and no custom label', () => {
		renderProgress({ value: TEST_VALUE, showValue: true });

		const progress = getProgress();
		const expectedLabel = `${Math.round(calculatePercentage(TEST_VALUE, TEST_MAX))}%`;
		expect(progress).toHaveAttribute('aria-label', expectedLabel);
	});

	it('has value and max attributes for screen readers', () => {
		renderProgress({ value: TEST_VALUE, max: TEST_MAX });

		const progress = getProgress();
		expect(progress).toHaveAttribute('value', String(TEST_VALUE));
		expect(progress).toHaveAttribute('max', String(TEST_MAX));
	});

	it('has accessible structure', () => {
		renderProgress({ value: TEST_VALUE });

		const progress = getProgress();
		// Native progress element has implicit role, doesn't need explicit role attribute
		expect(progress).toHaveAttribute('value');
		expect(progress).toHaveAttribute('max');
	});
});

describe('Progress - Animations', () => {
	it('renders progress bar with width style for animation', () => {
		renderProgress({ value: TEST_VALUE });

		const progressBar = getProgressBar();
		expect(progressBar).toBeInTheDocument();
		// Check that width style is set (as a percentage string)
		expect(progressBar).toHaveAttribute('style');
		const style = progressBar.getAttribute('style') ?? '';
		expect(style).toContain('width');
		expect(style).toContain('%');
	});

	it('updates width when value changes', () => {
		const { rerender } = renderProgress({ value: 25 });

		let progressBar = getProgressBar();
		expect(progressBar).toHaveStyle({ width: '25%' });

		rerender(<Progress value={75} />);

		progressBar = getProgressBar();
		expect(progressBar).toHaveStyle({ width: '75%' });
	});
});

describe('Progress - Edge Cases', () => {
	it('handles zero max value', () => {
		renderProgress({ value: 0, max: 0 });

		const progress = getProgress();
		expect(progress).toHaveAttribute('max', '0');
		expect(progress).toHaveAttribute('value', '0');
	});

	it('handles very large values', () => {
		renderProgress({ value: 1000000, max: TEST_MAX });

		const progressBar = getProgressBar();
		expect(progressBar).toHaveStyle({ width: '100%' });
	});

	it('handles decimal values', () => {
		renderProgress({ value: 33.333, max: TEST_MAX });

		const progressBar = getProgressBar();
		const expectedPercentage = calculatePercentage(33.333, TEST_MAX);
		expect(progressBar).toHaveStyle({ width: `${expectedPercentage}%` });
	});

	it('handles rapid value changes', () => {
		const { rerender } = renderProgress({ value: 0 });

		for (let i = 10; i <= 100; i += 10) {
			rerender(<Progress value={i} />);
			const progressBar = getProgressBar();
			expect(progressBar).toHaveStyle({ width: `${i}%` });
		}
	});

	it('handles negative max value', () => {
		renderProgress({ value: 50, max: -100 });

		const progressBar = getProgressBar();
		// Should clamp to 0% or handle gracefully
		expect(progressBar).toBeInTheDocument();
	});
});
