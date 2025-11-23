/**
 * useSignaturePadSetup Tests
 *
 * Tests for the useSignaturePadSetup hook including:
 * - Canvas ref creation
 * - Canvas props generation
 * - Handler integration
 * - Value synchronization
 */

import { useSignaturePadSetup } from '@core/ui/media/signature-pad/hooks/useSignaturePadSetup';
import { useSignaturePadValue } from '@core/ui/media/signature-pad/hooks/useSignaturePadValue';
import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

// Mock the hooks
vi.mock('@core/ui/media/signature-pad/hooks/useSignaturePadValue', () => ({
	useSignaturePadValue: vi.fn(),
}));

vi.mock('@core/ui/media/signature-pad/hooks/useSignaturePadHandlers', () => ({
	useSignaturePadHandlers: vi.fn(() => ({
		handleEnd: vi.fn(),
		handleClear: vi.fn(),
	})),
}));

vi.mock('@core/ui/media/signature-pad/helpers/SignaturePadCanvasHelpers', () => ({
	getCanvasProps: vi.fn(options => ({
		id: options.id,
		width: options.width,
		height: options.height,
		className: options.canvasClassName,
		style: {
			backgroundColor: options.backgroundColor,
			cursor: options.disabled ? 'not-allowed' : 'crosshair',
			opacity: options.disabled ? 0.5 : 1,
		},
	})),
}));

describe('useSignaturePadSetup - Canvas Ref', () => {
	it('creates canvas ref', () => {
		const { result } = renderHook(() =>
			useSignaturePadSetup({
				id: 'test-canvas',
				width: 500,
				height: 200,
				canvasClassName: undefined,
				backgroundColor: '#FFFFFF',
				disabled: false,
				value: undefined,
				defaultValue: undefined,
				onChange: undefined,
				onClear: undefined,
			})
		);

		expect(result.current.canvasRef).toBeDefined();
		expect(result.current.canvasRef.current).toBeNull(); // Initially null
	});
});

describe('useSignaturePadSetup - Canvas Props', () => {
	it('generates correct canvas props', () => {
		const { result } = renderHook(() =>
			useSignaturePadSetup({
				id: 'test-canvas',
				width: 600,
				height: 300,
				canvasClassName: 'custom-class',
				backgroundColor: '#FF0000',
				disabled: false,
				value: undefined,
				defaultValue: undefined,
				onChange: undefined,
				onClear: undefined,
			})
		);

		expect(result.current.canvasProps).toBeDefined();
		expect(result.current.canvasProps.id).toBe('test-canvas');
		expect(result.current.canvasProps.width).toBe(600);
		expect(result.current.canvasProps.height).toBe(300);
		expect(result.current.canvasProps.className).toBe('custom-class');
		expect(result.current.canvasProps.style.backgroundColor).toBe('#FF0000');
		expect(result.current.canvasProps.style.cursor).toBe('crosshair');
		expect(result.current.canvasProps.style.opacity).toBe(1);
	});

	it('handles disabled state', () => {
		const { result } = renderHook(() =>
			useSignaturePadSetup({
				id: 'test-canvas',
				width: 500,
				height: 200,
				canvasClassName: undefined,
				backgroundColor: '#FFFFFF',
				disabled: true,
				value: undefined,
				defaultValue: undefined,
				onChange: undefined,
				onClear: undefined,
			})
		);

		expect(result.current.canvasProps.style.cursor).toBe('not-allowed');
		expect(result.current.canvasProps.style.opacity).toBe(0.5);
	});

	it('handles undefined id', () => {
		const { result } = renderHook(() =>
			useSignaturePadSetup({
				id: undefined,
				width: 500,
				height: 200,
				canvasClassName: undefined,
				backgroundColor: '#FFFFFF',
				disabled: false,
				value: undefined,
				defaultValue: undefined,
				onChange: undefined,
				onClear: undefined,
			})
		);

		expect(result.current.canvasProps.id).toBeUndefined();
	});

	it('handles undefined canvasClassName', () => {
		const { result } = renderHook(() =>
			useSignaturePadSetup({
				id: 'test-canvas',
				width: 500,
				height: 200,
				canvasClassName: undefined,
				backgroundColor: '#FFFFFF',
				disabled: false,
				value: undefined,
				defaultValue: undefined,
				onChange: undefined,
				onClear: undefined,
			})
		);

		expect(result.current.canvasProps.className).toBeUndefined();
	});
});

describe('useSignaturePadSetup - Handlers', () => {
	it('returns handleEnd and handleClear', () => {
		const { result } = renderHook(() =>
			useSignaturePadSetup({
				id: 'test-canvas',
				width: 500,
				height: 200,
				canvasClassName: undefined,
				backgroundColor: '#FFFFFF',
				disabled: false,
				value: undefined,
				defaultValue: undefined,
				onChange: undefined,
				onClear: undefined,
			})
		);

		expect(result.current.handleEnd).toBeDefined();
		expect(typeof result.current.handleEnd).toBe('function');
		expect(result.current.handleClear).toBeDefined();
		expect(typeof result.current.handleClear).toBe('function');
	});

	it('passes onChange to handlers', () => {
		const onChange = vi.fn();

		const { result } = renderHook(() =>
			useSignaturePadSetup({
				id: 'test-canvas',
				width: 500,
				height: 200,
				canvasClassName: undefined,
				backgroundColor: '#FFFFFF',
				disabled: false,
				value: undefined,
				defaultValue: undefined,
				onChange,
				onClear: undefined,
			})
		);

		expect(result.current.handleEnd).toBeDefined();
		expect(result.current.handleClear).toBeDefined();
	});

	it('passes onClear to handlers', () => {
		const onClear = vi.fn();

		const { result } = renderHook(() =>
			useSignaturePadSetup({
				id: 'test-canvas',
				width: 500,
				height: 200,
				canvasClassName: undefined,
				backgroundColor: '#FFFFFF',
				disabled: false,
				value: undefined,
				defaultValue: undefined,
				onChange: undefined,
				onClear,
			})
		);

		expect(result.current.handleEnd).toBeDefined();
		expect(result.current.handleClear).toBeDefined();
	});
});

describe('useSignaturePadSetup - Value Synchronization', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('passes value to useSignaturePadValue', () => {
		renderHook(() =>
			useSignaturePadSetup({
				id: 'test-canvas',
				width: 500,
				height: 200,
				canvasClassName: undefined,
				backgroundColor: '#FFFFFF',
				disabled: false,
				value: 'data:image/png;base64,test',
				defaultValue: undefined,
				onChange: undefined,
				onClear: undefined,
			})
		);

		expect(vi.mocked(useSignaturePadValue)).toHaveBeenCalledWith({
			canvasRef: expect.any(Object),
			value: 'data:image/png;base64,test',
			defaultValue: undefined,
		});
	});

	it('passes defaultValue to useSignaturePadValue', () => {
		renderHook(() =>
			useSignaturePadSetup({
				id: 'test-canvas',
				width: 500,
				height: 200,
				canvasClassName: undefined,
				backgroundColor: '#FFFFFF',
				disabled: false,
				value: undefined,
				defaultValue: 'data:image/png;base64,default',
				onChange: undefined,
				onClear: undefined,
			})
		);

		expect(vi.mocked(useSignaturePadValue)).toHaveBeenCalledWith({
			canvasRef: expect.any(Object),
			value: undefined,
			defaultValue: 'data:image/png;base64,default',
		});
	});
});
