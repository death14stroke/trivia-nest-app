import { BASE_URL } from '@app/api/client';
import { WaitingTimer } from '@app/components';
import { useCurrentUser } from '@app/hooks/firebase';
import { showToast } from '@app/hooks/ui';
import { RootStackParamList } from '@app/navigation';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { FC, useEffect, useRef } from 'react';
import { useState } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-elements';
import { Socket, io } from 'socket.io-client';

interface Props {
	navigation: StackNavigationProp<RootStackParamList, 'OneVsOne'>;
}

const OneVsOneScreen: FC<Props> = ({ navigation }) => {
	const [loading, setLoading] = useState(true);
	const socket = useRef<Socket>();

	useEffect(() => {
		init();

		return leaveRoom;
	}, []);

	const init = async () => {
		const token = await useCurrentUser()?.getIdToken();
		if (!token) {
			showToast('Could not connect to game server!');
			return;
		}

		socket.current = io(BASE_URL, { auth: { token } });
		socket.current.emit('joinWaitingRoom');

		socket.current.on('start', data => {
			console.log('data:', data);
			setLoading(false);
		});
	};

	const leaveRoom = () => {
		socket.current?.disconnect();
	};

	const onCancel = () => {
		leaveRoom();
		navigation.pop();
	};

	if (loading) {
		return <WaitingTimer onCancel={onCancel} />;
	}

	return (
		<View>
			<Text style={{ color: 'white' }}>OneVsOne</Text>
		</View>
	);
};

export { OneVsOneScreen };
