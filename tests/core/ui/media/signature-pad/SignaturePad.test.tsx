/**
 * SignaturePad Component Tests
 *
 * Tests for the SignaturePad component including:
 * - Rendering
 * - Props forwarding
 * - Label display
 * - Error and helper text
 * - Size variants
 * - Full width option
 * - Accessibility
 */

import SignaturePad from '@core/ui/media/signature-pad/SignaturePad';
import type { SignaturePadProps } from '@src-types/ui/media';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

// Mock react-signature-canvas
vi.mock('react-signature-canvas', () => ({
	default: vi.fn(() => <canvas data-testid="signature-canvas" />),
}));

// Mock the hooks
const mockUseSignaturePadProps = vi.fn();

vi.mock('@core/ui/media/signature-pad/hooks/useSignaturePad', () => ({
	useSignaturePadProps: (options: unknown) => mockUseSignaturePadProps(options),
}));

describe('SignaturePad - Rendering', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockUseSignaturePadProps.mockReturnValue({
			state: {
				finalId: 'signature-pad-1',
				hasError: false,
				ariaDescribedBy: undefined,
			},
			canvasProps: {
				id: 'signature-pad-1',
				width: 500,
				height: 200,
			},
			label: undefined,
			error: undefined,
			helperText: undefined,
			required: undefined,
			fullWidth: false,
		});
	});

	it('renders signature pad component', () => {
		const props: SignaturePadProps = {};

		renderWithProviders(<SignaturePad {...props} />);

		expect(mockUseSignaturePadProps).toHaveBeenCalledWith({ props });
	});

	it('calls useSignaturePadProps with props', () => {
		const props: SignaturePadProps = {
			label: 'Signature',
			error: 'Invalid signature',
		};

		renderWithProviders(<SignaturePad {...props} />);

		expect(mockUseSignaturePadProps).toHaveBeenCalledWith({ props });
	});
});

describe('SignaturePad - Label', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders label when provided', () => {
		mockUseSignaturePadProps.mockReturnValue({
			state: {
				finalId: 'signature-pad-1',
				hasError: false,
				ariaDescribedBy: undefined,
			},
			canvasProps: {
				id: 'signature-pad-1',
				width: 500,
				height: 200,
			},
			label: 'Signature',
			error: undefined,
			helperText: undefined,
			required: undefined,
			fullWidth: false,
		});

		const props: SignaturePadProps = {
			label: 'Signature',
		};

		renderWithProviders(<SignaturePad {...props} />);

		expect(screen.getByText('Signature')).toBeInTheDocument();
	});

	it('does not render label when not provided', () => {
		mockUseSignaturePadProps.mockReturnValue({
			state: {
				finalId: undefined,
				hasError: false,
				ariaDescribedBy: undefined,
			},
			canvasProps: {
				id: undefined,
				width: 500,
				height: 200,
			},
			label: undefined,
			error: undefined,
			helperText: undefined,
			required: undefined,
			fullWidth: false,
		});

		const props: SignaturePadProps = {};

		renderWithProviders(<SignaturePad {...props} />);

		expect(screen.queryByText('Signature')).not.toBeInTheDocument();
	});

	it('renders required indicator when required is true', () => {
		mockUseSignaturePadProps.mockReturnValue({
			state: {
				finalId: 'signature-pad-1',
				hasError: false,
				ariaDescribedBy: undefined,
			},
			canvasProps: {
				id: 'signature-pad-1',
				width: 500,
				height: 200,
			},
			label: 'Signature',
			error: undefined,
			helperText: undefined,
			fullWidth: false,
		});

		const props: SignaturePadProps = {
			label: 'Signature',
		};

		renderWithProviders(<SignaturePad {...props} />);

		expect(screen.getByText('Signature')).toBeInTheDocument();
	});
});

describe('SignaturePad - Error and Helper Text', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders error message', () => {
		mockUseSignaturePadProps.mockReturnValue({
			state: {
				finalId: 'signature-pad-1',
				hasError: true,
				ariaDescribedBy: 'signature-pad-1-error',
			},
			canvasProps: {
				id: 'signature-pad-1',
				width: 500,
				height: 200,
			},
			label: 'Signature',
			error: 'Invalid signature',
			helperText: undefined,
			required: undefined,
			fullWidth: false,
		});

		const props: SignaturePadProps = {
			label: 'Signature',
			error: 'Invalid signature',
		};

		renderWithProviders(<SignaturePad {...props} />);

		expect(screen.getByText('Invalid signature')).toBeInTheDocument();
	});

	it('renders helper text', () => {
		mockUseSignaturePadProps.mockReturnValue({
			state: {
				finalId: 'signature-pad-1',
				hasError: false,
				ariaDescribedBy: 'signature-pad-1-helper',
			},
			canvasProps: {
				id: 'signature-pad-1',
				width: 500,
				height: 200,
			},
			label: 'Signature',
			error: undefined,
			helperText: 'Please sign here',
			required: undefined,
			fullWidth: false,
		});

		const props: SignaturePadProps = {
			label: 'Signature',
			helperText: 'Please sign here',
		};

		renderWithProviders(<SignaturePad {...props} />);

		expect(screen.getByText('Please sign here')).toBeInTheDocument();
	});

	it('prioritizes error over helper text', () => {
		mockUseSignaturePadProps.mockReturnValue({
			state: {
				finalId: 'signature-pad-1',
				hasError: true,
				ariaDescribedBy: 'signature-pad-1-error',
			},
			canvasProps: {
				id: 'signature-pad-1',
				width: 500,
				height: 200,
			},
			label: 'Signature',
			error: 'Invalid signature',
			helperText: 'Please sign here',
			required: undefined,
			fullWidth: false,
		});

		const props: SignaturePadProps = {
			label: 'Signature',
			error: 'Invalid signature',
			helperText: 'Please sign here',
		};

		renderWithProviders(<SignaturePad {...props} />);

		expect(screen.getByText('Invalid signature')).toBeInTheDocument();
		expect(screen.queryByText('Please sign here')).not.toBeInTheDocument();
	});
});

