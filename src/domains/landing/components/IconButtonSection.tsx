import IconButton from '@core/ui/icon-button/IconButton';
import CloseIcon from '@core/ui/icons/close-icon/CloseIcon';
import HeartIcon from '@core/ui/icons/heart-icon/HeartIcon';
import SearchIcon from '@core/ui/icons/search-icon/SearchIcon';
import SettingsIcon from '@core/ui/icons/settings-icon/SettingsIcon';

function SizesDemo() {
	return (
		<div>
			<h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Sizes</h3>
			<div className="flex flex-wrap items-center gap-3">
				<IconButton icon={<CloseIcon size="sm" />} aria-label="Close small" size="sm" />
				<IconButton icon={<CloseIcon size="md" />} aria-label="Close medium" size="md" />
				<IconButton icon={<CloseIcon size="lg" />} aria-label="Close large" size="lg" />
			</div>
		</div>
	);
}

function VariantsDemo() {
	return (
		<div>
			<h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Variants</h3>
			<div className="flex flex-wrap gap-3">
				<IconButton icon={<SearchIcon />} aria-label="Search" variant="default" size="md" />
				<IconButton icon={<HeartIcon />} aria-label="Like" variant="ghost" size="md" />
				<IconButton icon={<SettingsIcon />} aria-label="Settings" variant="default" size="md" />
			</div>
		</div>
	);
}

function DifferentIconsDemo() {
	return (
		<div>
			<h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Different Icons</h3>
			<div className="flex flex-wrap gap-3">
				<IconButton icon={<SearchIcon />} aria-label="Search" size="md" />
				<IconButton icon={<HeartIcon />} aria-label="Like" size="md" />
				<IconButton icon={<SettingsIcon />} aria-label="Settings" size="md" />
				<IconButton icon={<CloseIcon />} aria-label="Close" size="md" />
			</div>
		</div>
	);
}

function StatesDemo() {
	return (
		<div>
			<h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">States</h3>
			<div className="flex flex-wrap gap-3">
				<IconButton icon={<SearchIcon />} aria-label="Search" size="md" />
				<IconButton icon={<SearchIcon />} aria-label="Search disabled" size="md" disabled />
			</div>
		</div>
	);
}

export default function IconButtonSection() {
	return (
		<section className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800">
			<h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Icon Buttons</h2>
			<div className="space-y-6">
				<SizesDemo />
				<VariantsDemo />
				<DifferentIconsDemo />
				<StatesDemo />
			</div>
		</section>
	);
}
