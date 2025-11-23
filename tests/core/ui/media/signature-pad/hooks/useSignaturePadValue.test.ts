/**
 * useSignaturePadValue Tests
 *
 * Tests for the useSignaturePadValue hook including:
 * - Value synchronization
 * - DefaultValue handling
 * - Controlled vs uncontrolled modes
 * - Null value handling
 */

import { useSignaturePadValue } from '@core/ui/media/signature-pad/hooks/useSignaturePadValue';
import { renderHook } from '@testing-library/react';
import { createRef } from 'react';
import type SignatureCanvas from 'react-signature-canvas';
import { describe, expect, it, vi } from 'vitest';

describe('useSignaturePadValue - Controlled Mode', () => {
	it('clears canvas when value is null', () => {
		const canvasRef = createRef<SignatureCanvas | null>();
		const mockClear = vi.fn();
		const mockFromDataURL = vi.fn();

		// Mock the canvas
		canvasRef.current = {
			clear: mockClear,
			fromDataURL: mockFromDataURL,
		} as unknown as SignatureCanvas;

		renderHook(() =>
			useSignaturePadValue({
				canvasRef,
				value: null,
				defaultValue: undefined,
			})
		);

		expect(mockClear).toHaveBeenCalled();
		expect(mockFromDataURL).not.toHaveBeenCalled();
	});

	it('loads data URL when value is provided', () => {
		const canvasRef = createRef<SignatureCanvas | null>();
		const mockClear = vi.fn();
		const mockFromDataURL = vi.fn();
		const dataUrl = 'data:image/png;base64,test123';

		canvasRef.current = {
			clear: mockClear,
			fromDataURL: mockFromDataURL,
		} as unknown as SignatureCanvas;

		renderHook(() =>
			useSignaturePadValue({
				canvasRef,
				value: dataUrl,
				defaultValue: undefined,
			})
		);

		expect(mockFromDataURL).toHaveBeenCalledWith(dataUrl);
		expect(mockClear).not.toHaveBeenCalled();
	});

	it('updates when value changes', () => {
		const canvasRef = createRef<SignatureCanvas | null>();
		const mockClear = vi.fn();
		const mockFromDataURL = vi.fn();

		canvasRef.current = {
			clear: mockClear,
			fromDataURL: mockFromDataURL,
		} as unknown as SignatureCanvas;

		const { rerender } = renderHook(
			({ value }) =>
				useSignaturePadValue({
					canvasRef,
					value,
					defaultValue: undefined,
				}),
			{
				initialProps: { value: 'data:image/png;base64,first' },
			}
		);

		expect(mockFromDataURL).toHaveBeenCalledWith('data:image/png;base64,first');
		expect(mockFromDataURL).toHaveBeenCalledTimes(1);

		rerender({ value: 'data:image/png;base64,second' });

		expect(mockFromDataURL).toHaveBeenCalledWith('data:image/png;base64,second');
		expect(mockFromDataURL).toHaveBeenCalledTimes(2);
	});

	it('does nothing when value is undefined', () => {
		const canvasRef = createRef<SignatureCanvas | null>();
		const mockClear = vi.fn();
		const mockFromDataURL = vi.fn();

		canvasRef.current = {
			clear: mockClear,
			fromDataURL: mockFromDataURL,
		} as unknown as SignatureCanvas;

		renderHook(() =>
			useSignaturePadValue({
				canvasRef,
				value: undefined,
				defaultValue: undefined,
			})
		);

		expect(mockClear).not.toHaveBeenCalled();
		expect(mockFromDataURL).not.toHaveBeenCalled();
	});

	it('handles null value change', () => {
		const canvasRef = createRef<SignatureCanvas | null>();
		const mockClear = vi.fn();
		const mockFromDataURL = vi.fn();

		canvasRef.current = {
			clear: mockClear,
			fromDataURL: mockFromDataURL,
		} as unknown as SignatureCanvas;

		const { rerender } = renderHook(
			({ value }: { value: string | null | undefined }) =>
				useSignaturePadValue({
					canvasRef,
					value,
					defaultValue: undefined,
				}),
			{
				initialProps: { value: 'data:image/png;base64,test' as string | null },
			}
		);

		expect(mockFromDataURL).toHaveBeenCalledTimes(1);

		rerender({ value: null as string | null });

		expect(mockClear).toHaveBeenCalled();
		expect(mockFromDataURL).toHaveBeenCalledTimes(1);
	});
});

