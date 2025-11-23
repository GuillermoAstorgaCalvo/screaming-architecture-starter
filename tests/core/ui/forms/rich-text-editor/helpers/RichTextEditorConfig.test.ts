/**
 * RichTextEditorConfig Tests
 *
 * Tests for the RichTextEditorConfig including:
 * - getHeadingConfig function
 * - configureTextFeatures function
 * - configureListFeatures function
 * - configureBlockFeatures function
 * - getStarterKitConfig function
 */

import {
	configureBlockFeatures,
	configureListFeatures,
	configureTextFeatures,
	getHeadingConfig,
	getStarterKitConfig,
} from '@core/ui/forms/rich-text-editor/helpers/RichTextEditorConfig';
import type { RichTextEditorFieldProps } from '@core/ui/forms/rich-text-editor/types/RichTextEditorTypes';
import { describe, expect, it } from 'vitest';

describe('getHeadingConfig', () => {
	it('returns false when headingsEnabled is false', () => {
		const result = getHeadingConfig(false);
		expect(result).toBe(false);
	});

	it('returns heading levels config when headingsEnabled is true', () => {
		const result = getHeadingConfig(true);
		expect(result).toEqual({ levels: [1, 2, 3, 4, 5, 6] });
	});

	it('returns heading levels config when headingsEnabled is undefined', () => {
		const result = getHeadingConfig();
		expect(result).toEqual({ levels: [1, 2, 3, 4, 5, 6] });
	});
});

describe('configureTextFeatures', () => {
	it('disables bold when toolbar.bold is false', () => {
		const config: Parameters<typeof import('@tiptap/starter-kit').default.configure>[0] = {};
		const toolbar: RichTextEditorFieldProps['toolbar'] = { bold: false };
		configureTextFeatures(config, toolbar);
		expect(config.bold).toBe(false);
	});

	it('disables italic when toolbar.italic is false', () => {
		const config: Parameters<typeof import('@tiptap/starter-kit').default.configure>[0] = {};
		const toolbar: RichTextEditorFieldProps['toolbar'] = { italic: false };
		configureTextFeatures(config, toolbar);
		expect(config.italic).toBe(false);
	});

	it('disables strike when toolbar.strike is false', () => {
		const config: Parameters<typeof import('@tiptap/starter-kit').default.configure>[0] = {};
		const toolbar: RichTextEditorFieldProps['toolbar'] = { strike: false };
		configureTextFeatures(config, toolbar);
		expect(config.strike).toBe(false);
	});

	it('does not modify config when features are enabled', () => {
		const config: Parameters<typeof import('@tiptap/starter-kit').default.configure>[0] = {};
		const toolbar: RichTextEditorFieldProps['toolbar'] = { bold: true, italic: true };
		configureTextFeatures(config, toolbar);
		expect(config.bold).toBeUndefined();
		expect(config.italic).toBeUndefined();
	});

	it('does not modify config when features are undefined', () => {
		const config: Parameters<typeof import('@tiptap/starter-kit').default.configure>[0] = {};
		const toolbar: RichTextEditorFieldProps['toolbar'] = {};
		configureTextFeatures(config, toolbar);
		expect(config.bold).toBeUndefined();
		expect(config.italic).toBeUndefined();
		expect(config.strike).toBeUndefined();
	});

	it('disables multiple text features at once', () => {
		const config: Parameters<typeof import('@tiptap/starter-kit').default.configure>[0] = {};
		const toolbar: RichTextEditorFieldProps['toolbar'] = {
			bold: false,
			italic: false,
			strike: false,
		};
		configureTextFeatures(config, toolbar);
		expect(config.bold).toBe(false);
		expect(config.italic).toBe(false);
		expect(config.strike).toBe(false);
	});
});

describe('configureListFeatures', () => {
	it('disables bulletList when toolbar.bulletList is false', () => {
		const config: Parameters<typeof import('@tiptap/starter-kit').default.configure>[0] = {};
		const toolbar: RichTextEditorFieldProps['toolbar'] = { bulletList: false };
		configureListFeatures(config, toolbar);
		expect(config.bulletList).toBe(false);
	});

	it('disables orderedList when toolbar.orderedList is false', () => {
		const config: Parameters<typeof import('@tiptap/starter-kit').default.configure>[0] = {};
		const toolbar: RichTextEditorFieldProps['toolbar'] = { orderedList: false };
		configureListFeatures(config, toolbar);
		expect(config.orderedList).toBe(false);
	});

	it('does not modify config when list features are enabled', () => {
		const config: Parameters<typeof import('@tiptap/starter-kit').default.configure>[0] = {};
		const toolbar: RichTextEditorFieldProps['toolbar'] = { bulletList: true, orderedList: true };
		configureListFeatures(config, toolbar);
		expect(config.bulletList).toBeUndefined();
		expect(config.orderedList).toBeUndefined();
	});

	it('disables both list features at once', () => {
		const config: Parameters<typeof import('@tiptap/starter-kit').default.configure>[0] = {};
		const toolbar: RichTextEditorFieldProps['toolbar'] = {
			bulletList: false,
			orderedList: false,
		};
		configureListFeatures(config, toolbar);
		expect(config.bulletList).toBe(false);
		expect(config.orderedList).toBe(false);
	});
});

