import React, { FC } from 'react';
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
			title={title}
			titleStyle={styles.buttonTitle}
			containerStyle={styles.container}
			buttonStyle={{ borderBottomEndRadius: 16 }}
			onPress={onPress}
		/>
	);
};

const styles = StyleSheet.create({
	container: { flex: 1, borderBottomEndRadius: 16 },
	buttonTitle: { fontFamily: FontFamily.Bold }
});

export { Button };
