/**
 * useSignaturePadHandlers Tests
 *
 * Tests for the useSignaturePadHandlers hook including:
 * - handleEnd callback
 * - handleClear callback
 * - Empty canvas handling
 * - Callback execution
 */

import { useSignaturePadHandlers } from '@core/ui/media/signature-pad/hooks/useSignaturePadHandlers';
import { act, renderHook } from '@testing-library/react';
import { createRef } from 'react';
import type SignatureCanvas from 'react-signature-canvas';
import { describe, expect, it, vi } from 'vitest';

describe('useSignaturePadHandlers - handleEnd', () => {
	it('calls onChange with data URL when canvas is not empty', () => {
		const canvasRef = createRef<SignatureCanvas | null>();
		const onChange = vi.fn();
		const dataUrl = 'data:image/png;base64,signature123';

		canvasRef.current = {
			isEmpty: vi.fn(() => false),
			toDataURL: vi.fn(() => dataUrl),
		} as unknown as SignatureCanvas;

		const { result } = renderHook(() =>
			useSignaturePadHandlers({
				canvasRef,
				onChange,
				onClear: undefined,
			})
		);

		act(() => {
			result.current.handleEnd();
		});

		expect(onChange).toHaveBeenCalledWith(dataUrl);
		expect(onChange).toHaveBeenCalledTimes(1);
	});

	it('calls onChange with null when canvas is empty', () => {
		const canvasRef = createRef<SignatureCanvas | null>();
		const onChange = vi.fn();

		canvasRef.current = {
			isEmpty: vi.fn(() => true),
			toDataURL: vi.fn(),
		} as unknown as SignatureCanvas;

		const { result } = renderHook(() =>
			useSignaturePadHandlers({
				canvasRef,
				onChange,
				onClear: undefined,
			})
		);

		act(() => {
			result.current.handleEnd();
		});

		expect(onChange).toHaveBeenCalledWith(null);
		expect(onChange).toHaveBeenCalledTimes(1);
	});

	it('does nothing when onChange is not provided', () => {
		const canvasRef = createRef<SignatureCanvas | null>();

		canvasRef.current = {
			isEmpty: vi.fn(() => false),
			toDataURL: vi.fn(() => 'data:image/png;base64,test'),
		} as unknown as SignatureCanvas;

		const { result } = renderHook(() =>
			useSignaturePadHandlers({
				canvasRef,
				onChange: undefined,
				onClear: undefined,
			})
		);

		expect(() => {
			act(() => {
				result.current.handleEnd();
			});
		}).not.toThrow();
	});

	it('does nothing when canvas ref is null', () => {
		const canvasRef = createRef<SignatureCanvas | null>();
		const onChange = vi.fn();

		const { result } = renderHook(() =>
			useSignaturePadHandlers({
				canvasRef,
				onChange,
				onClear: undefined,
			})
		);

		act(() => {
			result.current.handleEnd();
		});

		expect(onChange).not.toHaveBeenCalled();
	});
});

