import React, { FC, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Avatar, Text, Theme, useTheme } from 'react-native-elements';
import { RNToasty } from 'react-native-toasty';
import { useMutation, useQuery } from 'react-query';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { AppStackParamList } from '@app/navigation';
import { Query } from '@app/models';
import { BASE_URL } from '@app/api/client';
import { apiGetAvatars } from '@app/api/users';
import { signupWithEmailPassword } from '@app/hooks/auth';
import { SelectAvatarModal } from '../Overlay';
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
	const styles = useStyles(useTheme().theme);
	const [open, setOpen] = useState(false);

	const { data: avatars, isLoading: isLoadingAvatars } = useQuery<string[]>(
		Query.AVATARS,
		apiGetAvatars,
		{ staleTime: Infinity }
	);

	const { mutate, isLoading: isLoadingSignup } = useMutation<
		unknown,
		{ message: string },
		Values
	>(signupWithEmailPassword, {
		onSuccess: async () =>
			navigation.reset({ index: 0, routes: [{ name: 'mainFlow' }] }),
		onError: err =>
			RNToasty.Error({ title: err.message, duration: 0, withIcon: false })
	});

	const _onSubmit = (values: Values) => mutate(values);

	const toggleModal = () => setOpen(!open);

	if (isLoadingAvatars || avatars === undefined) {
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
						/>
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
							disabled={isLoadingSignup}>
							{!isLoadingSignup ? (
								<Text h4>Continue</Text>
							) : (
								<ActivityIndicator size='large' color='white' />
							)}
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

const useStyles = ({ colors }: Theme) =>
	StyleSheet.create({
		form: {
			backgroundColor: 'white',
			borderRadius: 24,
			alignSelf: 'stretch',
			marginTop: 38,
			paddingHorizontal: 12,
			paddingBottom: 12,
			elevation: 12,
			shadowColor: colors?.grey3,
			shadowOffset: { width: 0, height: 0 },
			shadowOpacity: 0.8,
			shadowRadius: 36
		},
		avatar: {
			marginTop: -38,
			marginBottom: 8,
			alignSelf: 'center',
			borderWidth: 1,
			borderColor: 'white'
		}
	});

export { SignupForm };
