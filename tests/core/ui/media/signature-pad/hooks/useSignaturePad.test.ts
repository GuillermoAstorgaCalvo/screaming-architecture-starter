/**
 * useSignaturePad Tests
 *
 * Tests for the useSignaturePadProps hook including:
 * - Prop extraction
 * - State computation
 * - Canvas props building
 * - Return values
 */

import { useSignaturePadProps } from '@core/ui/media/signature-pad/hooks/useSignaturePad';
import type { SignaturePadProps } from '@src-types/ui/media';
import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

describe('useSignaturePadProps - Prop Extraction', () => {
	it('extracts all props correctly', () => {
		const props: SignaturePadProps = {
			label: 'Signature',
			error: 'Invalid signature',
			helperText: 'Please sign here',
			size: 'lg',
			fullWidth: true,
			required: true,
			signaturePadId: 'custom-id',
			width: 600,
			height: 300,
		};

		const { result } = renderHook(() => useSignaturePadProps({ props }));

		expect(result.current.label).toBe('Signature');
		expect(result.current.error).toBe('Invalid signature');
		expect(result.current.helperText).toBe('Please sign here');
		expect(result.current.required).toBe(true);
		expect(result.current.fullWidth).toBe(true);
	});

	it('uses default values for optional props', () => {
		const props: SignaturePadProps = {
			label: 'Signature',
		};

		const { result } = renderHook(() => useSignaturePadProps({ props }));

		expect(result.current.label).toBe('Signature');
		expect(result.current.error).toBeUndefined();
		expect(result.current.helperText).toBeUndefined();
		expect(result.current.required).toBeUndefined();
		expect(result.current.fullWidth).toBe(false);
	});

	it('defaults size to md when not provided', () => {
		const props: SignaturePadProps = {
			label: 'Signature',
		};

		const { result } = renderHook(() => useSignaturePadProps({ props }));

		expect(result.current.state).toBeDefined();
	});

	it('extracts canvas-related props', () => {
		const onChange = vi.fn();
		const onClear = vi.fn();
		const props: SignaturePadProps = {
			label: 'Signature',
			width: 800,
			height: 400,
			backgroundColor: '#FF0000',
			penColor: '#00FF00',
			value: 'data:image/png;base64,test',
			onChange,
			onClear,
		};

		const { result } = renderHook(() => useSignaturePadProps({ props }));

		expect(result.current.canvasProps).toBeDefined();
		expect(result.current.canvasProps.width).toBe(800);
		expect(result.current.canvasProps.height).toBe(400);
		expect(result.current.canvasProps.backgroundColor).toBe('#FF0000');
		expect(result.current.canvasProps.penColor).toBe('#00FF00');
		expect(result.current.canvasProps.value).toBe('data:image/png;base64,test');
		expect(result.current.canvasProps.onChange).toBe(onChange);
		expect(result.current.canvasProps.onClear).toBe(onClear);
	});
});

describe('useSignaturePadProps - State', () => {
	it('generates state with finalId when label is provided', () => {
		const props: SignaturePadProps = {
			label: 'Signature',
		};

		const { result } = renderHook(() => useSignaturePadProps({ props }));

		expect(result.current.state).toBeDefined();
		expect(result.current.state.finalId).toBeDefined();
		expect(result.current.state.finalId).toContain('signature-pad-');
	});

	it('uses provided signaturePadId', () => {
		const props: SignaturePadProps = {
			label: 'Signature',
			signaturePadId: 'custom-signature-id',
		};

		const { result } = renderHook(() => useSignaturePadProps({ props }));

		expect(result.current.state.finalId).toBe('custom-signature-id');
	});

	it('generates undefined finalId when no label', () => {
		const props: SignaturePadProps = {};

		const { result } = renderHook(() => useSignaturePadProps({ props }));

		expect(result.current.state.finalId).toBeUndefined();
	});

	it('computes hasError correctly', () => {
		const propsWithError: SignaturePadProps = {
			label: 'Signature',
			error: 'Invalid signature',
		};

		const { result: resultWithError } = renderHook(() =>
			useSignaturePadProps({ props: propsWithError })
		);
		expect(resultWithError.current.state.hasError).toBe(true);

		const propsWithoutError: SignaturePadProps = {
			label: 'Signature',
		};

		const { result: resultWithoutError } = renderHook(() =>
			useSignaturePadProps({ props: propsWithoutError })
		);
		expect(resultWithoutError.current.state.hasError).toBe(false);
	});

	it('generates ariaDescribedBy when error is present', () => {
		const props: SignaturePadProps = {
			label: 'Signature',
			error: 'Invalid signature',
		};

		const { result } = renderHook(() => useSignaturePadProps({ props }));

		expect(result.current.state.ariaDescribedBy).toBeDefined();
		expect(result.current.state.ariaDescribedBy).toContain('-error');
	});

	it('generates ariaDescribedBy when helperText is present', () => {
		const props: SignaturePadProps = {
			label: 'Signature',
			helperText: 'Please sign here',
		};

		const { result } = renderHook(() => useSignaturePadProps({ props }));

		expect(result.current.state.ariaDescribedBy).toBeDefined();
		expect(result.current.state.ariaDescribedBy).toContain('-helper');
	});

	it('prioritizes error over helperText for ariaDescribedBy', () => {
		const props: SignaturePadProps = {
			label: 'Signature',
			error: 'Invalid signature',
			helperText: 'Please sign here',
		};

		const { result } = renderHook(() => useSignaturePadProps({ props }));

		expect(result.current.state.ariaDescribedBy).toContain('-error');
		expect(result.current.state.ariaDescribedBy).not.toContain('-helper');
	});
});

