import { CurrentUser } from '@app/models';
import client from './client';

type CreateProfileParams = {
	email: string;
	username: string;
	avatar?: string;
};

// Create user profile in the database
export const apiCreateUserProfile = ({
	email,
	username,
	avatar
}: CreateProfileParams) => {
	return client.post('/users', {
		email,
		username,
		avatar
	});
};

// Get current authenticated user
export const apiCurrentUser = async () =>
	(await client.get<CurrentUser>('/users/me')).data;

// Get all avatars
export const apiGetAvatars = async () =>
	(await client.get<string[]>('/avatars')).data;
