/**
 * useFileUpload Hooks Tests
 *
 * Tests for the useFileUpload hooks including:
 * - useFileState
 * - useDragHandlers
 * - useValidationWrappers
 */

import {
	useDragHandlers,
	useFileState,
	useValidationWrappers,
} from '@core/ui/forms/file-upload/hooks/useFileUpload.hooks';
import { act, renderHook, waitFor } from '@testing-library/react';
import type { DragEvent } from 'react';
import { describe, expect, it, vi } from 'vitest';

describe('useFileState', () => {
	it('initializes with empty files array when value is null', () => {
		const { result } = renderHook(() => useFileState(null));

		expect(result.current.files).toEqual([]);
		expect(result.current.validationError).toBeUndefined();
	});

	it('initializes with empty files array when value is undefined', () => {
		const { result } = renderHook(() => useFileState(undefined));

		expect(result.current.files).toEqual([]);
	});

	it('initializes with single file when value is File', () => {
		const file = new File(['content'], 'test.txt', { type: 'text/plain' });
		const { result } = renderHook(() => useFileState(file));

		expect(result.current.files).toHaveLength(1);
		expect(result.current.files[0]).toBeDefined();
		expect(result.current.files[0]!.file).toBe(file);
		expect(result.current.files[0]!.status).toBe('pending');
		expect(result.current.files[0]!.id).toBeDefined();
	});

	it('initializes with multiple files when value is File[]', () => {
		const files = [
			new File(['content1'], 'test1.txt', { type: 'text/plain' }),
			new File(['content2'], 'test2.txt', { type: 'text/plain' }),
		];
		const { result } = renderHook(() => useFileState(files));

		expect(result.current.files).toHaveLength(2);
		expect(result.current.files[0]).toBeDefined();
		expect(result.current.files[1]).toBeDefined();
		expect(result.current.files[0]!.file).toBe(files[0]);
		expect(result.current.files[1]!.file).toBe(files[1]);
	});

	it('updates files when value changes', async () => {
		const file1 = new File(['content1'], 'test1.txt', { type: 'text/plain' });
		const { result, rerender } = renderHook(({ value }) => useFileState(value), {
			initialProps: { value: file1 },
		});

		expect(result.current.files).toHaveLength(1);

		const file2 = new File(['content2'], 'test2.txt', { type: 'text/plain' });
		rerender({ value: file2 });

		await waitFor(() => {
			expect(result.current.files).toHaveLength(1);
			expect(result.current.files[0]).toBeDefined();
			expect(result.current.files[0]!.file).toBe(file2);
		});
	});

	it('does not update when value is undefined', () => {
		const file = new File(['content'], 'test.txt', { type: 'text/plain' });
		const { result, rerender } = renderHook(({ value }) => useFileState(value), {
			initialProps: { value: file },
		});

		const initialFiles = result.current.files;

		rerender({ value: undefined as unknown as File });

		// Should not update when value is undefined
		expect(result.current.files).toEqual(initialFiles);
	});

	it('allows setting files manually', () => {
		const { result } = renderHook(() => useFileState(null));

		const newFiles = [
			{
				file: new File(['content'], 'test.txt', { type: 'text/plain' }),
				id: 'test-id',
				status: 'pending' as const,
			},
		];

		act(() => {
			result.current.setFiles(newFiles);
		});

		expect(result.current.files).toEqual(newFiles);
	});

	it('allows setting validation error', () => {
		const { result } = renderHook(() => useFileState(null));

		act(() => {
			result.current.setValidationError('File too large');
		});

		expect(result.current.validationError).toBe('File too large');
	});

	it('allows clearing validation error', () => {
		const { result } = renderHook(() => useFileState(null));

		act(() => {
			result.current.setValidationError('Error');
		});

		act(() => {
			result.current.setValidationError(undefined);
		});

		expect(result.current.validationError).toBeUndefined();
	});
});

