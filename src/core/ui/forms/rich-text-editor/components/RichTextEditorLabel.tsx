import type { RichTextEditorLabelProps } from '@core/ui/forms/rich-text-editor/types/RichTextEditorTypes';

export function RichTextEditorLabel({ id, label, required }: Readonly<RichTextEditorLabelProps>) {
	return (
		<label htmlFor={id} className="mb-1 block text-sm font-medium">
			{label}
			{required ? <span className="ml-1 text-destructive">*</span> : null}
		</label>
	);
}
