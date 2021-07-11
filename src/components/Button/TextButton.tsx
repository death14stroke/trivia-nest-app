import { Dimens } from '@app/theme';
import React, { FC } from 'react';
import { StyleSheet } from 'react-native';
import { Button, ButtonProps, Theme, useTheme } from 'react-native-elements';

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
		title: {
			color: colors?.primary
		}
	});

export { TextButton };
