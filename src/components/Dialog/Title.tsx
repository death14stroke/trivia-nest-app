import React, { FC } from 'react';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native-elements';
import { FontFamily } from '@app/theme';

const Title: FC = ({ children }) => {
	return <Text style={styles.text}>{children}</Text>;
};

Title.displayName = 'DialogTitle';

const styles = StyleSheet.create({
	text: {
		color: 'black',
		textAlign: 'center',
		fontSize: 20,
		padding: 8,
		fontFamily: FontFamily.Bold
	}
});

export { Title };
