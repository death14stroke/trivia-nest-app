import React, { FC, memo } from 'react';
import { StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

const LoadingFooterView: FC = () => {
	return (
		<LottieView
			autoPlay
			source={require('@assets/inviteTimer.json')}
			style={styles.footer}
		/>
	);
};

const styles = StyleSheet.create({
	footer: { height: 50, aspectRatio: 1, alignSelf: 'center' }
});

export default memo(LoadingFooterView);
