import { CodeBlockShowcase } from './code-text/CodeBlockShowcase';
import { CodeShowcase } from './code-text/CodeShowcase';
import { DescriptionListShowcase } from './code-text/DescriptionListShowcase';

export function CodeTextShowcase() {
	return (
		<div className="space-y-8">
			<CodeShowcase />
			<CodeBlockShowcase />
			<DescriptionListShowcase />
		</div>
	);
}
