import React, { FC, useState, useContext } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { Text, Theme, useTheme } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RNToasty } from 'react-native-toasty';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import _ from 'lodash';
import { RootStackParamList } from '@app/navigation';
import { FontFamily } from '@app/theme';
import { ProfileContext } from '@app/context';
import { Player } from '@app/models';
import {
	Button,
	InviteFriendsModal,
	Loading,
	RoomMember
} from '@app/components';
import { useSockets } from './socket';

interface Props {
	navigation: StackNavigationProp<RootStackParamList, 'Multiplayer'>;
	route: RouteProp<RootStackParamList, 'Multiplayer'>;
}

//TODO: onBackpress show alert to leave room
const MultiplayerRoomScreen: FC<Props> = ({ navigation, route }) => {
	const styles = useStyles(useTheme().theme);
	const { state, loading, sendInvite, startGame } = useSockets(
		navigation,
		route.params?.roomId,
		{
			onJoinRoom: (username: string) =>
				RNToasty.Info({
					title: `${username} joined`,
					duration: 1,
					withIcon: false,
					fontFamily: FontFamily.Bold
				}),
			onLeaveRoom: (username: string) =>
				RNToasty.Error({
					title: `${username} left`,
					duration: 1,
					withIcon: false,
					fontFamily: FontFamily.Bold
				})
		}
	);
	const { state: currentUser } = useContext(ProfileContext);
	const [open, setOpen] = useState(false);

	const toggleOpen = () => setOpen(!open);

	const renderMember = (player: Player | undefined) => (
		<RoomMember
			player={player}
			currentUserId={currentUser._id!}
			ownerId={ownerId}
			onInvitePress={toggleOpen}
		/>
	);

	if (loading) {
		return <Loading message='Creating room...' />;
	}

	const { ownerId, players, roomInvites } = state;
	const playerUser: Player = {
		_id: currentUser._id!,
		avatar: currentUser.avatar!,
		username: currentUser.username!,
		level: currentUser.level!
	};
	const playersList = players.filter(p => p._id !== currentUser._id);

	return (
		<ImageBackground
			source={require('@assets/background.jpg')}
			style={{ flex: 1 }}>
			<SafeAreaView style={{ flex: 1 }}>
				<View style={{ flex: 0.2, justifyContent: 'center' }}>
					<Text h3 h3Style={{ textAlign: 'center' }}>
						Challenge your friends!
					</Text>
				</View>
				<View style={{ flex: 0.6, justifyContent: 'center' }}>
					<View style={{ flexDirection: 'row', marginBottom: 16 }}>
						{renderMember(playerUser!)}
						{renderMember(playersList[0])}
					</View>
					<View style={{ flexDirection: 'row' }}>
						{renderMember(playersList[1])}
						{renderMember(playersList[2])}
					</View>
				</View>
				{ownerId === currentUser._id && playersList.length > 0 && (
					<View style={styles.buttonContainer}>
						<Button.Raised onPress={startGame}>
							<Text h4 h4Style={{ fontFamily: FontFamily.Bold }}>
								Start
							</Text>
						</Button.Raised>
					</View>
				)}
				<InviteFriendsModal
					open={open}
					roomInvites={roomInvites}
					roomMembers={playersList.map(p => p._id)}
					onBackdropPress={toggleOpen}
					onInviteFriend={friendId => {
						toggleOpen();
						sendInvite(friendId);
					}}
				/>
			</SafeAreaView>
		</ImageBackground>
	);
};

const useStyles = ({ colors }: Theme) =>
	StyleSheet.create({
		badge: {
			bottom: 4,
			right: 2,
			position: 'absolute',
			height: 14,
			aspectRatio: 1,
			borderRadius: 100,
			borderColor: 'gold',
			borderWidth: 0.3
		},
		badgeOnline: { backgroundColor: colors?.success },
		badgeBusy: { backgroundColor: 'orange' },
		badgeOffline: {
			borderColor: colors?.disabled,
			backgroundColor: colors?.grey5,
			borderWidth: 0.5
		},
		buttonContainer: {
			flex: 0.2,
			marginHorizontal: '25%',
			justifyContent: 'center'
		}
	});

export { MultiplayerRoomScreen };
