/**
 * RangeSliderMessages Component Tests
 *
 * Tests for the RangeSliderMessages component including:
 * - Rendering
 * - Error message display
 * - Helper text display
 * - Conditional rendering
 */

import { RangeSliderMessages } from '@core/ui/forms/range-slider/components/RangeSliderMessages';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('RangeSliderMessages - Rendering', () => {
	it('returns null when no error or helper text', () => {
		const { container } = render(
			<RangeSliderMessages rangeSliderId="test-id" error={undefined} helperText={undefined} />
		);

		expect(container.firstChild).toBeNull();
	});

	it('renders error message', () => {
		render(<RangeSliderMessages rangeSliderId="test-id" error="Invalid range" />);

		const error = screen.getByText('Invalid range');
		expect(error).toBeInTheDocument();
		expect(error).toHaveAttribute('id', 'test-id-error');
	});

	it('renders helper text', () => {
		render(<RangeSliderMessages rangeSliderId="test-id" helperText="Select a range" />);

		const helper = screen.getByText('Select a range');
		expect(helper).toBeInTheDocument();
		expect(helper).toHaveAttribute('id', 'test-id-helper');
	});

	it('renders both error and helper text', () => {
		render(
			<RangeSliderMessages
				rangeSliderId="test-id"
				error="Invalid range"
				helperText="Select a range"
			/>
		);

		expect(screen.getByText('Invalid range')).toBeInTheDocument();
		const helper = screen.getByText('Select a range');
		expect(helper).toBeInTheDocument();
		// Helper text should be visually hidden when error exists
		expect(helper).toHaveClass('sr-only');
	});

	it('does not hide helper text when no error', () => {
		render(<RangeSliderMessages rangeSliderId="test-id" helperText="Select a range" />);

		const helper = screen.getByText('Select a range');
		expect(helper).toBeInTheDocument();
		expect(helper).not.toHaveClass('sr-only');
	});
});

describe('RangeSliderMessages - ID Generation', () => {
	it('generates error ID from rangeSliderId', () => {
		render(<RangeSliderMessages rangeSliderId="custom-id" error="Error message" />);

		const error = screen.getByText('Error message');
		expect(error).toHaveAttribute('id', 'custom-id-error');
	});

	it('generates helper ID from rangeSliderId', () => {
		render(<RangeSliderMessages rangeSliderId="custom-id" helperText="Helper text" />);

		const helper = screen.getByText('Helper text');
		expect(helper).toHaveAttribute('id', 'custom-id-helper');
	});
});

describe('RangeSliderMessages - Component Integration', () => {
	it('renders ErrorText component for errors', () => {
		render(<RangeSliderMessages rangeSliderId="test-id" error="Invalid range" />);

		const error = screen.getByText('Invalid range');
		// ErrorText should render the error
		expect(error).toBeInTheDocument();
	});

	it('renders HelperText component for helper text', () => {
		render(<RangeSliderMessages rangeSliderId="test-id" helperText="Select a range" />);

		const helper = screen.getByText('Select a range');
		// HelperText should render the helper text
		expect(helper).toBeInTheDocument();
	});
});
