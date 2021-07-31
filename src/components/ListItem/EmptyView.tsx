import React, { FC, memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-elements';
import { FontFamily } from '@app/theme';

interface Props {
	message: string;
	color?: string;
}

const EmptyView: FC<Props> = ({ message, color }) => {
	return (
		<View style={styles.root}>
			<Text h3 h3Style={[styles.empty, color ? { color } : {}]}>
				{message}
			</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	root: { flex: 1, justifyContent: 'center', alignItems: 'center' },
	empty: { fontFamily: FontFamily.Bold }
});

export default memo(EmptyView);
