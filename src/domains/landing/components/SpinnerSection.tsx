import Spinner from '@core/ui/spinner/Spinner';

function SizesDemo() {
	return (
		<div>
			<h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Sizes</h3>
			<div className="flex flex-wrap items-center gap-6">
				<div className="flex flex-col items-center gap-2">
					<Spinner size="sm" />
					<span className="text-xs text-gray-600 dark:text-gray-400">Small</span>
				</div>
				<div className="flex flex-col items-center gap-2">
					<Spinner size="md" />
					<span className="text-xs text-gray-600 dark:text-gray-400">Medium</span>
				</div>
				<div className="flex flex-col items-center gap-2">
					<Spinner size="lg" />
					<span className="text-xs text-gray-600 dark:text-gray-400">Large</span>
				</div>
			</div>
		</div>
	);
}

function CustomSizesDemo() {
	return (
		<div>
			<h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Custom Sizes</h3>
			<div className="flex flex-wrap items-center gap-6">
				<div className="flex flex-col items-center gap-2">
					<Spinner size={16} />
					<span className="text-xs text-gray-600 dark:text-gray-400">16px</span>
				</div>
				<div className="flex flex-col items-center gap-2">
					<Spinner size={32} />
					<span className="text-xs text-gray-600 dark:text-gray-400">32px</span>
				</div>
				<div className="flex flex-col items-center gap-2">
					<Spinner size={48} />
					<span className="text-xs text-gray-600 dark:text-gray-400">48px</span>
				</div>
			</div>
		</div>
	);
}

function CustomColorsDemo() {
	return (
		<div>
			<h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Custom Colors</h3>
			<div className="flex flex-wrap items-center gap-6">
				<div className="flex flex-col items-center gap-2">
					<Spinner size="md" color="rgb(59, 130, 246)" />
					<span className="text-xs text-gray-600 dark:text-gray-400">Blue</span>
				</div>
				<div className="flex flex-col items-center gap-2">
					<Spinner size="md" color="rgb(34, 197, 94)" />
					<span className="text-xs text-gray-600 dark:text-gray-400">Green</span>
				</div>
				<div className="flex flex-col items-center gap-2">
					<Spinner size="md" color="rgb(239, 68, 68)" />
					<span className="text-xs text-gray-600 dark:text-gray-400">Red</span>
				</div>
				<div className="flex flex-col items-center gap-2">
					<Spinner size="md" color="rgb(168, 85, 247)" />
					<span className="text-xs text-gray-600 dark:text-gray-400">Purple</span>
				</div>
			</div>
		</div>
	);
}

function InContextDemo() {
	return (
		<div>
			<h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">In Context</h3>
			<div className="space-y-3">
				<div className="flex items-center gap-2">
					<Spinner size="sm" />
					<span className="text-sm text-gray-600 dark:text-gray-400">Loading data...</span>
				</div>
				<div className="flex items-center gap-2">
					<Spinner size="md" />
					<span className="text-sm text-gray-600 dark:text-gray-400">Processing request...</span>
				</div>
				<div className="flex items-center gap-2">
					<Spinner size="lg" />
					<span className="text-sm text-gray-600 dark:text-gray-400">
						Initializing application...
					</span>
				</div>
			</div>
		</div>
	);
}

export default function SpinnerSection() {
	return (
		<section className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800">
			<h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Spinners</h2>
			<div className="space-y-6">
				<SizesDemo />
				<CustomSizesDemo />
				<CustomColorsDemo />
				<InContextDemo />
			</div>
		</section>
	);
}
