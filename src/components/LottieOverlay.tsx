import React, { FC } from 'react';
import { StyleSheet } from 'react-native';
import { Overlay } from 'react-native-elements';
import LottieView from 'lottie-react-native';

interface Props {
	isVisible: boolean;
	source: string;
}

const LottieOverlay: FC<Props> = ({ source, isVisible }) => {
	return (
		<Overlay isVisible={isVisible} overlayStyle={styles.lottieOverlay}>
			<LottieView
				autoPlay
				source={source}
				duration={1000}
				style={styles.lottie}
			/>
		</Overlay>
	);
};

const styles = StyleSheet.create({
	lottieOverlay: {
		backgroundColor: 'transparent',
		flex: 1,
		justifyContent: 'center'
	},
	lottie: { width: '75%', aspectRatio: 1 }
});

export { LottieOverlay };
