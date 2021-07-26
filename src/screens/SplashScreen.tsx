import React, { FC, useEffect, useContext } from 'react';
import { Alert } from 'react-native';
import { InfiniteData, useQueryClient } from 'react-query';
import { useNavigation, useRoute } from '@react-navigation/native';
import { BadgeContext, ProfileContext, SocketContext } from '@app/context';
import { Invite, Query, SocketEvent } from '@app/models';

const SplashScreen: FC = ({ children }) => {
	const navigation = useNavigation();
	const route = useRoute();
	const queryClient = useQueryClient();
	const socket = useContext(SocketContext);
	const {
		actions: {
			updateUserStatus,
			undoAddFriendRequest,
			receivedFriendRequest,
			receivedFriendRequestAccept,
			unfriend
		}
	} = useContext(ProfileContext);
	const {
		state: { invites },
		actions: { updateInvitesBadge }
	} = useContext(BadgeContext);

	useEffect(() => {
		socket?.on(SocketEvent.USER_UPDATE, ({ uid, status }) => {
			updateUserStatus(uid, status);
		});

		socket?.on(
			SocketEvent.INVITE_MULTIPLAYER_ROOM,
			({ roomId, player }) => {
				if (route.name in ['Multiplayer', 'MatchMaking', 'Quiz']) {
					return;
				}

				Alert.alert('Room invite', `${player.username} invited you`, [
					{
						text: 'Cancel',
						onPress: () => console.log('Cancel Pressed'),
						style: 'cancel'
					},
					{
						text: 'Join',
						onPress: () => joinRoom(roomId),
						style: 'default'
					}
				]);
			}
		);

		socket?.on(SocketEvent.JOIN_MULTIPLAYER_ROOM, roomId => {
			navigation.navigate('Multiplayer', { roomId });
		});

		socket?.on(SocketEvent.FRIEND_REQUEST, ({ player, time }) => {
			updateInvitesBadge(invites + 1);
			// add to invites set in ProfileContext
			receivedFriendRequest(player._id);

			const prevData = queryClient.getQueryData<InfiniteData<Invite[]>>(
				Query.INVITES
			);
			if (prevData) {
				prevData.pages[0] = [
					{ info: player, time },
					...prevData.pages[0]
				];
				queryClient.setQueryData(Query.INVITES, prevData);
			} else {
				queryClient.invalidateQueries(Query.INVITES);
			}
		});

		socket?.on(SocketEvent.FRIEND_REQUEST_REJECT, friendId => {
			console.log('friend request reject:', friendId);
			undoAddFriendRequest(friendId);
		});

		socket?.on(SocketEvent.FRIEND_REQUEST_ACCEPT, friendId => {
			// remove from requests set in ProfileContext
			// add to friends map in ProfileContext
			console.log('friend request accept:', friendId);
			receivedFriendRequestAccept(friendId);
			queryClient.invalidateQueries(Query.FRIENDS);
		});

		socket?.on(SocketEvent.UNFRIEND, friendId => {
			unfriend(friendId);
			queryClient.invalidateQueries(Query.FRIENDS);
		});
	}, [socket]);

	const joinRoom = (roomId: string) => {
		socket?.emit(SocketEvent.JOIN_MULTIPLAYER_ROOM, roomId);
	};

	return <>{children}</>;
};

export { SplashScreen };
