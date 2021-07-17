import React, { FC, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, Text } from 'react-native-elements';
import { useMutation, useQuery } from 'react-query';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { AppStackParamList } from '@app/navigation';
import { BASE_URL } from '@app/api/client';
import { apiGetAvatars } from '@app/api/users';
import { signupWithEmailPassword } from '@app/hooks/auth';
import { showToast } from '@app/hooks/ui';
import { SelectAvatarModal } from '../SelectAvatarModal';
import { Input } from '../Input';
import { Button } from '../Button';

type Values = {
	username: string;
	email: string;
	password: string;
	avatar: string;
};

const PATTERN_EMAIL = /\S+@\S+\.\S+/;

const formSchema = Yup.object().shape({
	username: Yup.string().required('Username is required.'),
	email: Yup.string()
		.matches(PATTERN_EMAIL, 'Invalid email address.')
		.required('Email is required.'),
	password: Yup.string()
		.required('Password is required.')
		.matches(
			/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
			'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number, One special case Character.'
		),
	avatar: Yup.string().required('Please select an avatar')
});

const SignupForm: FC = () => {
	const navigation =
		useNavigation<StackNavigationProp<AppStackParamList, 'Signup'>>();
	const [open, setOpen] = useState(false);

	const { data: avatars, isLoading: isLoadingAvatars } = useQuery<string[]>(
		'avatars',
		apiGetAvatars,
		{ staleTime: 120 * 60 * 1000 }
	);

	const { mutate, isLoading: isLoadingSignup } = useMutation<
		unknown,
		{ message: string },
		Values
	>(signupWithEmailPassword, {
		onSuccess: async () =>
			navigation.reset({ index: 0, routes: [{ name: 'mainFlow' }] }),
		onError: err => showToast(err.message)
	});

	const _onSubmit = (values: Values) => {
		mutate(values);
	};

	const toggleModal = () => setOpen(!open);

	if (isLoadingAvatars) {
		return null;
	}

	return (
		<Formik
			validationSchema={formSchema}
			initialValues={{
				username: '',
				email: '',
				password: '',
				avatar: avatars![0]
			}}
			onSubmit={_onSubmit}>
			{({
				values,
				touched,
				errors,
				setFieldValue,
				handleChange,
				handleBlur,
				handleSubmit
			}) => (
				<>
					<View style={styles.form}>
						<Avatar
							source={{ uri: BASE_URL + values.avatar }}
							rounded
							size='large'
							containerStyle={styles.avatar}
							activeOpacity={0.8}
							onPress={toggleModal}
						/>
						<Input.Username
							value={values.username}
							errorMessage={
								(touched.username && errors.username) || ''
							}
							onChangeText={handleChange('username')}
							onBlur={handleBlur('username')}
							containerStyle={{ marginVertical: 4 }}
						/>
						<Input.Email
							value={values.email}
							errorMessage={(touched.email && errors.email) || ''}
							onChangeText={handleChange('email')}
							onBlur={handleBlur('email')}
							containerStyle={{ marginVertical: 4 }}
						/>
						<Input.Password
							value={values.password}
							errorMessage={
								(touched.password && errors.password) || ''
							}
							onChangeText={handleChange('password')}
							onBlur={handleBlur('password')}
							containerStyle={{ marginVertical: 4 }}
						/>
						<Button.Raised
							loading={isLoadingSignup}
							onPress={handleSubmit}>
							<Text h4>Continue</Text>
						</Button.Raised>
					</View>
					<SelectAvatarModal
						open={open}
						data={avatars!}
						defaultAvatar={values.avatar}
						onCancel={toggleModal}
						onSuccess={avatar => {
							setFieldValue('avatar', avatar);
							toggleModal();
						}}
					/>
				</>
			)}
		</Formik>
	);
};

const styles = StyleSheet.create({
	form: {
		backgroundColor: 'white',
		borderRadius: 24,
		alignSelf: 'stretch',
		marginTop: 38,
		paddingHorizontal: 12,
		paddingBottom: 12
	},
	avatar: {
		marginTop: -38,
		marginBottom: 8,
		alignSelf: 'center'
	}
});

export { SignupForm };
