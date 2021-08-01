import React, { FC } from 'react';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native-elements';
import { FontFamily } from '@app/theme';

const Description: FC = ({ children }) => {
	return <Text style={styles.text}>{children}</Text>;
};

const styles = StyleSheet.create({
	text: {
		textAlign: 'center',
		fontFamily: FontFamily.Regular
	}
});

export { Description };
