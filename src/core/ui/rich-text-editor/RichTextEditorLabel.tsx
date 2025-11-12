import type { RichTextEditorLabelProps } from './RichTextEditorTypes';

export function RichTextEditorLabel({ id, label, required }: Readonly<RichTextEditorLabelProps>) {
	return (
		<label htmlFor={id} className="mb-1 block text-sm font-medium">
			{label}
			{required ? <span className="ml-1 text-red-500">*</span> : null}
		</label>
	);
}
