import CurrencyInput from '@core/ui/forms/currency-input/CurrencyInput';
import type { FormsCategoryState } from '@domains/landing/components/categories/forms/state';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function renderCurrencyInputSection(state: FormsCategoryState) {
	return (
		<ShowcaseSection
			title="CurrencyInput"
			description="Currency/money input with formatting"
			tags={['form', 'input', 'currency', 'money', 'number']}
		>
			<div className="space-y-4">
				<CurrencyInput
					label="Price (USD)"
					currency="USD"
					value={state.currencyValue}
					onChange={e => state.setCurrencyValue(e.target.value)}
					placeholder="0.00"
				/>
				<CurrencyInput label="Amount (EUR)" currency="EUR" defaultValue="100.00" />
				<CurrencyInput label="Amount (GBP)" currency="GBP" defaultValue="50.00" />
			</div>
		</ShowcaseSection>
	);
}
