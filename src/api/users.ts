import { Battle, CurrentUser } from '@app/models';
import client from './client';

type CreateProfileParams = {
	email: string;
	username: string;
	avatar?: string;
};
type UpdateProfileParams = {
	username?: string;
	avatar?: string;
};

// Create user profile in the database
export const apiCreateUserProfile = (params: CreateProfileParams) =>
	client.post('/users', params);

// Get current authenticated user
export const apiCurrentUser = async () =>
	(await client.get<CurrentUser>('/users/me')).data;

// Get all avatars
export const apiGetAvatars = async () =>
	(await client.get<string[]>('/avatars')).data;

// Update user profile
export const apiUpdateUserProfile = (params: UpdateProfileParams) =>
	client.put('/users', params);

// Get battle history
export const apiBattleHistory = async (pageSize: number, pageParam?: Battle) =>
	client.get<Battle[]>('/battles/me', {
		params: {
			pageSize,
			...(pageParam && { prevKey: new Date(pageParam.startTime) })
		}
	});
