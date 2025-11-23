import { useTranslation } from '@core/i18n/useTranslation';
import Transfer from '@core/ui/forms/transfer/Transfer';
import { transferOptions } from '@domains/landing/components/categories/forms/constants/constants';
import type { FormsCategoryState } from '@domains/landing/components/categories/forms/state';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

interface TransferSectionProps {
	readonly state: FormsCategoryState;
}

export function TransferSection({ state }: TransferSectionProps) {
	const { t } = useTranslation('common');

	return (
		<ShowcaseSection
			title="Transfer"
			description="Component for moving items between two lists"
			tags={['form', 'input', 'transfer', 'list']}
		>
			<div className="space-y-4">
				<Transfer
					options={transferOptions}
					value={state.transferValue}
					onChange={state.setTransferValue}
					sourceTitle={t('transfer.sourceTitle')}
					targetTitle={t('transfer.targetTitle')}
					showSearch
				/>
			</div>
		</ShowcaseSection>
	);
}
