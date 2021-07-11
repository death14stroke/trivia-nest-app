import { Dimens } from '@app/theme';
import React, { FC } from 'react';
import { StyleSheet } from 'react-native';
import { Button, ButtonProps } from 'react-native-elements';

type Props = ButtonProps;

const SolidButton: FC<Props> = ({ buttonStyle, containerStyle, ...props }) => {
	return (
		<Button
			type='solid'
			buttonStyle={[styles.button, buttonStyle]}
			containerStyle={[styles.button, containerStyle]}
			{...props}
		/>
	);
};

const styles = StyleSheet.create({
	button: {
		borderRadius: Dimens.borderRadius
	}
});

export { SolidButton };
