import React, { FC, memo } from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
import { Text } from 'react-native-elements';
import LottieView from 'lottie-react-native';

interface Props {
	message?: string;
}

const Loading: FC<Props> = ({ message }) => {
	return (
		<ImageBackground
			source={require('@assets/background.jpg')}
			style={styles.root}>
			<LottieView
				autoPlay
				source={require('@assets/inviteTimer.json')}
				style={styles.lottie}
			/>
			<Text h2>{message}</Text>
		</ImageBackground>
	);
};

const styles = StyleSheet.create({
	root: { flex: 1, justifyContent: 'center', alignItems: 'center' },
	lottie: { height: 200, aspectRatio: 1 }
});

export default memo(Loading);
