/**
 * Tests for Spinner component
 *
 * Tests the loading spinner component:
 * - Rendering with different props
 * - Variants (sizes)
 * - Animations
 * - Accessibility attributes
 */

import { ARIA_LABELS, ARIA_LIVE, ARIA_ROLES } from '@core/constants/aria';
import Spinner from '@core/ui/feedback/spinner/Spinner';
import { getSpinnerVariantClasses } from '@core/ui/variants/spinner';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it } from 'vitest';

const CUSTOM_ARIA_LABEL = 'Custom loading label';
const CUSTOM_COLOR = '#ff0000';

// Helper to render Spinner with common props
function renderSpinner(props: Parameters<typeof Spinner>[0] = {}) {
	return renderWithProviders(<Spinner {...props} />);
}

// Helper to get spinner element
function getSpinner() {
	return screen.getByRole('status');
}

// Helper to get spinner SVG
function getSpinnerSvg() {
	const spinner = getSpinner();
	return spinner.querySelector('svg');
}

describe('Spinner - Rendering', () => {
	it('renders without crashing', () => {
		expect(() => {
			renderSpinner();
		}).not.toThrow();
	});

	it('renders spinner container', () => {
		renderSpinner();

		const spinner = getSpinner();
		expect(spinner).toBeInTheDocument();
	});

	it('renders SVG element', () => {
		renderSpinner();

		const svg = getSpinnerSvg();
		expect(svg).toBeInTheDocument();
	});

	it('renders with custom className', () => {
		const customClass = 'custom-spinner-class';
		renderSpinner({ className: customClass });

		const spinner = getSpinner();
		expect(spinner).toHaveClass(customClass);
	});

	it('renders with default size classes', () => {
		renderSpinner({ size: 'md' });

		const spinner = getSpinner();
		const classes = getSpinnerVariantClasses({ size: 'md' });
		expect(spinner).toHaveClass(classes);
	});
});

describe('Spinner - Variants', () => {
	it('renders with sm size', () => {
		renderSpinner({ size: 'sm' });

		const spinner = getSpinner();
		const classes = getSpinnerVariantClasses({ size: 'sm' });
		expect(spinner).toHaveClass(classes);
	});

	it('renders with md size (default)', () => {
		renderSpinner({ size: 'md' });

		const spinner = getSpinner();
		const classes = getSpinnerVariantClasses({ size: 'md' });
		expect(spinner).toHaveClass(classes);
	});

	it('renders with lg size', () => {
		renderSpinner({ size: 'lg' });

		const spinner = getSpinner();
		const classes = getSpinnerVariantClasses({ size: 'lg' });
		expect(spinner).toHaveClass(classes);
	});

	it('renders with custom numeric size', () => {
		const customSize = 32;
		renderSpinner({ size: customSize });

		const svg = getSpinnerSvg();
		expect(svg).toBeInTheDocument();
		// SVG should have width and height attributes for numeric size
		expect(svg).toHaveAttribute('width');
		expect(svg).toHaveAttribute('height');
	});

	it('applies correct size classes for each variant', () => {
		const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];

		for (const size of sizes) {
			const { unmount } = renderSpinner({ size });
			const spinner = getSpinner();
			const classes = getSpinnerVariantClasses({ size });
			expect(spinner).toHaveClass(classes);
			unmount();
		}
	});
});

describe('Spinner - Color', () => {
	it('renders with default color (currentColor)', () => {
		renderSpinner();

		const svg = getSpinnerSvg();
		expect(svg).toBeInTheDocument();
	});

	it('renders with custom color', () => {
		renderSpinner({ color: CUSTOM_COLOR });

		const svg = getSpinnerSvg();
		expect(svg).toBeInTheDocument();
		// Color is applied via SpinnerContent component
		// Check that SVG contains content elements
		expect(svg?.innerHTML).toBeTruthy();
	});
});

describe('Spinner - Animations', () => {
	it('has SVG with viewBox for proper scaling', () => {
		renderSpinner();

		const svg = getSpinnerSvg();
		expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
	});

	it('has SVG with xmlns attribute', () => {
		renderSpinner();

		const svg = getSpinnerSvg();
		expect(svg).toHaveAttribute('xmlns', 'http://www.w3.org/2000/svg');
	});

	it('has fill="none" for proper rendering', () => {
		renderSpinner();

		const svg = getSpinnerSvg();
		expect(svg).toHaveAttribute('fill', 'none');
	});

	it('has aria-hidden on SVG for screen readers', () => {
		renderSpinner();

		const svg = getSpinnerSvg();
		expect(svg).toHaveAttribute('aria-hidden', 'true');
	});
});

const ARIA_ROLE = ARIA_ROLES.STATUS;
const ARIA_LIVE_VALUE = ARIA_LIVE.POLITE;
const ARIA_LABEL_VALUE = ARIA_LABELS.LOADING;
const ARIA_LABEL_ATTR = 'aria-label';

describe('Spinner - Accessibility', () => {
	it('has correct role (status)', () => {
		renderSpinner();

		const spinner = getSpinner();
		expect(spinner).toHaveAttribute('role', ARIA_ROLE);
	});

	it('has aria-live="polite" attribute', () => {
		renderSpinner();

		const spinner = getSpinner();
		expect(spinner).toHaveAttribute('aria-live', ARIA_LIVE_VALUE);
	});

	it('has default aria-label', () => {
		renderSpinner();

		const spinner = getSpinner();
		expect(spinner).toHaveAttribute(ARIA_LABEL_ATTR, ARIA_LABEL_VALUE);
	});

	it('allows custom aria-label', () => {
		renderSpinner({ 'aria-label': CUSTOM_ARIA_LABEL });

		const spinner = getSpinner();
		expect(spinner).toHaveAttribute(ARIA_LABEL_ATTR, CUSTOM_ARIA_LABEL);
	});

	it('has accessible structure for screen readers', () => {
		renderSpinner();

		const spinner = getSpinner();
		expect(spinner).toHaveAttribute('role', ARIA_ROLE);
		expect(spinner).toHaveAttribute('aria-live', ARIA_LIVE_VALUE);
		expect(spinner).toHaveAttribute(ARIA_LABEL_ATTR, ARIA_LABEL_VALUE);
	});
});

describe('Spinner - SVG Props', () => {
	it('renders SVG with proper attributes', () => {
		renderSpinner();

		const svg = getSpinnerSvg();
		expect(svg).toBeInTheDocument();
		expect(svg).toHaveAttribute('viewBox');
	});

	it('filters out non-SVG props from SVG element', () => {
		renderSpinner({ size: 'md', color: CUSTOM_COLOR });

		const svg = getSpinnerSvg();
		// Size and color should not be direct attributes on SVG
		expect(svg).not.toHaveAttribute('size');
		expect(svg).not.toHaveAttribute('color');
	});
});

describe('Spinner - Edge Cases', () => {
	it('handles missing size prop gracefully', () => {
		renderSpinner({});

		const spinner = getSpinner();
		expect(spinner).toBeInTheDocument();
	});

	it('handles missing color prop gracefully', () => {
		renderSpinner({});

		const spinner = getSpinner();
		expect(spinner).toBeInTheDocument();
	});

	it('handles very large numeric size', () => {
		renderSpinner({ size: 1000 });

		const svg = getSpinnerSvg();
		expect(svg).toBeInTheDocument();
	});

	it('handles very small numeric size', () => {
		renderSpinner({ size: 1 });

		const svg = getSpinnerSvg();
		expect(svg).toBeInTheDocument();
	});
});
