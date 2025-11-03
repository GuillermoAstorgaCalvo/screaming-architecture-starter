import Input from '@core/ui/input/Input';
import Label from '@core/ui/label/Label';

function SizesDemo() {
	return (
		<div>
			<h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Sizes</h3>
			<div className="space-y-4 max-w-md">
				<div>
					<Label size="sm">Small Label</Label>
					<Input size="sm" placeholder="Small input" />
				</div>
				<div>
					<Label size="md">Medium Label</Label>
					<Input size="md" placeholder="Medium input" />
				</div>
				<div>
					<Label size="lg">Large Label</Label>
					<Input size="lg" placeholder="Large input" />
				</div>
			</div>
		</div>
	);
}

function RequiredIndicatorDemo() {
	return (
		<div>
			<h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
				Required Indicator
			</h3>
			<div className="space-y-4 max-w-md">
				<div>
					<Label required>Required Field</Label>
					<Input placeholder="This field is required" />
				</div>
				<div>
					<Label>Optional Field</Label>
					<Input placeholder="This field is optional" />
				</div>
			</div>
		</div>
	);
}

function StandaloneLabelsDemo() {
	return (
		<div>
			<h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
				Standalone Labels
			</h3>
			<div className="space-y-2">
				<Label>Regular Label</Label>
				<Label required>Required Label</Label>
				<Label size="sm">Small Label</Label>
				<Label size="md">Medium Label</Label>
				<Label size="lg">Large Label</Label>
			</div>
		</div>
	);
}

export default function LabelSection() {
	return (
		<section className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800">
			<h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Labels</h2>
			<div className="space-y-6">
				<SizesDemo />
				<RequiredIndicatorDemo />
				<StandaloneLabelsDemo />
			</div>
		</section>
	);
}
