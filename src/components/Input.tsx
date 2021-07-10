import React, { FC, useState } from 'react';
import { StyleSheet } from 'react-native';
import {
	Input as NativeInput,
	InputProps,
	Icon,
	useTheme,
	Theme
} from 'react-native-elements';

type Props = InputProps;

const EmailInput: FC<Props> = props => {
	const { theme } = useTheme();
	const styles = useStyles(theme);
	const { colors } = theme;

	return (
		<NativeInput
			label='Email'
			placeholder='Your email'
			rightIcon={{
				type: 'feather',
				name: 'mail',
				color: colors?.secondary
			}}
			keyboardType='email-address'
			autoCapitalize='none'
			autoCorrect={false}
			autoCompleteType='email'
			inputContainerStyle={styles.inputContainer}
			labelStyle={styles.label}
			inputStyle={styles.input}
			{...props}
		/>
	);
};

const PasswordInput: FC<Props> = props => {
	const { theme } = useTheme();
	const styles = useStyles(theme);
	const { colors } = theme;
	const [hidePassword, setHidePassword] = useState(true);

	const togglePasswordVisibility = () => {
		setHidePassword(!hidePassword);
	};

	return (
		<NativeInput
			label='Password'
			placeholder='Your password'
			secureTextEntry={hidePassword}
			autoCapitalize='none'
			autoCorrect={false}
			autoCompleteType='password'
			rightIcon={
				<Icon
					type='simple-line-icon'
					name={hidePassword ? 'lock-open' : 'lock'}
					color={colors?.secondary}
					onPress={togglePasswordVisibility}
				/>
			}
			inputContainerStyle={styles.inputContainer}
			labelStyle={styles.label}
			inputStyle={styles.input}
			{...props}
		/>
	);
};

const UsernameInput: FC<Props> = props => {
	const { theme } = useTheme();
	const styles = useStyles(theme);
	const { colors } = theme;

	return (
		<NativeInput
			label='Username'
			placeholder='Your username'
			autoCompleteType='name'
			rightIcon={{
				type: 'antdesign',
				name: 'user',
				color: colors?.secondary
			}}
			autoCorrect={false}
			autoCapitalize='words'
			inputContainerStyle={styles.inputContainer}
			labelStyle={styles.label}
			inputStyle={styles.input}
			{...props}
		/>
	);
};

const useStyles = ({ colors }: Theme) =>
	StyleSheet.create({
		label: {
			marginBottom: 8,
			color: colors?.secondary
		},
		inputContainer: {
			borderWidth: 1,
			borderRadius: 8,
			borderColor: colors?.secondary,
			padding: 4
		},
		input: {
			paddingStart: 4
		}
	});

export const Input = {
	Email: EmailInput,
	Username: UsernameInput,
	Password: PasswordInput
};
