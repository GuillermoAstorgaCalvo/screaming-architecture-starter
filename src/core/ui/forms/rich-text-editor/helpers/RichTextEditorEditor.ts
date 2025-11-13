import { DEFAULT_PLACEHOLDER } from '@core/ui/forms/rich-text-editor/constants/RichTextEditorConstants';
import { getStarterKitConfig } from '@core/ui/forms/rich-text-editor/helpers/RichTextEditorConfig';
import type { RichTextEditorFieldProps } from '@core/ui/forms/rich-text-editor/types/RichTextEditorTypes';
import Placeholder from '@tiptap/extension-placeholder';
import { useEditor } from '@tiptap/react';
import { useEffect } from 'react';

export function formatHeight(height: number | string | undefined): string | undefined {
	if (!height) {
		return undefined;
	}
	return typeof height === 'number' ? `${height}px` : height;
}

export function getDefaultExtensions(
	toolbar?: RichTextEditorFieldProps['toolbar'],
	placeholderText?: string
) {
	return [
		getStarterKitConfig(toolbar),
		Placeholder.configure({ placeholder: placeholderText ?? DEFAULT_PLACEHOLDER }),
	];
}

export function useEditorValueSync(
	editor: ReturnType<typeof useEditor>,
	value: string | undefined
) {
	useEffect(() => {
		if (value === undefined) {
			return;
		}
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		if (!editor) {
			return;
		}
		if (value !== editor.getHTML()) {
			editor.commands.setContent(value);
		}
	}, [editor, value]);
}

export function useEditorEditableSync(
	editor: ReturnType<typeof useEditor>,
	disabled?: boolean,
	readOnly?: boolean
) {
	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		if (!editor) {
			return;
		}
		editor.setEditable(!disabled && !readOnly);
	}, [editor, disabled, readOnly]);
}

export interface EditorConfigOptions {
	readonly extensions?: RichTextEditorFieldProps['extensions'];
	readonly toolbar?: RichTextEditorFieldProps['toolbar'];
	readonly placeholder?: RichTextEditorFieldProps['placeholder'];
	readonly value?: RichTextEditorFieldProps['value'];
	readonly defaultValue?: RichTextEditorFieldProps['defaultValue'];
	readonly disabled?: RichTextEditorFieldProps['disabled'];
	readonly readOnly?: RichTextEditorFieldProps['readOnly'];
	readonly onChange?: RichTextEditorFieldProps['onChange'];
}

export function getEditorConfig(options: EditorConfigOptions) {
	const { extensions, toolbar, placeholder, value, defaultValue, disabled, readOnly, onChange } =
		options;
	return {
		extensions:
			(extensions as Parameters<typeof useEditor>[0]['extensions']) ??
			getDefaultExtensions(toolbar, placeholder),
		content: value ?? defaultValue ?? '',
		editable: !disabled && !readOnly,
		onUpdate: ({ editor: editorInstance }: { editor: ReturnType<typeof useEditor> }) => {
			onChange?.(editorInstance.getHTML());
		},
	};
}

export function useRichTextEditor(options: EditorConfigOptions) {
	const { value, disabled, readOnly } = options;
	const editorConfig = getEditorConfig(options);
	const editor = useEditor(editorConfig);

	useEditorValueSync(editor, value);
	useEditorEditableSync(editor, disabled, readOnly);

	return editor;
}
