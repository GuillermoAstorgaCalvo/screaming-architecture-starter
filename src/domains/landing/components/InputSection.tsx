import { useState } from 'react';

import {
	BasicInputs,
	InputDisabled,
	InputFullWidth,
	InputSizes,
	InputsWithError,
	InputsWithHelperText,
	InputsWithIcons,
} from './InputSection/InputSectionParts';

export default function InputSection() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [search, setSearch] = useState('');

	return (
		<section className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800">
			<h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Inputs</h2>
			<div className="space-y-6">
				<BasicInputs />
				<InputsWithHelperText />
				<InputsWithError
					email={email}
					password={password}
					setEmail={setEmail}
					setPassword={setPassword}
				/>
				<InputsWithIcons search={search} setSearch={setSearch} />
				<InputSizes />
				<InputFullWidth />
				<InputDisabled />
			</div>
		</section>
	);
}
