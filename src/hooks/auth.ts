import auth from '@react-native-firebase/auth';
import { apiCreateUserProfile } from '@app/api/users';

type LoginParams = { email: string; password: string };
type SignupParams = LoginParams & { username: string; avatar?: string };

export const loginWithEmailPassword = async ({
	email,
	password
}: LoginParams) => {
	try {
		await auth().signInWithEmailAndPassword(email, password);
		await apiCreateUserProfile({ email, username: email.split('@')[0] });
		return Promise.resolve();
	} catch (err) {
		console.error(err);
		return Promise.reject({ message: handleLoginError(err) });
	}
};

const handleLoginError = (err: any): string => {
	switch (err.code) {
		case 'auth/user-not-found':
			return 'Cannot find an account with this email';
		case 'auth/invalid-email':
		case 'auth/wrong-password':
			return 'Invalid email or password';
		default:
			return 'Something went wrong. Please try again later';
	}
};

export const signupWithEmailPassword = async ({
	email,
	password,
	username,
	avatar
}: SignupParams) => {
	try {
		await auth().createUserWithEmailAndPassword(email, password);
		await apiCreateUserProfile({ email, username, avatar });
		return Promise.resolve();
	} catch (err) {
		console.error(err);
		return Promise.reject({ message: err }); //handleSignupError(err) });
	}
};

const handleSignupError = (err: any): string => {
	switch (err.code) {
		case 'auth/email-already-in-use':
			return 'This email is already in use';
		default:
			return 'Something went wrong. Please try again later';
	}
};

export const signOutUser = () => {
	try {
		return Promise.resolve(auth().signOut());
	} catch (err) {
		console.error(err);
		return Promise.reject({
			message: 'Something went wrong. Please try again later'
		});
	}
};