describe('useDragHandlers', () => {
	it('calls setDragActive(true) on drag enter', () => {
		const setDragActive = vi.fn();
		const onFilesProcess = vi.fn().mockResolvedValue(undefined);

		const { result } = renderHook(() => useDragHandlers(onFilesProcess, setDragActive));

		const dragEvent = {
			preventDefault: vi.fn(),
			stopPropagation: vi.fn(),
		} as unknown as DragEvent<HTMLDivElement>;

		act(() => {
			result.current.handleDragEnter(dragEvent);
		});

		expect(setDragActive).toHaveBeenCalledWith(true);
		expect(dragEvent.preventDefault).toHaveBeenCalled();
		expect(dragEvent.stopPropagation).toHaveBeenCalled();
	});

	it('calls setDragActive(false) on drag leave', () => {
		const setDragActive = vi.fn();
		const onFilesProcess = vi.fn().mockResolvedValue(undefined);

		const { result } = renderHook(() => useDragHandlers(onFilesProcess, setDragActive));

		const dragEvent = {
			preventDefault: vi.fn(),
			stopPropagation: vi.fn(),
		} as unknown as DragEvent<HTMLDivElement>;

		act(() => {
			result.current.handleDragLeave(dragEvent);
		});

		expect(setDragActive).toHaveBeenCalledWith(false);
		expect(dragEvent.preventDefault).toHaveBeenCalled();
		expect(dragEvent.stopPropagation).toHaveBeenCalled();
	});

	it('prevents default and stops propagation on drag over', () => {
		const setDragActive = vi.fn();
		const onFilesProcess = vi.fn().mockResolvedValue(undefined);

		const { result } = renderHook(() => useDragHandlers(onFilesProcess, setDragActive));

		const dragEvent = {
			preventDefault: vi.fn(),
			stopPropagation: vi.fn(),
		} as unknown as DragEvent<HTMLDivElement>;

		act(() => {
			result.current.handleDragOver(dragEvent);
		});

		expect(dragEvent.preventDefault).toHaveBeenCalled();
		expect(dragEvent.stopPropagation).toHaveBeenCalled();
	});

	it('calls onFilesProcess with dropped files', async () => {
		const setDragActive = vi.fn();
		const onFilesProcess = vi.fn().mockResolvedValue(undefined);
		const files = [
			new File(['content1'], 'test1.txt', { type: 'text/plain' }),
			new File(['content2'], 'test2.txt', { type: 'text/plain' }),
		];

		const { result } = renderHook(() => useDragHandlers(onFilesProcess, setDragActive));

		const dataTransfer = {
			files: (() => {
				const dt = new DataTransfer();
				for (const file of files) dt.items.add(file);
				return dt.files;
			})(),
		};

		const dragEvent = {
			preventDefault: vi.fn(),
			stopPropagation: vi.fn(),
			dataTransfer,
		} as unknown as DragEvent<HTMLDivElement>;

		act(() => {
			result.current.handleDrop(dragEvent);
		});

		expect(setDragActive).toHaveBeenCalledWith(false);
		expect(dragEvent.preventDefault).toHaveBeenCalled();
		expect(dragEvent.stopPropagation).toHaveBeenCalled();

		await waitFor(() => {
			expect(onFilesProcess).toHaveBeenCalledWith(files);
		});
	});

	it('does not call onFilesProcess when no files are dropped', async () => {
		const setDragActive = vi.fn();
		const onFilesProcess = vi.fn().mockResolvedValue(undefined);

		const { result } = renderHook(() => useDragHandlers(onFilesProcess, setDragActive));

		const dataTransfer = {
			files: (() => {
				const dt = new DataTransfer();
				return dt.files;
			})(),
		};

		const dragEvent = {
			preventDefault: vi.fn(),
			stopPropagation: vi.fn(),
			dataTransfer,
		} as unknown as DragEvent<HTMLDivElement>;

		act(() => {
			result.current.handleDrop(dragEvent);
		});

		await waitFor(() => {
			expect(onFilesProcess).not.toHaveBeenCalled();
		});
	});

	it('handles errors in onFilesProcess gracefully', async () => {
		const setDragActive = vi.fn();
		const onFilesProcess = vi.fn().mockRejectedValue(new Error('Processing failed'));
		const files = [new File(['content'], 'test.txt', { type: 'text/plain' })];

		const { result } = renderHook(() => useDragHandlers(onFilesProcess, setDragActive));

		const dataTransfer = {
			files: (() => {
				const dt = new DataTransfer();
				for (const file of files) dt.items.add(file);
				return dt.files;
			})(),
		};

		const dragEvent = {
			preventDefault: vi.fn(),
			stopPropagation: vi.fn(),
			dataTransfer,
		} as unknown as DragEvent<HTMLDivElement>;

		// Should not throw
		await act(async () => {
			result.current.handleDrop(dragEvent);
		});

		await waitFor(() => {
			expect(onFilesProcess).toHaveBeenCalled();
		});
	});

	it('maintains stable handler references', () => {
		const setDragActive = vi.fn();
		const onFilesProcess = vi.fn().mockResolvedValue(undefined);

		const { result, rerender } = renderHook(() => useDragHandlers(onFilesProcess, setDragActive));

		const firstHandleDragEnter = result.current.handleDragEnter;
		const firstHandleDragLeave = result.current.handleDragLeave;
		const firstHandleDragOver = result.current.handleDragOver;
		const firstHandleDrop = result.current.handleDrop;

		rerender();

		expect(result.current.handleDragEnter).toBe(firstHandleDragEnter);
		expect(result.current.handleDragLeave).toBe(firstHandleDragLeave);
		expect(result.current.handleDragOver).toBe(firstHandleDragOver);
		expect(result.current.handleDrop).toBe(firstHandleDrop);
	});
});

