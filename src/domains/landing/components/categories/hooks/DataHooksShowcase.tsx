import { AsyncShowcase } from '@domains/landing/components/categories/hooks/showcases/data/AsyncShowcase';
import { FetchShowcase } from '@domains/landing/components/categories/hooks/showcases/data/FetchShowcase';

/**
 * DataHooksShowcase - Showcase group for data fetching hooks
 */
export function DataHooksShowcase() {
	return (
		<>
			<FetchShowcase />

			<AsyncShowcase />
		</>
	);
}
