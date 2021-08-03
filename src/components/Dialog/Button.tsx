import React, { FC, memo } from 'react';
import { StyleSheet } from 'react-native';
import { FontFamily } from '@app/theme';
import { Button as CustomButton } from '../Button';

interface Props {
	title: string;
	onPress?: () => void;
}

const Button: FC<Props> = ({ title, onPress }) => {
	return (
		<CustomButton.Text
			key={title}
			title={title}
			titleStyle={styles.buttonTitle}
			containerStyle={styles.container}
			onPress={onPress}
		/>
	);
};

const styles = StyleSheet.create({
	container: { flex: 1, borderRadius: 0 },
	buttonTitle: { fontFamily: FontFamily.Bold }
});

export default memo(
	Button,
	(prevProps, nextProps) =>
		prevProps.title === nextProps.title &&
		prevProps.onPress === nextProps.onPress
);
