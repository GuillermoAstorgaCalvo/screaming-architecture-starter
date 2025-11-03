import { UseAsyncDemo } from './HooksDemoSection/UseAsyncDemo';
import { UseFetchDemo } from './HooksDemoSection/UseFetchDemo';
import { UseLocalStorageDemo } from './HooksDemoSection/UseLocalStorageDemo';
import { UseMediaQueryDemo } from './HooksDemoSection/UseMediaQueryDemo';
import { UsePreviousDemo } from './HooksDemoSection/UsePreviousDemo';
import { UseThrottleDemo } from './HooksDemoSection/UseThrottleDemo';
import { UseWindowSizeDemo } from './HooksDemoSection/UseWindowSizeDemo';

export default function HooksDemoSection() {
	return (
		<section className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800">
			<h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
				Core Hooks Demonstrations
			</h2>
			<div className="space-y-6">
				<div className="border-b border-gray-200 dark:border-gray-700 pb-6">
					<UseAsyncDemo />
				</div>
				<div className="border-b border-gray-200 dark:border-gray-700 pb-6">
					<UseFetchDemo />
				</div>
				<div className="border-b border-gray-200 dark:border-gray-700 pb-6">
					<UseThrottleDemo />
				</div>
				<div className="border-b border-gray-200 dark:border-gray-700 pb-6">
					<UseMediaQueryDemo />
				</div>
				<div className="border-b border-gray-200 dark:border-gray-700 pb-6">
					<UseWindowSizeDemo />
				</div>
				<div className="border-b border-gray-200 dark:border-gray-700 pb-6">
					<UsePreviousDemo />
				</div>
				<div>
					<UseLocalStorageDemo />
				</div>
			</div>
		</section>
	);
}
