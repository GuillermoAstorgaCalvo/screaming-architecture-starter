import UserNameForm from '@domains/landing/components/UserNameForm';

export interface StorageSectionProps {
	readonly visitCount: number;
	readonly userName: string;

	readonly onUserNameChange: (_: string) => void;
	readonly onClearStorage: () => void;
}

export default function StorageSection({
	visitCount,
	userName,
	onUserNameChange,
	onClearStorage,
}: StorageSectionProps) {
	return (
		<section className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800">
			<h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
				Storage Integration
			</h2>
			<div className="space-y-4">
				<div>
					<p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
						Visit count (stored in localStorage):
					</p>
					<p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{visitCount}</p>
				</div>

				<UserNameForm userName={userName} onUserNameChange={onUserNameChange} />

				<div className="pt-4 border-t border-gray-200 dark:border-gray-700">
					<button
						type="button"
						onClick={onClearStorage}
						className="px-4 py-2 text-sm text-red-600 dark:text-red-400 border border-red-300 dark:border-red-700 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
					>
						Clear stored data
					</button>
				</div>
			</div>
		</section>
	);
}
