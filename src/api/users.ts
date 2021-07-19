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
	client.get<Battle[]>('/battles/me', {
		params: {
			pageSize,
			...(pageParam && { prevKey: new Date(pageParam.startTime) })
		}
	});

// Search users
export const apiSearchUsers = async (
	query: string,
	pageSize: number,
	pageParam?: Player
) =>
	client.get<Player[]>('/users/search', {
		params: {
			query,
			pageSize,
			...(pageParam && { prevKey: pageParam.username })
		}
	});

// Send friend request
export const apiSendRequest = (friendId: string) =>
	client.post(`/friends/request/${friendId}`);

// Accept friend request
export const apiAcceptRequest = (friendId: string) =>
	client.post(`/invites/${friendId}`);

// Accept friend request
export const apiRejectRequest = (friendId: string) => {
	console.log('delete req friendId:', friendId);
	return client.delete(`/invites/${friendId}`);
};

// Unfriend user
export const apiUnfriendUser = (friendId: string) =>
	client.delete(`/friends/${friendId}`);

// Get friends
export const apiGetFriends = (pageSize: number, pageParam?: Player) =>
	client.get('/friends', {
		params: {
			pageSize,
			...(pageParam && { prevKey: pageParam.username })
		}
	});

// Get invites
export const apiGetInvites = (
	pageSize: number,
	pageParam?: { time: string; info: Player }
) =>
	client.get('/invites', {
		params: {
			pageSize,
			...(pageParam && { prevKey: new Date(pageParam.time) })
		}
	});
