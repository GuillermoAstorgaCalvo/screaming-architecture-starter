import type { MarkdownEditorLabelProps } from './MarkdownEditorTypes';

export function MarkdownEditorLabel({ id, label, required }: Readonly<MarkdownEditorLabelProps>) {
	return (
		<label htmlFor={id} className="mb-1 block text-sm font-medium">
			{label}
			{required ? <span className="ml-1 text-red-500">*</span> : null}
		</label>
	);
}
