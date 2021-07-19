import React, { FC, useContext, useEffect, useState } from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
import { Text } from 'react-native-elements';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@app/navigation';
import { FontFamily } from '@app/theme';
import { SocketContext } from '@app/context';
import { SocketEvent } from '@app/models';
import { Button } from '@app/components';

interface Props {
	navigation: StackNavigationProp<RootStackParamList, 'MatchMaking'>;
}

const MatchMakingScreen: FC<Props> = ({ navigation }) => {
	const socket = useContext(SocketContext);
	const [time, setTime] = useState(0);

	useEffect(() => {
		const timer = setInterval(() => {
			setTime(prevTime => prevTime + 1);
		}, 1000);

		socket?.emit(SocketEvent.JOIN_WAITING_ROOM);

		socket?.once(SocketEvent.STARTING, () => {
			navigation.navigate('Quiz');
		});

		return () => {
			clearInterval(timer);
			leaveRoom();
		};
	}, []);

	const leaveRoom = () => {
		socket?.emit(SocketEvent.LEAVE_WAITING_ROOM);
	};

	const onCancel = () => {
		navigation.pop();
	};

	return (
		<ImageBackground
			style={styles.root}
			source={require('@assets/background.jpg')}>
			<Text h2 h2Style={styles.text}>
				Searching Opponent...
			</Text>
			<Text h1 h1Style={styles.timer}>
				{time}
			</Text>
			<Button.Raised onPress={onCancel}>
				<Text style={{ fontSize: 24, fontFamily: FontFamily.Bold }}>
					Cancel
				</Text>
			</Button.Raised>
		</ImageBackground>
	);
};

const styles = StyleSheet.create({
	root: { flex: 1, justifyContent: 'center', paddingHorizontal: 12 },
	timer: {
		textAlign: 'center',
		marginTop: 16,
		marginBottom: 48,
		fontFamily: FontFamily.Bold
	},
	text: { textAlign: 'center', fontFamily: FontFamily.Regular }
});

export { MatchMakingScreen };
