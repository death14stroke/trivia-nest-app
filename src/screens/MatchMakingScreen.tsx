import React, { FC, useContext, useEffect } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@app/navigation';
import { SocketContext } from '@app/context';
import { SocketEvent } from '@app/models';
import { WaitingTimer } from '@app/components';

interface Props {
	navigation: StackNavigationProp<RootStackParamList, 'MatchMaking'>;
}

const MatchMakingScreen: FC<Props> = ({ navigation }) => {
	const socket = useContext(SocketContext);

	useEffect(() => {
		socket?.emit(SocketEvent.JOIN_WAITING_ROOM);

		socket?.once(SocketEvent.STARTING, () => {
			navigation.navigate('Quiz');
		});

		return leaveRoom;
	}, []);

	const leaveRoom = () => {
		socket?.emit(SocketEvent.LEAVE_WAITING_ROOM);
	};

	const onCancel = () => {
		navigation.pop();
	};

	return <WaitingTimer onCancel={onCancel} />;
};

export { MatchMakingScreen };
