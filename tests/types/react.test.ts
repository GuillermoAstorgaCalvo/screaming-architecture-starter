import type {
	BaseComponentProps,
	ChangeEventHandler,
	ChildrenProps,
	ClassNameProps,
	ComponentPropsType,
	ComponentPropsWithoutRefType,
	DisabledProps,
	DragEventHandler,
	ErrorProps,
	EventHandler,
	FocusEventHandler,
	FormEventHandler,
	HelperTextProps,
	IdProps,
	KeyboardEventHandler,
	LabelProps,
	LoadingProps,
	MouseEventHandler,
	OptionalChildrenProps,
	RequiredProps,
	ScrollEventHandler,
	TouchEventHandler,
	WheelEventHandler,
} from '@src-types/react';
import type React from 'react';
import { describe, expect, it } from 'vitest';

// Test constants
const TEST_CLASS_NAME = 'custom-class';
const TEST_ELEMENT_ID = 'element-id';

describe('react types', () => {
	describe('MouseEventHandler', () => {
		it('should accept mouse event handler', () => {
			const handler: MouseEventHandler<HTMLButtonElement> = event => {
				expect(event).toBeDefined();
			};
			const mockEvent = {
				type: 'click',
				target: document.createElement('button'),
			} as unknown as React.MouseEvent<HTMLButtonElement>;
			handler(mockEvent);
		});
	});

	describe('KeyboardEventHandler', () => {
		it('should accept keyboard event handler', () => {
			const handler: KeyboardEventHandler<HTMLInputElement> = event => {
				expect(event).toBeDefined();
			};
			const mockEvent = {
				type: 'keydown',
				target: document.createElement('input'),
			} as unknown as React.KeyboardEvent<HTMLInputElement>;
			handler(mockEvent);
		});
	});

	describe('ChangeEventHandler', () => {
		it('should accept change event handler', () => {
			const handler: ChangeEventHandler<HTMLInputElement> = event => {
				expect(event).toBeDefined();
			};
			const mockEvent = {
				type: 'change',
				target: document.createElement('input'),
			} as unknown as React.ChangeEvent<HTMLInputElement>;
			handler(mockEvent);
		});
	});

	describe('FocusEventHandler', () => {
		it('should accept focus event handler', () => {
			const handler: FocusEventHandler<HTMLInputElement> = event => {
				expect(event).toBeDefined();
			};
			const mockEvent = {
				type: 'focus',
				target: document.createElement('input'),
			} as unknown as React.FocusEvent<HTMLInputElement>;
			handler(mockEvent);
		});
	});

	describe('FormEventHandler', () => {
		it('should accept form event handler', () => {
			const handler: FormEventHandler<HTMLFormElement> = event => {
				expect(event).toBeDefined();
			};
			const mockEvent = {
				type: 'submit',
				target: document.createElement('form'),
			} as unknown as React.FormEvent<HTMLFormElement>;
			handler(mockEvent);
		});
	});

	describe('TouchEventHandler', () => {
		it('should accept touch event handler', () => {
			const handler: TouchEventHandler<HTMLDivElement> = event => {
				expect(event).toBeDefined();
			};
			const mockEvent = {
				type: 'touchstart',
				target: document.createElement('div'),
			} as unknown as React.TouchEvent<HTMLDivElement>;
			handler(mockEvent);
		});
	});

	describe('WheelEventHandler', () => {
		it('should accept wheel event handler', () => {
			const handler: WheelEventHandler<HTMLDivElement> = event => {
				expect(event).toBeDefined();
			};
			const mockEvent = {
				type: 'wheel',
				target: document.createElement('div'),
			} as unknown as React.WheelEvent<HTMLDivElement>;
			handler(mockEvent);
		});
	});

	describe('DragEventHandler', () => {
		it('should accept drag event handler', () => {
			const handler: DragEventHandler = event => {
				expect(event).toBeDefined();
			};
			const mockEvent = new DragEvent('drag');
			handler(mockEvent);
		});
	});

	describe('ScrollEventHandler', () => {
		it('should accept scroll event handler', () => {
			const handler: ScrollEventHandler<HTMLDivElement> = event => {
				expect(event).toBeDefined();
			};
			const mockEvent = {
				type: 'scroll',
				target: document.createElement('div'),
			} as unknown as React.UIEvent<HTMLDivElement>;
			handler(mockEvent);
		});
	});

	describe('EventHandler', () => {
		it('should accept generic event handler', () => {
			const handler: EventHandler = event => {
				expect(event).toBeDefined();
			};
			const mockEvent = {
				type: 'click',
			} as React.SyntheticEvent;
			handler(mockEvent);
		});
	});

	describe('ComponentPropsWithoutRefType', () => {
		it('should extract component props without ref', () => {
			type ButtonProps = ComponentPropsWithoutRefType<'button'>;
			const props: ButtonProps = {
				type: 'button',
				disabled: false,
			};
			expect(props.type).toBe('button');
			expect(props.disabled).toBe(false);
		});
	});

	describe('ComponentPropsType', () => {
		it('should extract component props with ref', () => {
			type InputProps = ComponentPropsType<'input'>;
			const props: InputProps = {
				type: 'text',
				value: 'test',
			};
			expect(props.type).toBe('text');
			expect(props.value).toBe('test');
		});
	});

	describe('ChildrenProps', () => {
		it('should allow ChildrenProps with children', () => {
			const props: ChildrenProps = {
				children: 'Content',
			};
			expect(props.children).toBe('Content');
		});
	});

	describe('OptionalChildrenProps', () => {
		it('should allow OptionalChildrenProps with children', () => {
			const props: OptionalChildrenProps = {
				children: 'Content',
			};
			expect(props.children).toBe('Content');
		});

		it('should allow OptionalChildrenProps without children', () => {
			const props: OptionalChildrenProps = {};
			expect(props.children).toBeUndefined();
		});
	});

	describe('ClassNameProps', () => {
		it('should allow ClassNameProps with className', () => {
			const props: ClassNameProps = {
				className: TEST_CLASS_NAME,
			};
			expect(props.className).toBe(TEST_CLASS_NAME);
		});

		it('should allow ClassNameProps without className', () => {
			const props: ClassNameProps = {};
			expect(props.className).toBeUndefined();
		});
	});

	describe('IdProps', () => {
		it('should allow IdProps with id', () => {
			const props: IdProps = {
				id: TEST_ELEMENT_ID,
			};
			expect(props.id).toBe(TEST_ELEMENT_ID);
		});

		it('should allow IdProps without id', () => {
			const props: IdProps = {};
			expect(props.id).toBeUndefined();
		});
	});

	describe('BaseComponentProps', () => {
		it('should combine common component props', () => {
			const props: BaseComponentProps = {
				className: TEST_CLASS_NAME,
				id: TEST_ELEMENT_ID,
				children: 'Content',
			};
			expect(props.className).toBe(TEST_CLASS_NAME);
			expect(props.id).toBe(TEST_ELEMENT_ID);
			expect(props.children).toBe('Content');
		});
	});

	describe('DisabledProps', () => {
		it('should allow DisabledProps with disabled', () => {
			const props: DisabledProps = {
				disabled: true,
			};
			expect(props.disabled).toBe(true);
		});
	});

	describe('RequiredProps', () => {
		it('should allow RequiredProps with required', () => {
			const props: RequiredProps = {
				required: true,
			};
			expect(props.required).toBe(true);
		});
	});

	describe('LoadingProps', () => {
		it('should allow LoadingProps with isLoading', () => {
			const props: LoadingProps = {
				isLoading: true,
			};
			expect(props.isLoading).toBe(true);
		});
	});

	describe('ErrorProps', () => {
		it('should allow ErrorProps with error string', () => {
			const props: ErrorProps = {
				error: 'Error message',
			};
			expect(props.error).toBe('Error message');
		});

		it('should allow ErrorProps with null error', () => {
			const props: ErrorProps = {
				error: null,
			};
			expect(props.error).toBeNull();
		});
	});

	describe('LabelProps', () => {
		it('should allow LabelProps with label', () => {
			const props: LabelProps = {
				label: 'Field Label',
			};
			expect(props.label).toBe('Field Label');
		});
	});

	describe('HelperTextProps', () => {
		it('should allow HelperTextProps with helperText', () => {
			const props: HelperTextProps = {
				helperText: 'Helper text',
			};
			expect(props.helperText).toBe('Helper text');
		});
	});
});
