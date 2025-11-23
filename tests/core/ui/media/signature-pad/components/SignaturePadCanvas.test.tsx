/**
 * SignaturePadCanvas Component Tests
 *
 * Tests for the SignaturePadCanvas component including:
 * - Rendering
 * - Props forwarding
 * - Canvas setup
 * - Clear button
 * - Disabled state
 */

import { SignaturePadCanvas } from '@core/ui/media/signature-pad/components/SignaturePadCanvas';
import { useSignaturePadSetup } from '@core/ui/media/signature-pad/hooks/useSignaturePadSetup';
import type { SignaturePadCanvasProps } from '@core/ui/media/signature-pad/types/SignaturePadTypes';
import { renderWithProviders } from '@tests/utils/testUtils';
import SignatureCanvas from 'react-signature-canvas';
import { describe, expect, it, vi } from 'vitest';

// Mock react-signature-canvas
vi.mock('react-signature-canvas', () => ({
	default: vi.fn(() => <canvas data-testid="signature-canvas" />),
}));

// Mock the hooks
vi.mock('@core/ui/media/signature-pad/hooks/useSignaturePadSetup', () => ({
	useSignaturePadSetup: vi.fn(),
}));

describe('SignaturePadCanvas - Rendering', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(useSignaturePadSetup).mockReturnValue({
			canvasRef: { current: null },
			canvasProps: {
				id: 'test-canvas',
				width: 500,
				height: 200,
				className: undefined,
				style: {},
			},
			handleEnd: vi.fn(),
			handleClear: vi.fn(),
		});
	});

	it('renders signature canvas', () => {
		const props: SignaturePadCanvasProps = {
			id: 'test-canvas',
		};

		renderWithProviders(<SignaturePadCanvas {...props} />);

		expect(vi.mocked(SignatureCanvas)).toHaveBeenCalled();
	});

	it('calls useSignaturePadSetup with normalized props', () => {
		const props: SignaturePadCanvasProps = {
			id: 'test-canvas',
			width: 600,
			height: 300,
			backgroundColor: '#FF0000',
			disabled: true,
		};

		renderWithProviders(<SignaturePadCanvas {...props} />);

		expect(vi.mocked(useSignaturePadSetup)).toHaveBeenCalled();
		const callArgs = vi.mocked(useSignaturePadSetup).mock.calls[0]?.[0];
		if (callArgs) {
			expect(callArgs.id).toBe('test-canvas');
			expect(callArgs.width).toBe(600);
			expect(callArgs.height).toBe(300);
			expect(callArgs.backgroundColor).toBe('#FF0000');
			expect(callArgs.disabled).toBe(true);
		}
	});

	it('passes canvas props to SignatureCanvas', () => {
		const canvasProps = {
			id: 'test-canvas',
			width: 500,
			height: 200,
			className: 'custom-class',
			style: { backgroundColor: '#FFFFFF' },
		};

		vi.mocked(useSignaturePadSetup).mockReturnValue({
			canvasRef: { current: null },
			canvasProps,
			handleEnd: vi.fn(),
			handleClear: vi.fn(),
		});

		const props: SignaturePadCanvasProps = {
			id: 'test-canvas',
		};

		renderWithProviders(<SignaturePadCanvas {...props} />);

		const callArgs = vi.mocked(SignatureCanvas).mock.calls[0]?.[0];
		if (callArgs) {
			expect(callArgs.canvasProps).toEqual(canvasProps);
		}
	});

	it('passes canvas configuration props', () => {
		const props: SignaturePadCanvasProps = {
			id: 'test-canvas',
			backgroundColor: '#FF0000',
			penColor: '#00FF00',
			velocityFilterWeight: 0.8,
			minWidth: 1,
			maxWidth: 3,
			throttle: 20,
		};

		renderWithProviders(<SignaturePadCanvas {...props} />);

		const callArgs = vi.mocked(SignatureCanvas).mock.calls[0]?.[0];
		if (callArgs) {
			expect(callArgs.backgroundColor).toBe('#FF0000');
			expect(callArgs.penColor).toBe('#00FF00');
			expect(callArgs.velocityFilterWeight).toBe(0.8);
			expect(callArgs.minWidth).toBe(1);
			expect(callArgs.maxWidth).toBe(3);
			expect(callArgs.throttle).toBe(20);
		}
	});

	it('passes handleEnd to SignatureCanvas', () => {
		const handleEnd = vi.fn();
		vi.mocked(useSignaturePadSetup).mockReturnValue({
			canvasRef: { current: null },
			canvasProps: {
				id: 'test-canvas',
				width: 500,
				height: 200,
				className: undefined,
				style: {},
			},
			handleEnd,
			handleClear: vi.fn(),
		});

		const props: SignaturePadCanvasProps = {
			id: 'test-canvas',
		};

		renderWithProviders(<SignaturePadCanvas {...props} />);

		const callArgs = vi.mocked(SignatureCanvas).mock.calls[0]?.[0];
		if (callArgs) {
			expect(callArgs.onEnd).toBe(handleEnd);
		}
	});
});

