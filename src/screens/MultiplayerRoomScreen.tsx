import React, { FC, useState, useEffect, useContext } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { Text, Theme, useTheme } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import _ from 'lodash';
import { RootStackParamList } from '@app/navigation';
import { ProfileContext, SocketContext } from '@app/context';
import { Player, SocketEvent } from '@app/models';
import { showToast } from '@app/hooks/ui';
import {
	Button,
	InviteFriendsModal,
	Loading,
	RoomMember
} from '@app/components';

interface Props {
	navigation: StackNavigationProp<RootStackParamList, 'Multiplayer'>;
	route: RouteProp<RootStackParamList, 'Multiplayer'>;
}

//TODO: navigate here on 'STARTING' event. Send 'READY' event in useeffect and wait for 'START' from server. On server set a timeout if all players ready in time like 5 sec
//TODO: player joined popup coming twice
const MultiplayerRoomScreen: FC<Props> = ({ navigation, route }) => {
	const { state: currentUser } = useContext(ProfileContext);
	const socket = useContext(SocketContext);
	const styles = useStyles(useTheme().theme);
	const { params } = route;

	const [loading, setLoading] = useState(true);
	const [roomId, setRoomId] = useState<string>();
	const [ownerId, setOwnerId] = useState<string>();
	const [players, setPlayers] = useState<Player[]>([]);
	const [roomInvites, setRoomInvites] = useState<Set<string>>(new Set());
	const [open, setOpen] = useState(false);

	const toggleOpen = () => setOpen(!open);

	useEffect(() => {
		if (params?.roomId) {
			socket?.emit(SocketEvent.ROOM_INFO, params.roomId);

			socket?.on(SocketEvent.ROOM_INFO, ({ ownerId, players }) => {
				setRoomId(roomId);
				setOwnerId(ownerId);
				setPlayers(players);
				setLoading(false);
			});
		} else {
			socket?.emit(SocketEvent.CREATE_MULTIPLAYER_ROOM);

			socket?.on(SocketEvent.CREATE_MULTIPLAYER_ROOM, roomId => {
				console.log('room created:', roomId);
				setRoomId(roomId);
				setOwnerId(currentUser._id);
				setLoading(false);
			});
		}

		socket?.on(SocketEvent.JOIN_MULTIPLAYER_ROOM_ALERT, player => {
			showToast(`${player.username} has joined the room!`);
			setPlayers([...players, player]);
		});

		socket?.on(SocketEvent.LEAVE_MULTIPLAYER_ROOM_ALERT, player => {
			showToast(`${player.username} has left the room!`);
			setPlayers(players.filter(p => p._id !== player._id));
		});

		socket?.once(SocketEvent.STARTING, () => {
			socket.off(SocketEvent.LEAVE_MULTIPLAYER_ROOM_ALERT);
			navigation.navigate('Quiz');
		});

		return leaveRoom;
	}, []);

	const leaveRoom = () => {
		socket?.emit(SocketEvent.LEAVE_MULTIPLAYER_ROOM);
	};

	const sendInvite = (friendId: string) => {
		socket?.emit(SocketEvent.INVITE_MULTIPLAYER_ROOM, {
			roomId,
			friendId
		});
		roomInvites.add(friendId);
		setRoomInvites(new Set(roomInvites));
		setTimeout(() => {
			roomInvites.delete(friendId);
			setRoomInvites(new Set(roomInvites));
		}, 10000);
	};

	const startGame = () => {
		socket?.emit(SocketEvent.STARTING, roomId);
	};

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
							<Text h4 h4Style={{ fontWeight: 'bold' }}>
								Start
							</Text>
						</Button.Raised>
					</View>
				)}
				<InviteFriendsModal
					open={open}
					roomInvites={roomInvites}
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
		badgeOnline: {
			backgroundColor: colors?.success
		},
		badgeBusy: {
			backgroundColor: 'orange'
		},
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
