import React, { FC, memo } from 'react';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native-elements';
import { FontFamily } from '@app/theme';

interface Props {
	children: string;
}

const Title: FC<Props> = ({ children }) => {
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

export default memo(
	Title,
	(prevProps, nextProps) => prevProps.children === nextProps.children
);
