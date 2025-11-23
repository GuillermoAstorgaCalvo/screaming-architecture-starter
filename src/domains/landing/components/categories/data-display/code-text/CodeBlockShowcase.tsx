import CodeBlock from '@core/ui/data-display/code-block/CodeBlock';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function CodeBlockShowcase() {
	return (
		<ShowcaseSection
			title="CodeBlock"
			description="Code block component with syntax highlighting"
			tags={['data', 'code', 'syntax']}
		>
			<CodeBlock language="typescript">{`function greet(name: string) {
  return \`Hello, \${name}!\`;
}`}</CodeBlock>
		</ShowcaseSection>
	);
}
