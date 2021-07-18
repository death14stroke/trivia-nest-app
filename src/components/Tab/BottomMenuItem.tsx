import React, { FC, useEffect, ReactElement, ReactNode } from 'react';
import {
	View,
	StyleSheet,
	Platform,
	UIManager,
	LayoutAnimation
} from 'react-native';
import { Text } from 'react-native-elements';
import { FontFamily } from '@app/theme';

interface Props {
	icon?: ReactElement | ReactNode;
	title: string;
	isFocused?: boolean;
}

//TODO: use Animated api to prevent global animation first time
if (Platform.OS === 'android') {
	if (UIManager.setLayoutAnimationEnabledExperimental) {
		UIManager.setLayoutAnimationEnabledExperimental(true);
	}
}

const BottomMenuItem: FC<Props> = ({ icon, title, isFocused = false }) => {
	useEffect(() => {
		LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
	}, [isFocused]);

	return (
		<View style={styles.container}>
			{icon}
			{isFocused && <Text style={styles.label}>{title}</Text>}
		</View>
	);
};

const styles = StyleSheet.create({
	container: { alignItems: 'center' },
	label: {
		fontSize: 18,
		fontFamily: FontFamily.Bold,
		marginTop: 4
	}
});

export default BottomMenuItem;
