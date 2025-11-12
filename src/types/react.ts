import type {
	ChangeEvent,
	ComponentProps,
	ComponentPropsWithoutRef,
	FocusEvent,
	FormEvent,
	JSX,
	JSXElementConstructor,
	KeyboardEvent,
	MouseEvent,
	ReactNode,
	SyntheticEvent,
	TouchEvent,
	UIEvent,
	WheelEvent,
} from 'react';
/**
 * React-related types
 *
 * Centralized React type definitions for events, components, and utilities
 * used across the application.
 */
/**
 * React mouse event handler type
 */
export type MouseEventHandler<T = HTMLElement> = (event: MouseEvent<T>) => void;

/**
 * React keyboard event handler type
 */
export type KeyboardEventHandler<T = HTMLElement> = (event: KeyboardEvent<T>) => void;

/**
 * React change event handler type
 */
export type ChangeEventHandler<T = HTMLElement> = (event: ChangeEvent<T>) => void;

/**
 * React focus event handler type
 */
export type FocusEventHandler<T = HTMLElement> = (event: FocusEvent<T>) => void;

/**
 * React form event handler type
 */
export type FormEventHandler<T = HTMLElement> = (event: FormEvent<T>) => void;

/**
 * React touch event handler type
 */
export type TouchEventHandler<T = HTMLElement> = (event: TouchEvent<T>) => void;

/**
 * React wheel event handler type
 */
export type WheelEventHandler<T = HTMLElement> = (event: WheelEvent<T>) => void;

/**
 * React drag event handler type
 */
export type DragEventHandler = (event: DragEvent) => void;

/**
 * React scroll event handler type
 */
export type ScrollEventHandler<T = HTMLElement> = (event: UIEvent<T>) => void;

/**
 * Generic React event handler
 */
export type EventHandler<TEvent = SyntheticEvent> = (event: TEvent) => void;

/**
 * Generic React component props without ref
 * Useful for extracting props from component types
 */
export type ComponentPropsWithoutRefType<
	T extends keyof JSX.IntrinsicElements | JSXElementConstructor<unknown>,
> = ComponentPropsWithoutRef<T>;

/**
 * Generic React component props with ref
 * Useful for extracting props from component types
 */
export type ComponentPropsType<
	T extends keyof JSX.IntrinsicElements | JSXElementConstructor<unknown>,
> = ComponentProps<T>;

/**
 * Props for a component that accepts children
 */
export interface ChildrenProps {
	/** Component children */
	readonly children: ReactNode;
}

/**
 * Props for a component that optionally accepts children
 */
export interface OptionalChildrenProps {
	/** Optional component children */
	readonly children?: ReactNode;
}

/**
 * Props for a component with className
 */
export interface ClassNameProps {
	/** Additional CSS classes */
	readonly className?: string;
}

/**
 * Props for a component with an optional id
 */
export interface IdProps {
	/** Element ID */
	readonly id?: string;
}

/**
 * Props combining common component props
 */
export interface BaseComponentProps extends ClassNameProps, IdProps, OptionalChildrenProps {}

/**
 * Props for a component that can be disabled
 */
export interface DisabledProps {
	/** Whether the component is disabled */
	readonly disabled?: boolean;
}

/**
 * Props for a component that can be required
 */
export interface RequiredProps {
	/** Whether the field is required */
	readonly required?: boolean;
}

/**
 * Props for a component with a loading state
 */
export interface LoadingProps {
	/** Whether the component is in a loading state */
	readonly isLoading?: boolean;
}

/**
 * Props for a component with an error state
 */
export interface ErrorProps {
	/** Error message to display */
	readonly error?: string | null;
}

/**
 * Props for a component with a label
 */
export interface LabelProps {
	/** Label text */
	readonly label?: string;
}

/**
 * Props for a component with helper text
 */
export interface HelperTextProps {
	/** Helper text to display */
	readonly helperText?: string;
}
