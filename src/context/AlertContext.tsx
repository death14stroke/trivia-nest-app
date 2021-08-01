import React, { FC, useReducer, createContext, Dispatch } from 'react';
import { StyleSheet } from 'react-native';
import Dialog from 'react-native-dialog';
import { BlurView } from '@react-native-community/blur';
import { useTheme } from 'react-native-elements';

interface Action {
	type: 'show_alert' | 'hide_alert';
	payload?: any;
}

type State = {
	open: boolean;
	title: string;
	description: string;
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
			return { open: true, ...action.payload };
		case 'hide_alert':
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

type ContextValue = {
	show: ReturnType<typeof showAlert>;
};

const INITIAL_VALUE: State = {
	title: '',
	description: '',
	open: false,
	positiveBtnTitle: 'Ok'
};

const Context = createContext<ContextValue>(undefined!);

const Provider: FC = ({ children }) => {
	const {
		theme: { colors }
	} = useTheme();
	const [state, dispatch] = useReducer(alertReducer, INITIAL_VALUE);
	const { open, title, description, positiveBtnTitle, onSuccess } = state;

	const hideAlert = () => dispatch({ type: 'hide_alert' });

	const blurComponentIOS = (
		<BlurView
			style={StyleSheet.absoluteFill}
			blurType='xlight'
			blurAmount={50}
		/>
	);

	return (
		<Context.Provider value={{ show: showAlert(dispatch) }}>
			{children}
			<Dialog.Container
				visible={open}
				blurComponentIOS={blurComponentIOS}>
				<Dialog.Title>{title}</Dialog.Title>
				<Dialog.Description>{description}</Dialog.Description>
				<Dialog.Button
					label='Cancel'
					bold
					color={colors?.primary}
					onPress={hideAlert}
				/>
				<Dialog.Button
					label={positiveBtnTitle}
					bold
					color={colors?.primary}
					onPress={() => {
						onSuccess?.();
						hideAlert();
					}}
				/>
			</Dialog.Container>
		</Context.Provider>
	);
};

export { Context as AlertContext, Provider as AlertProvider };
