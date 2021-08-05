import React, { FC, useEffect, useContext } from 'react';
import { InfiniteData, useQueryClient } from 'react-query';
import { useNavigation } from '@react-navigation/native';
import _ from 'lodash';
import {
	AlertContext,
	BadgeContext,
	ProfileContext,
	SocketContext
} from '@app/context';
import { Invite, Query, Response, SocketEvent } from '@app/models';

const SplashScreen: FC = ({ children }) => {
	const navigation = useNavigation();
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
		actions: { updateInvitesBadge, updateFriendsBadge }
	} = useContext(BadgeContext);
	const Alert = useContext(AlertContext);

	useEffect(() => {
		socket?.on(SocketEvent.USER_UPDATE, ({ uid, status }) => {
			updateUserStatus(uid, status);
			queryClient.invalidateQueries(Query.FRIENDS);
		});

		socket?.on(
			SocketEvent.INVITE_MULTIPLAYER_ROOM,
			({ roomId, player }) => {
				Alert.confirm({
					title: 'Room invite',
					description: `${player.username} invited you`,
					positiveBtnTitle: 'Join',
					onSuccess: () => joinRoom(roomId)
				});
			}
		);

		socket?.on(SocketEvent.JOIN_MULTIPLAYER_ROOM, (roomId: string) => {
			navigation.navigate('Multiplayer', { roomId });
		});

		socket?.on(SocketEvent.FRIEND_REQUEST, ({ player }) => {
			updateInvitesBadge();
			receivedFriendRequest(player._id);

			const prevData = queryClient.getQueryData<InfiniteData<Invite[]>>(
				Query.INVITES
			);
			if (prevData) {
				prevData.pages[0] = _.uniqBy(
					[
						{ info: player, time: new Date().toUTCString() },
						...prevData.pages[0]
					],
					({ info }) => info._id
				);
				queryClient.setQueryData(Query.INVITES, prevData);
			} else {
				queryClient.invalidateQueries(Query.INVITES);
			}
		});

		socket?.on(SocketEvent.FRIEND_REQUEST_REJECT, friendId => {
			undoAddFriendRequest(friendId);
		});

		socket?.on(SocketEvent.FRIEND_REQUEST_ACCEPT, friendId => {
			updateFriendsBadge();
			receivedFriendRequestAccept(friendId);
			queryClient.invalidateQueries(Query.FRIENDS);
		});

		socket?.on(SocketEvent.UNFRIEND, friendId => {
			unfriend(friendId);
			queryClient.invalidateQueries(Query.FRIENDS);
		});

		return () => {
			socket?.off(SocketEvent.USER_UPDATE);
			socket?.off(SocketEvent.INVITE_MULTIPLAYER_ROOM);
			socket?.off(SocketEvent.JOIN_MULTIPLAYER_ROOM);
			socket?.off(SocketEvent.FRIEND_REQUEST);
			socket?.off(SocketEvent.FRIEND_REQUEST_REJECT);
			socket?.off(SocketEvent.FRIEND_REQUEST_ACCEPT);
			socket?.off(SocketEvent.UNFRIEND);
		};
	}, [socket]);

	const joinRoom = (roomId: string) => {
		socket?.emit(
			SocketEvent.JOIN_MULTIPLAYER_ROOM,
			roomId,
			(resp: Response) => {
				if (resp.status === 'error') {
					Alert.alert({
						title: 'Error',
						description: resp.message,
						positiveBtnTitle: 'OK'
					});
				}
			}
		);
	};

	return <>{children}</>;
};

export { SplashScreen };