describe('configureBlockFeatures', () => {
	it('disables blockquote when toolbar.blockquote is false', () => {
		const config: Parameters<typeof import('@tiptap/starter-kit').default.configure>[0] = {};
		const toolbar: RichTextEditorFieldProps['toolbar'] = { blockquote: false };
		configureBlockFeatures(config, toolbar);
		expect(config.blockquote).toBe(false);
	});

	it('disables codeBlock when toolbar.codeBlock is false', () => {
		const config: Parameters<typeof import('@tiptap/starter-kit').default.configure>[0] = {};
		const toolbar: RichTextEditorFieldProps['toolbar'] = { codeBlock: false };
		configureBlockFeatures(config, toolbar);
		expect(config.codeBlock).toBe(false);
	});

	it('does not modify config when block features are enabled', () => {
		const config: Parameters<typeof import('@tiptap/starter-kit').default.configure>[0] = {};
		const toolbar: RichTextEditorFieldProps['toolbar'] = { blockquote: true, codeBlock: true };
		configureBlockFeatures(config, toolbar);
		expect(config.blockquote).toBeUndefined();
		expect(config.codeBlock).toBeUndefined();
	});

	it('disables both block features at once', () => {
		const config: Parameters<typeof import('@tiptap/starter-kit').default.configure>[0] = {};
		const toolbar: RichTextEditorFieldProps['toolbar'] = {
			blockquote: false,
			codeBlock: false,
		};
		configureBlockFeatures(config, toolbar);
		expect(config.blockquote).toBe(false);
		expect(config.codeBlock).toBe(false);
	});
});

describe('getStarterKitConfig', () => {
	it('returns configured StarterKit when toolbar is undefined', () => {
		const result = getStarterKitConfig();
		expect(result).toBeDefined();
		// StarterKit.configure returns an Extension object, not an array
		expect(result).toBeTruthy();
	});

	it('returns configured StarterKit when toolbar is empty', () => {
		const toolbar: RichTextEditorFieldProps['toolbar'] = {};
		const result = getStarterKitConfig(toolbar);
		expect(result).toBeDefined();
		expect(result).toBeTruthy();
	});

	it('configures StarterKit with disabled text features', () => {
		const toolbar: RichTextEditorFieldProps['toolbar'] = {
			bold: false,
			italic: false,
		};
		const result = getStarterKitConfig(toolbar);
		expect(result).toBeDefined();
		expect(result).toBeTruthy();
	});

	it('configures StarterKit with disabled headings', () => {
		const toolbar: RichTextEditorFieldProps['toolbar'] = {
			headings: false,
		};
		const result = getStarterKitConfig(toolbar);
		expect(result).toBeDefined();
		expect(result).toBeTruthy();
	});

	it('configures StarterKit with disabled list features', () => {
		const toolbar: RichTextEditorFieldProps['toolbar'] = {
			bulletList: false,
			orderedList: false,
		};
		const result = getStarterKitConfig(toolbar);
		expect(result).toBeDefined();
		expect(result).toBeTruthy();
	});

	it('configures StarterKit with disabled block features', () => {
		const toolbar: RichTextEditorFieldProps['toolbar'] = {
			blockquote: false,
			codeBlock: false,
		};
		const result = getStarterKitConfig(toolbar);
		expect(result).toBeDefined();
		expect(result).toBeTruthy();
	});

	it('configures StarterKit with all features disabled', () => {
		const toolbar: RichTextEditorFieldProps['toolbar'] = {
			bold: false,
			italic: false,
			strike: false,
			headings: false,
			bulletList: false,
			orderedList: false,
			blockquote: false,
			codeBlock: false,
		};
		const result = getStarterKitConfig(toolbar);
		expect(result).toBeDefined();
		expect(result).toBeTruthy();
	});
});
