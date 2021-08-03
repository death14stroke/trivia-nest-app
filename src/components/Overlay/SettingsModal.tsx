import React, { FC, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { AlertContext } from '@app/context';
import { signOutUser } from '@app/hooks/auth';
import { Button } from '../Button';
import Dialog from '../Dialog';
import { useNavigation } from '@react-navigation/native';

interface Props {
	open?: boolean;
	onBackdropPress?: () => void;
}

const SettingsModal: FC<Props> = ({ open, onBackdropPress }) => {
	const navigation = useNavigation();
	const Alert = useContext(AlertContext);

	const logout = async () => {
		try {
			signOutUser();
			navigation.reset({ index: 0, routes: [{ name: 'Signup' }] });
		} catch (err) {
			console.error(err);
			Alert.alert({
				title: 'Error',
				description: 'Could not logout'
			});
		}
	};

	return (
		<Dialog.Container
			visible={open}
			onBackdropPress={onBackdropPress}
			style={styles.root}>
			<Dialog.Title showCloseIcon onClose={onBackdropPress}>
				Settings
			</Dialog.Title>
			<View style={styles.buttonContainer}>
				<Button.Raised onPress={logout}>Logout</Button.Raised>
			</View>
		</Dialog.Container>
	);
};

const styles = StyleSheet.create({
	root: { width: '75%', paddingBottom: 12 },
	buttonContainer: { marginHorizontal: 12 }
});

export { SettingsModal };