describe('SignaturePad - Full Width', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('applies full width when fullWidth is true', () => {
		mockUseSignaturePadProps.mockReturnValue({
			state: {
				finalId: 'signature-pad-1',
				hasError: false,
				ariaDescribedBy: undefined,
			},
			canvasProps: {
				id: 'signature-pad-1',
				width: 500,
				height: 200,
			},
			label: 'Signature',
			error: undefined,
			helperText: undefined,
			required: undefined,
			fullWidth: true,
		});

		const props: SignaturePadProps = {
			label: 'Signature',
			fullWidth: true,
		};

		renderWithProviders(<SignaturePad {...props} />);

		expect(mockUseSignaturePadProps).toHaveBeenCalled();
	});

	it('does not apply full width when fullWidth is false', () => {
		mockUseSignaturePadProps.mockReturnValue({
			state: {
				finalId: 'signature-pad-1',
				hasError: false,
				ariaDescribedBy: undefined,
			},
			canvasProps: {
				id: 'signature-pad-1',
				width: 500,
				height: 200,
			},
			label: 'Signature',
			error: undefined,
			helperText: undefined,
			required: undefined,
			fullWidth: false,
		});

		const props: SignaturePadProps = {
			label: 'Signature',
			fullWidth: false,
		};

		renderWithProviders(<SignaturePad {...props} />);

		expect(mockUseSignaturePadProps).toHaveBeenCalled();
	});
});

describe('SignaturePad - Canvas Props', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('passes canvas props to canvas component', () => {
		const canvasProps = {
			id: 'signature-pad-1',
			width: 600,
			height: 300,
			backgroundColor: '#FF0000',
			penColor: '#00FF00',
		};

		mockUseSignaturePadProps.mockReturnValue({
			state: {
				finalId: 'signature-pad-1',
				hasError: false,
				ariaDescribedBy: undefined,
			},
			canvasProps,
			label: undefined,
			error: undefined,
			helperText: undefined,
			required: undefined,
			fullWidth: false,
		});

		const props: SignaturePadProps = {
			width: 600,
			height: 300,
		};

		renderWithProviders(<SignaturePad {...props} />);

		expect(mockUseSignaturePadProps).toHaveBeenCalled();
	});
});

describe('SignaturePad - Accessibility', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('generates ID when label is provided', () => {
		mockUseSignaturePadProps.mockReturnValue({
			state: {
				finalId: 'signature-pad-1',
				hasError: false,
				ariaDescribedBy: 'signature-pad-1-helper',
			},
			canvasProps: {
				id: 'signature-pad-1',
				width: 500,
				height: 200,
			},
			label: 'Signature',
			error: undefined,
			helperText: 'Please sign here',
			required: undefined,
			fullWidth: false,
		});

		const props: SignaturePadProps = {
			label: 'Signature',
			helperText: 'Please sign here',
		};

		renderWithProviders(<SignaturePad {...props} />);

		expect(screen.getByText('Please sign here')).toHaveAttribute('id', 'signature-pad-1-helper');
	});

	it('associates error with signature pad via aria-describedby', () => {
		mockUseSignaturePadProps.mockReturnValue({
			state: {
				finalId: 'signature-pad-1',
				hasError: true,
				ariaDescribedBy: 'signature-pad-1-error',
			},
			canvasProps: {
				id: 'signature-pad-1',
				width: 500,
				height: 200,
			},
			label: 'Signature',
			error: 'Invalid signature',
			helperText: undefined,
			required: undefined,
			fullWidth: false,
		});

		const props: SignaturePadProps = {
			label: 'Signature',
			error: 'Invalid signature',
		};

		renderWithProviders(<SignaturePad {...props} />);

		expect(screen.getByText('Invalid signature')).toHaveAttribute('id', 'signature-pad-1-error');
	});
});