describe('useSignaturePadHandlers - handleClear', () => {
	it('clears canvas and calls onChange with null', () => {
		const canvasRef = createRef<SignatureCanvas | null>();
		const onChange = vi.fn();
		const mockClear = vi.fn();

		canvasRef.current = {
			clear: mockClear,
		} as unknown as SignatureCanvas;

		const { result } = renderHook(() =>
			useSignaturePadHandlers({
				canvasRef,
				onChange,
				onClear: undefined,
			})
		);

		act(() => {
			result.current.handleClear();
		});

		expect(mockClear).toHaveBeenCalled();
		expect(onChange).toHaveBeenCalledWith(null);
		expect(onChange).toHaveBeenCalledTimes(1);
	});

	it('calls onClear callback when provided', () => {
		const canvasRef = createRef<SignatureCanvas | null>();
		const onChange = vi.fn();
		const onClear = vi.fn();
		const mockClear = vi.fn();

		canvasRef.current = {
			clear: mockClear,
		} as unknown as SignatureCanvas;

		const { result } = renderHook(() =>
			useSignaturePadHandlers({
				canvasRef,
				onChange,
				onClear,
			})
		);

		act(() => {
			result.current.handleClear();
		});

		expect(mockClear).toHaveBeenCalled();
		expect(onChange).toHaveBeenCalledWith(null);
		expect(onClear).toHaveBeenCalled();
		expect(onClear).toHaveBeenCalledTimes(1);
	});

	it('does not call onChange when onChange is not provided', () => {
		const canvasRef = createRef<SignatureCanvas | null>();
		const onClear = vi.fn();
		const mockClear = vi.fn();

		canvasRef.current = {
			clear: mockClear,
		} as unknown as SignatureCanvas;

		const { result } = renderHook(() =>
			useSignaturePadHandlers({
				canvasRef,
				onChange: undefined,
				onClear,
			})
		);

		act(() => {
			result.current.handleClear();
		});

		expect(mockClear).toHaveBeenCalled();
		expect(onClear).toHaveBeenCalled();
	});

	it('does not call onClear when onClear is not provided', () => {
		const canvasRef = createRef<SignatureCanvas | null>();
		const onChange = vi.fn();
		const mockClear = vi.fn();

		canvasRef.current = {
			clear: mockClear,
		} as unknown as SignatureCanvas;

		const { result } = renderHook(() =>
			useSignaturePadHandlers({
				canvasRef,
				onChange,
				onClear: undefined,
			})
		);

		act(() => {
			result.current.handleClear();
		});

		expect(mockClear).toHaveBeenCalled();
		expect(onChange).toHaveBeenCalledWith(null);
	});

	it('does nothing when canvas ref is null', () => {
		const canvasRef = createRef<SignatureCanvas | null>();
		const onChange = vi.fn();
		const onClear = vi.fn();

		const { result } = renderHook(() =>
			useSignaturePadHandlers({
				canvasRef,
				onChange,
				onClear,
			})
		);

		act(() => {
			result.current.handleClear();
		});

		expect(onChange).not.toHaveBeenCalled();
		expect(onClear).not.toHaveBeenCalled();
	});
});

describe('useSignaturePadHandlers - Integration', () => {
	it('handles multiple handleEnd calls', () => {
		const canvasRef = createRef<SignatureCanvas | null>();
		const onChange = vi.fn();
		let isEmptyCount = 0;

		canvasRef.current = {
			isEmpty: vi.fn(() => {
				isEmptyCount++;
				return isEmptyCount === 1; // First call returns true, second false
			}),
			toDataURL: vi.fn(() => 'data:image/png;base64,test'),
		} as unknown as SignatureCanvas;

		const { result } = renderHook(() =>
			useSignaturePadHandlers({
				canvasRef,
				onChange,
				onClear: undefined,
			})
		);

		act(() => {
			result.current.handleEnd();
		});

		expect(onChange).toHaveBeenCalledWith(null);

		act(() => {
			result.current.handleEnd();
		});

		expect(onChange).toHaveBeenCalledWith('data:image/png;base64,test');
		expect(onChange).toHaveBeenCalledTimes(2);
	});

	it('handles clear then end sequence', () => {
		const canvasRef = createRef<SignatureCanvas | null>();
		const onChange = vi.fn();
		const mockClear = vi.fn();

		canvasRef.current = {
			clear: mockClear,
			isEmpty: vi.fn(() => true), // After clear, canvas is empty
			toDataURL: vi.fn(),
		} as unknown as SignatureCanvas;

		const { result } = renderHook(() =>
			useSignaturePadHandlers({
				canvasRef,
				onChange,
				onClear: undefined,
			})
		);

		act(() => {
			result.current.handleClear();
		});

		expect(onChange).toHaveBeenCalledWith(null);

		act(() => {
			result.current.handleEnd();
		});

		expect(onChange).toHaveBeenCalledWith(null);
		expect(onChange).toHaveBeenCalledTimes(2);
	});
});
