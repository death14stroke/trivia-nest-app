import React, { FC, memo, ReactElement, ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-elements';
import { FontFamily } from '@app/theme';

interface Props {
	icon?: ReactElement | ReactNode;
	title: string;
	isFocused?: boolean;
}

const BottomMenuItem: FC<Props> = ({ icon, title, isFocused = false }) => {
	return (
		<View style={styles.container}>
			{icon}
			{isFocused && <Text style={styles.label}>{title}</Text>}
		</View>
	);
};

const styles = StyleSheet.create({
	container: { alignItems: 'center' },
	label: { fontSize: 18, fontFamily: FontFamily.Bold, marginTop: 4 }
});

export default memo(
	BottomMenuItem,
	(prevProps, nextProps) => prevProps.isFocused === nextProps.isFocused
);
