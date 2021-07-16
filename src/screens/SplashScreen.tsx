import { SocketContext } from '@app/context';
import { SocketEvent } from '@app/models';
import { useNavigation } from '@react-navigation/core';
import React, { FC } from 'react';
import { useEffect } from 'react';
import { useContext } from 'react';
import { Alert } from 'react-native';

const SplashScreen: FC = ({ children }) => {
	const navigation = useNavigation();
	const socket = useContext(SocketContext);

	useEffect(() => {
		socket?.on(
			SocketEvent.INVITE_MULTIPLAYER_ROOM,
			({ roomId, ownerId }) => {
				Alert.alert('Room invite', `${ownerId} invited to his room`, [
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
			console.log('joined room from invite');
			navigation.navigate('Multiplayer', roomId);
		});
	}, [socket]);

	const joinRoom = (roomId: string) => {
		socket?.emit(SocketEvent.JOIN_MULTIPLAYER_ROOM, roomId);
	};

	return <>{children}</>;
};

export { SplashScreen };
