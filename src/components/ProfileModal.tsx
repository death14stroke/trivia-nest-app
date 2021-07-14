import React, { FC } from 'react';
import { Dimensions } from 'react-native';
import { StyleSheet, View } from 'react-native';
import {
	Divider,
	Overlay,
	Text,
	Icon,
	Theme,
	useTheme
} from 'react-native-elements';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { FriendsScreen, HistoryScreen, SearchUsersScreen } from '@app/screens';
import { NavigationContainer } from '@react-navigation/native';

export type ProfileTabParams = {
	Users: undefined;
	Friends: undefined;
	History: undefined;
};

const Tab = createMaterialTopTabNavigator<ProfileTabParams>();

const SCREEN_WIDTH = Dimensions.get('window').width;

interface Props {
	open: boolean;
	onBackdropPress?: () => void;
	onSuccess?: () => void;
	onClose?: () => void;
}

const ProfileModal: FC<Props> = ({ open, onBackdropPress, onClose }) => {
	const styles = useStyles(useTheme().theme);

	return (
		<Overlay
			isVisible={open}
			onBackdropPress={onBackdropPress}
			overlayStyle={styles.overlay}>
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					marginHorizontal: 12
				}}>
				<Text style={styles.header}>Player Profile</Text>
				<Icon
					type='ionicon'
					name='close'
					color='red'
					onPress={onClose}
				/>
			</View>
			<Divider orientation='horizontal' style={{ marginBottom: 8 }} />
			<NavigationContainer independent>
				<Tab.Navigator>
					<Tab.Screen name='Friends' component={FriendsScreen} />
					<Tab.Screen name='Users' component={SearchUsersScreen} />
					<Tab.Screen name='History' component={HistoryScreen} />
				</Tab.Navigator>
			</NavigationContainer>
		</Overlay>
	);
};

const useStyles = ({ colors }: Theme) =>
	StyleSheet.create({
		header: {
			fontSize: 20,
			color: 'black',
			paddingVertical: 8,
			textAlign: 'center',
			fontWeight: 'bold',
			flex: 1
		},
		overlay: {
			padding: 0,
			borderRadius: 8,
			width: SCREEN_WIDTH - 32,
			minHeight: '80%'
		},
		buttonContainer: {
			flexDirection: 'row',
			borderRadius: 8
		}
	});

export { ProfileModal };
