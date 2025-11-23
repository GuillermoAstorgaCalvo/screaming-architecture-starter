import { useState } from 'react';

/**
 * State hook for specialized form controls (email, password, phone, OTP, currency, color, tags, rating)
 */
export function useSpecializedState() {
	const [emailValue, setEmailValue] = useState('');
	const [passwordValue, setPasswordValue] = useState('');
	const [phoneValue, setPhoneValue] = useState('');
	const [otpValue, setOtpValue] = useState('');
	const [currencyValue, setCurrencyValue] = useState('');
	const [colorInputValue, setColorInputValue] = useState('#ff0000');
	const [colorPickerValue, setColorPickerValue] = useState('#00ff00');
	const [tagInputValue, setTagInputValue] = useState<string[]>([]);
	const [ratingValue, setRatingValue] = useState(0);

	return {
		emailValue,
		setEmailValue,
		passwordValue,
		setPasswordValue,
		phoneValue,
		setPhoneValue,
		otpValue,
		setOtpValue,
		currencyValue,
		setCurrencyValue,
		colorInputValue,
		setColorInputValue,
		colorPickerValue,
		setColorPickerValue,
		tagInputValue,
		setTagInputValue,
		ratingValue,
		setRatingValue,
	};
}
