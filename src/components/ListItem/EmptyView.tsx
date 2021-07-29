import React, { FC, memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-elements';
import { FontFamily } from '@app/theme';

interface Props {
	message: string;
}

const EmptyView: FC<Props> = ({ message }) => {
	return (
		<View style={styles.root}>
			<Text h3 h3Style={styles.empty}>
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