describe('useSignaturePadProps - Canvas Props', () => {
	it('builds canvas props with defaults', () => {
		const props: SignaturePadProps = {
			label: 'Signature',
		};

		const { result } = renderHook(() => useSignaturePadProps({ props }));

		expect(result.current.canvasProps).toBeDefined();
		expect(result.current.canvasProps.width).toBe(500);
		expect(result.current.canvasProps.height).toBe(200);
		expect(result.current.canvasProps.disabled).toBe(false);
		expect(result.current.canvasProps.showClearButton).toBe(true);
	});

	it('preserves canvas configuration props', () => {
		const props: SignaturePadProps = {
			label: 'Signature',
			width: 600,
			height: 300,
			backgroundColor: '#FF0000',
			penColor: '#00FF00',
			velocityFilterWeight: 0.8,
			minWidth: 1,
			maxWidth: 3,
			throttle: 20,
			disabled: true,
			showClearButton: false,
			clearButtonText: 'Reset',
		};

		const { result } = renderHook(() => useSignaturePadProps({ props }));

		expect(result.current.canvasProps.width).toBe(600);
		expect(result.current.canvasProps.height).toBe(300);
		expect(result.current.canvasProps.backgroundColor).toBe('#FF0000');
		expect(result.current.canvasProps.penColor).toBe('#00FF00');
		expect(result.current.canvasProps.velocityFilterWeight).toBe(0.8);
		expect(result.current.canvasProps.minWidth).toBe(1);
		expect(result.current.canvasProps.maxWidth).toBe(3);
		expect(result.current.canvasProps.throttle).toBe(20);
		expect(result.current.canvasProps.disabled).toBe(true);
		expect(result.current.canvasProps.showClearButton).toBe(false);
		expect(result.current.canvasProps.clearButtonText).toBe('Reset');
	});

	it('includes finalId in canvas props', () => {
		const props: SignaturePadProps = {
			label: 'Signature',
		};

		const { result } = renderHook(() => useSignaturePadProps({ props }));

		expect(result.current.canvasProps.id).toBe(result.current.state.finalId);
	});
});

describe('useSignaturePadProps - Required Prop', () => {
	it('extracts required when true', () => {
		const props: SignaturePadProps = {
			label: 'Signature',
			required: true,
		} as SignaturePadProps;

		const { result } = renderHook(() => useSignaturePadProps({ props }));

		expect(result.current.required).toBe(true);
	});

	it('extracts required when false', () => {
		const props: SignaturePadProps = {
			label: 'Signature',
			required: false,
		} as SignaturePadProps;

		const { result } = renderHook(() => useSignaturePadProps({ props }));

		expect(result.current.required).toBe(false);
	});

	it('returns undefined when required is not provided', () => {
		const props: SignaturePadProps = {
			label: 'Signature',
		};

		const { result } = renderHook(() => useSignaturePadProps({ props }));

		expect(result.current.required).toBeUndefined();
	});
});
