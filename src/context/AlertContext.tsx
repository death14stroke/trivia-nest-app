import React, { FC, useReducer, createContext, Dispatch } from 'react';
import { Dialog } from '@app/components';

interface Action {
	type: 'show_alert' | 'show_confirm' | 'hide';
	payload?: any;
}

type State = {
	open: boolean;
	title: string;
	description: string;
	type: 'alert' | 'confirm';
	positiveBtnTitle: string;
	onSuccess?: () => void;
};

type Config = {
	title: string;
	description: string;
	positiveBtnTitle?: string;
	onSuccess?: () => void;
};

const alertReducer = (state: State, action: Action): State => {
	switch (action.type) {
		case 'show_alert':
			return { open: true, type: 'alert', ...action.payload };
		case 'show_confirm':
			return { open: true, type: 'confirm', ...action.payload };
		case 'hide':
			return { ...state, open: false };
		default:
			return state;
	}
};

const showAlert =
	(dispatch: Dispatch<Action>) =>
	({ title, description, positiveBtnTitle = 'Ok', onSuccess }: Config) =>
		dispatch({
			type: 'show_alert',
			payload: {
				title,
				description,
				positiveBtnTitle,
				onSuccess
			}
		});
const showConfirm =
	(dispatch: Dispatch<Action>) =>
	({ title, description, positiveBtnTitle = 'OK', onSuccess }: Config) =>
		dispatch({
			type: 'show_confirm',
			payload: {
				title,
				description,
				positiveBtnTitle,
				onSuccess
			}
		});

type ContextValue = {
	alert: ReturnType<typeof showAlert>;
	confirm: ReturnType<typeof showConfirm>;
};

const INITIAL_VALUE: State = {
	title: '',
	description: '',
	open: false,
	type: 'alert',
	positiveBtnTitle: 'OK'
};

const Context = createContext<ContextValue>(undefined!);

const Provider: FC = ({ children }) => {
	const [state, dispatch] = useReducer(alertReducer, INITIAL_VALUE);
	const { open, title, description, type, positiveBtnTitle, onSuccess } =
		state;

	const hide = () => dispatch({ type: 'hide' });

	return (
		<Context.Provider
			value={{
				alert: showAlert(dispatch),
				confirm: showConfirm(dispatch)
			}}>
			{children}
			<Dialog.Container visible={open} style={{ width: '75%' }}>
				<Dialog.Title>{title}</Dialog.Title>
				<Dialog.Description>{description}</Dialog.Description>
				<Dialog.ButtonContainer>
					{type === 'confirm' && (
						<Dialog.Button title='Cancel' onPress={hide} />
					)}
					<Dialog.Button
						title={positiveBtnTitle}
						onPress={() => {
							onSuccess?.();
							hide();
						}}
					/>
				</Dialog.ButtonContainer>
			</Dialog.Container>
		</Context.Provider>
	);
};

export { Context as AlertContext, Provider as AlertProvider };
