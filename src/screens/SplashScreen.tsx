import React, { FC, useEffect, useContext } from 'react';
import { Alert } from 'react-native';
import { useQueryClient } from 'react-query';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ProfileContext, SocketContext } from '@app/context';
import { SocketEvent } from '@app/models';

const SplashScreen: FC = ({ children }) => {
	const navigation = useNavigation();
	const route = useRoute();
	const queryClient = useQueryClient();
	const socket = useContext(SocketContext);
	const {
		actions: { updateUserStatus }
	} = useContext(ProfileContext);

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

		socket?.on(SocketEvent.FRIEND_REQUEST, () => {
			queryClient.invalidateQueries('invites');
		});

		socket?.on(SocketEvent.FRIEND_ADDED, () => {
			queryClient.invalidateQueries('friends');
		});
	}, [socket]);

	const joinRoom = (roomId: string) => {
		socket?.emit(SocketEvent.JOIN_MULTIPLAYER_ROOM, roomId);
	};

	return <>{children}</>;
};

export { SplashScreen };