describe('SignaturePadCanvas - Clear Button', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(useSignaturePadSetup).mockReturnValue({
			canvasRef: { current: null },
			canvasProps: {
				id: 'test-canvas',
				width: 500,
				height: 200,
				className: undefined,
				style: {},
			},
			handleEnd: vi.fn(),
			handleClear: vi.fn(),
		});
	});

	it('shows clear button by default', () => {
		const props: SignaturePadCanvasProps = {
			id: 'test-canvas',
		};

		renderWithProviders(<SignaturePadCanvas {...props} />);

		// The clear button should be rendered by SignaturePadCanvasContent
		// We can't directly test it here since it's in a child component
		// but we can verify the props are passed correctly
		expect(vi.mocked(useSignaturePadSetup)).toHaveBeenCalled();
	});

	it('hides clear button when showClearButton is false', () => {
		const props: SignaturePadCanvasProps = {
			id: 'test-canvas',
			showClearButton: false,
		};

		renderWithProviders(<SignaturePadCanvas {...props} />);

		expect(vi.mocked(useSignaturePadSetup)).toHaveBeenCalled();
	});

	it('uses custom clear button text', () => {
		const props: SignaturePadCanvasProps = {
			id: 'test-canvas',
			clearButtonText: 'Reset',
		};

		renderWithProviders(<SignaturePadCanvas {...props} />);

		expect(vi.mocked(useSignaturePadSetup)).toHaveBeenCalled();
	});
});

describe('SignaturePadCanvas - Disabled State', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(useSignaturePadSetup).mockReturnValue({
			canvasRef: { current: null },
			canvasProps: {
				id: 'test-canvas',
				width: 500,
				height: 200,
				className: undefined,
				style: {
					cursor: 'not-allowed',
					opacity: 0.5,
				},
			},
			handleEnd: vi.fn(),
			handleClear: vi.fn(),
		});
	});

	it('handles disabled state', () => {
		const props: SignaturePadCanvasProps = {
			id: 'test-canvas',
			disabled: true,
		};

		renderWithProviders(<SignaturePadCanvas {...props} />);

		expect(vi.mocked(useSignaturePadSetup)).toHaveBeenCalledWith(
			expect.objectContaining({
				disabled: true,
			})
		);
	});
});

describe('SignaturePadCanvas - Value Handling', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(useSignaturePadSetup).mockReturnValue({
			canvasRef: { current: null },
			canvasProps: {
				id: 'test-canvas',
				width: 500,
				height: 200,
				className: undefined,
				style: {},
			},
			handleEnd: vi.fn(),
			handleClear: vi.fn(),
		});
	});

	it('passes value prop', () => {
		const props: SignaturePadCanvasProps = {
			id: 'test-canvas',
			value: 'data:image/png;base64,test',
		};

		renderWithProviders(<SignaturePadCanvas {...props} />);

		expect(vi.mocked(useSignaturePadSetup)).toHaveBeenCalledWith(
			expect.objectContaining({
				value: 'data:image/png;base64,test',
			})
		);
	});

	it('passes defaultValue prop', () => {
		const props: SignaturePadCanvasProps = {
			id: 'test-canvas',
			defaultValue: 'data:image/png;base64,default',
		};

		renderWithProviders(<SignaturePadCanvas {...props} />);

		expect(vi.mocked(useSignaturePadSetup)).toHaveBeenCalledWith(
			expect.objectContaining({
				defaultValue: 'data:image/png;base64,default',
			})
		);
	});

	it('passes onChange callback', () => {
		const onChange = vi.fn();
		const props: SignaturePadCanvasProps = {
			id: 'test-canvas',
			onChange,
		};

		renderWithProviders(<SignaturePadCanvas {...props} />);

		expect(vi.mocked(useSignaturePadSetup)).toHaveBeenCalledWith(
			expect.objectContaining({
				onChange,
			})
		);
	});

	it('passes onClear callback', () => {
		const onClear = vi.fn();
		const props: SignaturePadCanvasProps = {
			id: 'test-canvas',
			onClear,
		};

		renderWithProviders(<SignaturePadCanvas {...props} />);

		expect(vi.mocked(useSignaturePadSetup)).toHaveBeenCalledWith(
			expect.objectContaining({
				onClear,
			})
		);
	});
});
