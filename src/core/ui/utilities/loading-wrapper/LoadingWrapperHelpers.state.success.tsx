import type {
	LoadingWrapperStateParams,
	SuccessStateParams,
} from './LoadingWrapperHelpers.state.types';

/** Render success state (content) */
export function renderSuccessState({ children, className, props }: SuccessStateParams) {
	return (
		<div className={className} {...props}>
			{children}
		</div>
	);
}

/** Build success state params */
export function buildSuccessStateParams(params: LoadingWrapperStateParams): SuccessStateParams {
	return {
		props: params.props,
		...(params.children !== undefined && { children: params.children }),
		...(params.className !== undefined && { className: params.className }),
	};
}
