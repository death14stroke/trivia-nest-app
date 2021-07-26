import { Battle, CurrentUser, Player } from '@app/models';
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
	(
		await client.get<Battle[]>('/battles/me', {
			params: {
				pageSize,
				...(pageParam && { prevKey: new Date(pageParam.startTime) })
			}
		})
	).data;

// Search users
export const apiSearchUsers = async (
	query: string,
	pageSize: number,
	pageParam?: Player
) =>
	(
		await client.get<Player[]>('/users/search', {
			params: {
				query,
				pageSize,
				...(pageParam && { prevKey: pageParam.username })
			}
		})
	).data;

// Get friends
export const apiGetFriends = async (pageSize: number, pageParam?: Player) =>
	(
		await client.get('/friends', {
			params: {
				pageSize,
				...(pageParam && { prevKey: pageParam.username })
			}
		})
	).data;

// Get invites
export const apiGetInvites = async (
	pageSize: number,
	pageParam?: { time: string; info: Player }
) =>
	(
		await client.get('/invites', {
			params: {
				pageSize,
				...(pageParam && { prevKey: new Date(pageParam.time) })
			}
		})
	).data;