describe('useSignaturePadValue - Uncontrolled Mode', () => {
	it('loads defaultValue when value is undefined', () => {
		const canvasRef = createRef<SignatureCanvas | null>();
		const mockClear = vi.fn();
		const mockFromDataURL = vi.fn();
		const dataUrl = 'data:image/png;base64,default123';

		canvasRef.current = {
			clear: mockClear,
			fromDataURL: mockFromDataURL,
		} as unknown as SignatureCanvas;

		renderHook(() =>
			useSignaturePadValue({
				canvasRef,
				value: undefined,
				defaultValue: dataUrl,
			})
		);

		expect(mockFromDataURL).toHaveBeenCalledWith(dataUrl);
		expect(mockClear).not.toHaveBeenCalled();
	});

	it('clears canvas when defaultValue is null', () => {
		const canvasRef = createRef<SignatureCanvas | null>();
		const mockClear = vi.fn();
		const mockFromDataURL = vi.fn();

		canvasRef.current = {
			clear: mockClear,
			fromDataURL: mockFromDataURL,
		} as unknown as SignatureCanvas;

		renderHook(() =>
			useSignaturePadValue({
				canvasRef,
				value: undefined,
				defaultValue: null,
			})
		);

		expect(mockClear).toHaveBeenCalled();
		expect(mockFromDataURL).not.toHaveBeenCalled();
	});

	it('ignores defaultValue when value is defined', () => {
		const canvasRef = createRef<SignatureCanvas | null>();
		const mockClear = vi.fn();
		const mockFromDataURL = vi.fn();

		canvasRef.current = {
			clear: mockClear,
			fromDataURL: mockFromDataURL,
		} as unknown as SignatureCanvas;

		renderHook(() =>
			useSignaturePadValue({
				canvasRef,
				value: 'data:image/png;base64,controlled',
				defaultValue: 'data:image/png;base64,default',
			})
		);

		expect(mockFromDataURL).toHaveBeenCalledWith('data:image/png;base64,controlled');
		expect(mockFromDataURL).toHaveBeenCalledTimes(1);
	});

	it('does nothing when both value and defaultValue are undefined', () => {
		const canvasRef = createRef<SignatureCanvas | null>();
		const mockClear = vi.fn();
		const mockFromDataURL = vi.fn();

		canvasRef.current = {
			clear: mockClear,
			fromDataURL: mockFromDataURL,
		} as unknown as SignatureCanvas;

		renderHook(() =>
			useSignaturePadValue({
				canvasRef,
				value: undefined,
				defaultValue: undefined,
			})
		);

		expect(mockClear).not.toHaveBeenCalled();
		expect(mockFromDataURL).not.toHaveBeenCalled();
	});
});

describe('useSignaturePadValue - Edge Cases', () => {
	it('handles null canvas ref gracefully', () => {
		const canvasRef = createRef<SignatureCanvas | null>();

		expect(() => {
			renderHook(() =>
				useSignaturePadValue({
					canvasRef,
					value: 'data:image/png;base64,test',
					defaultValue: undefined,
				})
			);
		}).not.toThrow();
	});

	it('updates defaultValue when value changes from undefined to defined', () => {
		const canvasRef = createRef<SignatureCanvas | null>();
		const mockClear = vi.fn();
		const mockFromDataURL = vi.fn();

		canvasRef.current = {
			clear: mockClear,
			fromDataURL: mockFromDataURL,
		} as unknown as SignatureCanvas;

		const { rerender } = renderHook(
			({ value, defaultValue }: { value?: string | null; defaultValue?: string | null }) =>
				useSignaturePadValue({
					canvasRef,
					value,
					defaultValue,
				}),
			{
				initialProps: {
					defaultValue: 'data:image/png;base64,default',
				} as { value?: string | null; defaultValue?: string | null },
			}
		);

		expect(mockFromDataURL).toHaveBeenCalledWith('data:image/png;base64,default');

		rerender({
			value: 'data:image/png;base64,controlled',
			defaultValue: 'data:image/png;base64,default',
		});

		expect(mockFromDataURL).toHaveBeenCalledWith('data:image/png;base64,controlled');
		expect(mockFromDataURL).toHaveBeenCalledTimes(2);
	});
});
