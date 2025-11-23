import Pagination from '@core/ui/navigation/pagination/Pagination';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';
import { useState } from 'react';

export function PaginationShowcase() {
	const [currentPage, setCurrentPage] = useState(1);

	return (
		<ShowcaseSection
			title="Pagination"
			description="Pagination component"
			tags={['navigation', 'pagination', 'page']}
		>
			<Pagination currentPage={currentPage} totalPages={10} onPageChange={setCurrentPage} />
		</ShowcaseSection>
	);
}
