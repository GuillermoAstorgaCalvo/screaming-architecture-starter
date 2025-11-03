import Button from '@core/ui/button/Button';
import { useState } from 'react';

const LOADING_DURATION_MS = 2000;

interface ButtonRowProps {
	readonly size: 'sm' | 'md' | 'lg';
}

function ButtonRow({ size }: ButtonRowProps) {
	const variants: Array<'primary' | 'secondary' | 'ghost'> = ['primary', 'secondary', 'ghost'];
	const labels = {
		sm: ['Primary Small', 'Secondary Small', 'Ghost Small'],
		md: ['Primary Medium', 'Secondary Medium', 'Ghost Medium'],
		lg: ['Primary Large', 'Secondary Large', 'Ghost Large'],
	};

	return (
		<div className="flex flex-wrap gap-3">
			{variants.map((variant, idx) => (
				<Button key={variant} variant={variant} size={size}>
					{labels[size][idx]}
				</Button>
			))}
		</div>
	);
}

function ButtonCombinations() {
	return (
		<div>
			<h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
				Size + Variant Combinations
			</h3>
			<div className="space-y-2">
				<ButtonRow size="sm" />
				<ButtonRow size="md" />
				<ButtonRow size="lg" />
			</div>
		</div>
	);
}

function VariantsSection() {
	return (
		<div>
			<h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Variants</h3>
			<div className="flex flex-wrap gap-3">
				<Button variant="primary">Primary</Button>
				<Button variant="secondary">Secondary</Button>
				<Button variant="ghost">Ghost</Button>
			</div>
		</div>
	);
}

function SizesSection() {
	return (
		<div>
			<h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Sizes</h3>
			<div className="flex flex-wrap items-center gap-3">
				<Button size="sm">Small</Button>
				<Button size="md">Medium</Button>
				<Button size="lg">Large</Button>
			</div>
		</div>
	);
}

function StatesSection() {
	const [isLoading, setIsLoading] = useState(false);

	const handleLoadingClick = () => {
		setIsLoading(true);
		setTimeout(() => setIsLoading(false), LOADING_DURATION_MS);
	};

	return (
		<div>
			<h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">States</h3>
			<div className="flex flex-wrap gap-3">
				<Button>Default</Button>
				<Button disabled>Disabled</Button>
				<Button isLoading={isLoading} onClick={handleLoadingClick}>
					{isLoading ? 'Loading...' : 'Click to Load'}
				</Button>
				<Button fullWidth>Full Width</Button>
			</div>
		</div>
	);
}

export default function ButtonSection() {
	return (
		<section className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800">
			<h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Buttons</h2>
			<div className="space-y-6">
				<VariantsSection />
				<SizesSection />
				<StatesSection />
				<ButtonCombinations />
			</div>
		</section>
	);
}
