/**
 * copyButtonUtils Tests
 *
 * Tests for utility functions:
 * - getHookOptions
 * - getUIState
 */

import type {
	HookOptionsInput,
	UIStateInput,
} from '@core/ui/utilities/copy-button/types/copyButton.types';
import { getHookOptions, getUIState } from '@core/ui/utilities/copy-button/utils/copyButtonUtils';
import { describe, expect, it, vi } from 'vitest';

describe('getHookOptions', () => {
	it('should return basic options with text', () => {
		const input: HookOptionsInput = {
			text: 'test text',
		};

		const result = getHookOptions(input);

		expect(result).toEqual({
			text: 'test text',
		});
	});

	it('should include successDuration when provided', () => {
		const input: HookOptionsInput = {
			text: 'test text',
			successDuration: 3000,
		};

		const result = getHookOptions(input);

		expect(result).toEqual({
			text: 'test text',
			successDuration: 3000,
		});
	});

	it('should include onCopySuccess when provided', () => {
		const onCopySuccess = vi.fn();
		const input: HookOptionsInput = {
			text: 'test text',
			onCopySuccess,
		};

		const result = getHookOptions(input);

		expect(result).toEqual({
			text: 'test text',
			onCopySuccess,
		});
	});

	it('should include onCopyError when provided', () => {
		const onCopyError = vi.fn();
		const input: HookOptionsInput = {
			text: 'test text',
			onCopyError,
		};

		const result = getHookOptions(input);

		expect(result).toEqual({
			text: 'test text',
			onCopyError,
		});
	});

	it('should handle all optional properties together', () => {
		const onCopySuccess = vi.fn();
		const onCopyError = vi.fn();
		const input: HookOptionsInput = {
			text: 'test text',
			successDuration: 5000,
			onCopySuccess,
			onCopyError,
		};

		const result = getHookOptions(input);

		expect(result).toEqual({
			text: 'test text',
			successDuration: 5000,
			onCopySuccess,
			onCopyError,
		});
	});

	it('should not include undefined optional properties', () => {
		const input: HookOptionsInput = {
			text: 'test text',
		};

		const result = getHookOptions(input);

		expect(result).toEqual({
			text: 'test text',
		});
		expect(result).not.toHaveProperty('successDuration');
		expect(result).not.toHaveProperty('onCopySuccess');
		expect(result).not.toHaveProperty('onCopyError');
	});

	it('should handle successDuration of 0', () => {
		const input: HookOptionsInput = {
			text: 'test text',
			successDuration: 0,
		};

		const result = getHookOptions(input);

		expect(result).toEqual({
			text: 'test text',
			successDuration: 0,
		});
	});
});

describe('getUIState', () => {
	it('should return copy state when isCopied is false', () => {
		const input: UIStateInput = {
			isCopied: false,
			copyTooltip: 'Copy to clipboard',
			copiedTooltip: 'Copied!',
		};

		const result = getUIState(input);

		expect(result).toEqual({
			tooltipText: 'Copy to clipboard',
			iconName: 'copy',
			buttonAriaLabel: 'Copy to clipboard',
		});
	});

	it('should return copied state when isCopied is true', () => {
		const input: UIStateInput = {
			isCopied: true,
			copyTooltip: 'Copy to clipboard',
			copiedTooltip: 'Copied!',
		};

		const result = getUIState(input);

		expect(result).toEqual({
			tooltipText: 'Copied!',
			iconName: 'check',
			buttonAriaLabel: 'Copied!',
		});
	});

	it('should use ariaLabel when provided and isCopied is false', () => {
		const input: UIStateInput = {
			isCopied: false,
			copyTooltip: 'Copy to clipboard',
			copiedTooltip: 'Copied!',
			ariaLabel: 'Copy text',
		};

		const result = getUIState(input);

		expect(result).toEqual({
			tooltipText: 'Copy to clipboard',
			iconName: 'copy',
			buttonAriaLabel: 'Copy text',
		});
	});

	it('should use copiedTooltip as ariaLabel when isCopied is true, even if ariaLabel is provided', () => {
		const input: UIStateInput = {
			isCopied: true,
			copyTooltip: 'Copy to clipboard',
			copiedTooltip: 'Copied!',
			ariaLabel: 'Copy text',
		};

		const result = getUIState(input);

		expect(result).toEqual({
			tooltipText: 'Copied!',
			iconName: 'check',
			buttonAriaLabel: 'Copied!',
		});
	});

	it('should use copyTooltip as ariaLabel when ariaLabel is not provided and isCopied is false', () => {
		const input: UIStateInput = {
			isCopied: false,
			copyTooltip: 'Copy to clipboard',
			copiedTooltip: 'Copied!',
		};

		const result = getUIState(input);

		expect(result.buttonAriaLabel).toBe('Copy to clipboard');
	});

	it('should handle empty string tooltips', () => {
		const input: UIStateInput = {
			isCopied: false,
			copyTooltip: '',
			copiedTooltip: '',
		};

		const result = getUIState(input);

		expect(result).toEqual({
			tooltipText: '',
			iconName: 'copy',
			buttonAriaLabel: '',
		});
	});

	it('should handle different tooltip texts for copy and copied states', () => {
		const inputCopy: UIStateInput = {
			isCopied: false,
			copyTooltip: 'Click to copy',
			copiedTooltip: 'Successfully copied',
		};

		const inputCopied: UIStateInput = {
			isCopied: true,
			copyTooltip: 'Click to copy',
			copiedTooltip: 'Successfully copied',
		};

		const resultCopy = getUIState(inputCopy);
		const resultCopied = getUIState(inputCopied);

		expect(resultCopy.tooltipText).toBe('Click to copy');
		expect(resultCopy.iconName).toBe('copy');
		expect(resultCopied.tooltipText).toBe('Successfully copied');
		expect(resultCopied.iconName).toBe('check');
	});
});
