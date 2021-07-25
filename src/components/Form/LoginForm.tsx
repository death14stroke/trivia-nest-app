import React, { FC } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Text, Theme, useTheme } from 'react-native-elements';
import { useMutation } from 'react-query';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { AppStackParamList } from '@app/navigation';
import { loginWithEmailPassword } from '@app/hooks/auth';
import { showToast } from '@app/hooks/ui';
import { Input } from '../Input';
import { Button } from '../Button';

type Values = {
	email: string;
	password: string;
};

const PATTERN_EMAIL = /\S+@\S+\.\S+/;

const formSchema = Yup.object().shape({
	email: Yup.string()
		.matches(PATTERN_EMAIL, 'Invalid email address.')
		.required('Email is required.'),
	password: Yup.string()
		.required('Password is required.')
		.matches(
			/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
			'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number, One special case Character.'
		)
});

const LoginForm: FC = () => {
	const navigation =
		useNavigation<StackNavigationProp<AppStackParamList, 'Signup'>>();
	const styles = useStyles(useTheme().theme);

	const { mutate, isLoading } = useMutation<
		unknown,
		{ message: string },
		Values
	>(loginWithEmailPassword, {
		onSuccess: async () =>
			navigation.reset({ index: 0, routes: [{ name: 'mainFlow' }] }),
		onError: err => showToast(err.message)
	});

	const _onSubmit = (values: Values) => mutate(values);

	return (
		<Formik
			validationSchema={formSchema}
			initialValues={{ email: '', password: '' }}
			onSubmit={_onSubmit}>
			{({
				values,
				touched,
				errors,
				handleChange,
				handleBlur,
				handleSubmit
			}) => (
				<>
					<View style={styles.form}>
						<Input.Email
							value={values.email}
							errorMessage={(touched.email && errors.email) || ''}
							onChangeText={handleChange('email')}
							onBlur={handleBlur('email')}
						/>
						<Input.Password
							value={values.password}
							errorMessage={
								(touched.password && errors.password) || ''
							}
							onChangeText={handleChange('password')}
							onBlur={handleBlur('password')}
						/>
						<Button.Raised
							onPress={handleSubmit}
							disabled={isLoading}>
							{!isLoading ? (
								<Text h4>Continue</Text>
							) : (
								<ActivityIndicator size='large' color='white' />
							)}
						</Button.Raised>
					</View>
				</>
			)}
		</Formik>
	);
};

const useStyles = ({ colors }: Theme) =>
	StyleSheet.create({
		form: {
			backgroundColor: 'white',
			borderRadius: 24,
			alignSelf: 'stretch',
			marginTop: 38,
			padding: 12,
			elevation: 12,
			shadowColor: colors?.grey3,
			shadowOffset: { width: 0, height: 0 },
			shadowOpacity: 0.8,
			shadowRadius: 36
		}
	});

export { LoginForm };
