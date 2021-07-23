import React, { FC, useEffect, useContext } from 'react';
import { Alert } from 'react-native';
import { useQueryClient } from 'react-query';
import { useNavigation } from '@react-navigation/core';
import { ProfileContext, SocketContext } from '@app/context';
import { SocketEvent } from '@app/models';

const SplashScreen: FC = ({ children }) => {
	const navigation = useNavigation();
	const queryClient = useQueryClient();
	const socket = useContext(SocketContext);
	const {
		actions: { updateUserStatus }
	} = useContext(ProfileContext);

	useEffect(() => {
		socket?.on(SocketEvent.USER_UPDATE, ({ uid, status }) => {
			updateUserStatus(uid, status);
		});

		socket?.on(SocketEvent.INVITE_MULTIPLAYER_ROOM, ({ roomId, owner }) => {
			Alert.alert(
				'Room invite',
				`${owner.username} invited to his room`,
				[
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
				]
			);
		});

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
