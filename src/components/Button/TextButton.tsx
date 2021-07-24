import React, { FC } from 'react';
import { StyleSheet } from 'react-native';
import { Button, ButtonProps, Theme, useTheme } from 'react-native-elements';
import { FontFamily } from '@app/theme';

type Props = ButtonProps;

const TextButton: FC<Props> = ({ titleStyle, ...props }) => {
	const styles = useStyles(useTheme().theme);

	return (
		<Button
			type='clear'
			titleStyle={[styles.title, titleStyle]}
			{...props}
		/>
	);
};

const useStyles = ({ colors }: Theme) =>
	StyleSheet.create({
		title: { fontFamily: FontFamily.SemiBold, color: colors?.primary }
	});

export { TextButton };
