import Button from '@core/ui/button/Button';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function ButtonShowcase() {
	return (
		<ShowcaseSection
			title="Button"
			description="Button component with variants and sizes"
			tags={['button', 'action', 'click']}
		>
			<div className="space-y-6">
				<div>
					<h3 className="text-sm font-semibold text-white/80 mb-3">Variants</h3>
					<div className="flex flex-wrap gap-4">
						<Button variant="primary">Primary</Button>
						<Button variant="secondary">Secondary</Button>
						<Button variant="ghost">Ghost</Button>
					</div>
				</div>
				<div>
					<h3 className="text-sm font-semibold text-white/80 mb-3">Sizes</h3>
					<div className="flex flex-wrap gap-4 items-center">
						<Button size="sm">Small</Button>
						<Button size="md">Medium</Button>
						<Button size="lg">Large</Button>
					</div>
				</div>
				<div>
					<h3 className="text-sm font-semibold text-white/80 mb-3">States</h3>
					<div className="flex flex-wrap gap-4">
						<Button isLoading>Loading</Button>
						<Button disabled>Disabled</Button>
						<Button fullWidth className="max-w-md">
							Full Width
						</Button>
					</div>
				</div>
			</div>
		</ShowcaseSection>
	);
}
