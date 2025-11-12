import type { StandardSize } from '@src-types/ui/base';
import type { ReactNode } from 'react';

export type ButtonSize = 'sm' | 'md' | 'lg';

export interface TransferActionsProps {
	readonly onMoveToTarget: () => void;
	readonly onMoveToSource: () => void;
	readonly isMoveToTargetDisabled: boolean;
	readonly isMoveToSourceDisabled: boolean;
	readonly size?: StandardSize;
	readonly disabled?: boolean;
	readonly labels?:
		| {
				moveToRight?: string | undefined;
				moveToLeft?: string | undefined;
		  }
		| undefined;
}

export interface MoveButtonProps {
	readonly icon: ReactNode;
	readonly onClick: () => void;
	readonly disabled: boolean;
	readonly size: ButtonSize;
	readonly ariaLabel: string;
	readonly title: string;
}

export interface ButtonConfig {
	readonly icon: ReactNode;
	readonly onClick: () => void;
	readonly disabled: boolean;
	readonly ariaLabel: string;
	readonly title: string;
}

export interface ButtonConfigOptions {
	readonly buttonSize: ButtonSize;
	readonly onClick: () => void;
	readonly disabled: boolean;
	readonly label?: string | undefined;
}
