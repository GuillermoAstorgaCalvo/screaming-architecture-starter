import type { RichTextEditorWrapperProps } from '@core/ui/forms/rich-text-editor/types/RichTextEditorTypes';

export function RichTextEditorWrapper({
	fullWidth,
	children,
	...props
}: Readonly<RichTextEditorWrapperProps>) {
	return (
		<div className={fullWidth ? 'w-full' : undefined} {...props}>
			{children}
		</div>
	);
}
