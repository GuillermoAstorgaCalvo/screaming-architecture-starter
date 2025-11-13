import type { StandardSize } from '@src-types/ui/base';
import type { HTMLAttributes, ReactNode, RefObject } from 'react';

export interface OTPInputWrapperProps extends HTMLAttributes<HTMLDivElement> {
	readonly fullWidth: boolean;
	readonly children: ReactNode;
}

export interface OTPInputFieldProps {
	readonly id: string | undefined;
	readonly className: string;
	readonly hasError: boolean;
	readonly ariaDescribedBy: string | undefined;
	readonly disabled?: boolean | undefined;
	readonly required?: boolean | undefined;
	readonly length: number;
	readonly value: string;
	readonly onChange: (value: string) => void;
	readonly onComplete?: ((value: string) => void) | undefined;
	readonly autoFocus?: boolean | undefined;
	readonly inputRefs: RefObject<(HTMLInputElement | null)[]>;
}

export interface OTPInputMessagesProps {
	readonly inputId: string;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
}

export interface OTPInputLabelProps {
	readonly id: string;
	readonly label: string;
	readonly required?: boolean | undefined;
}

export interface UseOTPInputStateOptions {
	readonly inputId?: string | undefined;
	readonly label?: string | undefined;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
	readonly size: StandardSize;
	readonly className?: string | undefined;
}

export interface UseOTPInputStateReturn {
	readonly finalId: string | undefined;
	readonly hasError: boolean;
	readonly ariaDescribedBy: string | undefined;
	readonly inputClasses: string;
}

export interface OTPInputContentProps {
	readonly state: UseOTPInputStateReturn;
	readonly fieldProps: Readonly<OTPInputFieldProps>;
	readonly label?: string | undefined;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
	readonly required?: boolean | undefined;
	readonly fullWidth: boolean;
}