describe('useValidationWrappers', () => {
	it('calls processNewFiles and sets validation error', async () => {
		const processNewFiles = vi.fn().mockResolvedValue('Validation error');
		const handleFileRemove = vi.fn();
		const setValidationError = vi.fn();

		const { result } = renderHook(() =>
			useValidationWrappers(processNewFiles, handleFileRemove, setValidationError)
		);

		const files = [new File(['content'], 'test.txt', { type: 'text/plain' })];

		await act(async () => {
			await result.current.processWithValidation(files);
		});

		expect(processNewFiles).toHaveBeenCalledWith(files);
		expect(setValidationError).toHaveBeenCalledWith('Validation error');
	});

	it('clears validation error when processNewFiles returns undefined', async () => {
		const processNewFiles = vi.fn().mockResolvedValue(undefined);
		const handleFileRemove = vi.fn();
		const setValidationError = vi.fn();

		const { result } = renderHook(() =>
			useValidationWrappers(processNewFiles, handleFileRemove, setValidationError)
		);

		const files = [new File(['content'], 'test.txt', { type: 'text/plain' })];

		await act(async () => {
			await result.current.processWithValidation(files);
		});

		expect(setValidationError).toHaveBeenCalledWith(undefined);
	});

	it('calls handleFileRemove and sets validation error', () => {
		const processNewFiles = vi.fn();
		const handleFileRemove = vi.fn().mockReturnValue('Remove error');
		const setValidationError = vi.fn();

		const { result } = renderHook(() =>
			useValidationWrappers(processNewFiles, handleFileRemove, setValidationError)
		);

		act(() => {
			result.current.removeWithValidation('file-id');
		});

		expect(handleFileRemove).toHaveBeenCalledWith('file-id');
		expect(setValidationError).toHaveBeenCalledWith('Remove error');
	});

	it('clears validation error when handleFileRemove returns undefined', () => {
		const processNewFiles = vi.fn();
		const handleFileRemove = vi.fn().mockReturnValue(undefined);
		const setValidationError = vi.fn();

		const { result } = renderHook(() =>
			useValidationWrappers(processNewFiles, handleFileRemove, setValidationError)
		);

		act(() => {
			result.current.removeWithValidation('file-id');
		});

		expect(setValidationError).toHaveBeenCalledWith(undefined);
	});

	it('maintains stable wrapper references', () => {
		const processNewFiles = vi.fn().mockResolvedValue(undefined);
		const handleFileRemove = vi.fn();
		const setValidationError = vi.fn();

		const { result, rerender } = renderHook(() =>
			useValidationWrappers(processNewFiles, handleFileRemove, setValidationError)
		);

		const firstProcessWithValidation = result.current.processWithValidation;
		const firstRemoveWithValidation = result.current.removeWithValidation;

		rerender();

		expect(result.current.processWithValidation).toBe(firstProcessWithValidation);
		expect(result.current.removeWithValidation).toBe(firstRemoveWithValidation);
	});
});
