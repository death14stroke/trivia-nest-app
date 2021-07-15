import React, { FC, useState, useEffect } from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
import { Text } from 'react-native-elements';
import { Button } from './Button';

interface Props {
	onCancel?: () => void;
}

const WaitingTimer: FC<Props> = ({ onCancel }) => {
	const [time, setTime] = useState(0);

	useEffect(() => {
		const timer = setInterval(() => {
			setTime(prevTime => prevTime + 1);
		}, 1000);

		return () => {
			clearInterval(timer);
		};
	}, []);

	return (
		<ImageBackground
			style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 12 }}
			source={require('@assets/background.jpg')}>
			<Text h2 h2Style={styles.text}>
				Searching Opponent...
			</Text>
			<Text h1 h1Style={styles.timer}>
				{time}
			</Text>
			<Button.Raised onPress={onCancel}>
				<Text style={{ fontSize: 24 }}>Cancel</Text>
			</Button.Raised>
		</ImageBackground>
	);
};

const styles = StyleSheet.create({
	timer: {
		textAlign: 'center',
		marginTop: 16,
		marginBottom: 48,
		fontWeight: 'bold'
	},
	text: { textAlign: 'center', fontWeight: '500' }
});

export { WaitingTimer };
