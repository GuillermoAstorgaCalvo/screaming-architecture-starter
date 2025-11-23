import InlineEdit from '@core/ui/forms/inline-edit/InlineEdit';
import Text from '@core/ui/text/Text';
import type { FormsCategoryState } from '@domains/landing/components/categories/forms/state';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

interface InlineEditSectionProps {
	state: FormsCategoryState;
}

export function InlineEditSection({ state }: Readonly<InlineEditSectionProps>) {
	return (
		<ShowcaseSection
			title="InlineEdit"
			description="Editable text component (click to edit)"
			tags={['form', 'input', 'edit', 'inline']}
		>
			<div className="space-y-4">
				<div className="space-y-2">
					<Text size="sm" className="text-muted-foreground">
						Click the text below to edit:
					</Text>
					<InlineEdit
						value={state.inlineEditValue}
						onSave={state.setInlineEditValue}
						placeholder="Click to edit"
					/>
				</div>
				<div className="space-y-2">
					<Text size="sm" className="text-muted-foreground">
						With custom display renderer:
					</Text>
					<InlineEdit
						value={state.inlineEditValue}
						onSave={state.setInlineEditValue}
						renderDisplay={value => <Text className="font-semibold text-lg">{value}</Text>}
					/>
				</div>
			</div>
		</ShowcaseSection>
	);
}
