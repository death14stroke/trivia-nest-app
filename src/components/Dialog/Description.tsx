import React, { FC, memo } from 'react';
import { StyleSheet } from 'react-native';
import { Text, Theme, useTheme } from 'react-native-elements';
import { FontFamily } from '@app/theme';

interface Props {
	children: string;
}

const Description: FC<Props> = ({ children }) => {
	const styles = useStyles(useTheme().theme);

	return <Text style={styles.text}>{children}</Text>;
};

Description.displayName = 'DialogDescription';

const useStyles = ({ colors }: Theme) =>
	StyleSheet.create({
		text: {
			textAlign: 'center',
			fontFamily: FontFamily.Regular,
			color: colors?.grey4,
			fontSize: 16
		}
	});

export default memo(
	Description,
	(prevProps, nextProps) => prevProps.children === nextProps.children
);
