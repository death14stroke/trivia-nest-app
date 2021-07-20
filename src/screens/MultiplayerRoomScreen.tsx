import React, { FC, useState, useEffect, useContext, useReducer } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { Text, Theme, useTheme } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import _ from 'lodash';
import { RootStackParamList } from '@app/navigation';
import { FontFamily } from '@app/theme';
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

type State = {
	roomId?: string;
	ownerId?: string;
	players: Player[];
	roomInvites: Set<string>;
};

type Action = {
	type:
		| 'fetch_room'
		| 'add_player'
		| 'remove_player'
		| 'add_invite'
		| 'remove_invite';
	payload?: any;
};

const INITIAL_STATE: State = { players: [], roomInvites: new Set() };

const roomReducer = (state: State, action: Action): State => {
	switch (action.type) {
		case 'fetch_room':
			const { roomId, ownerId, players } = action.payload;
			return { ...state, roomId, ownerId, players };
		case 'add_player':
			return {
				...state,
				players: _.uniqBy([...state.players, action.payload], '_id')
			};
		case 'remove_player':
			return {
				...state,
				players: state.players.filter(p => p._id !== action.payload)
			};
		case 'add_invite':
			state.roomInvites.add(action.payload);
			return { ...state };
		case 'remove_invite':
			state.roomInvites.delete(action.payload);
			return { ...state };
		default:
			return state;
	}
};

//TODO: cleanup all socket events on destroy
const MultiplayerRoomScreen: FC<Props> = ({ navigation, route }) => {
	const { state: currentUser } = useContext(ProfileContext);
	const socket = useContext(SocketContext);
	const styles = useStyles(useTheme().theme);
	const { params } = route;

	const [loading, setLoading] = useState(true);
	const [open, setOpen] = useState(false);

	//TODO: use reducer for these 4 fields
	const [state, dispatch] = useReducer(roomReducer, INITIAL_STATE);
	const { roomId, ownerId, players, roomInvites } = state;

	const toggleOpen = () => setOpen(!open);

	useEffect(() => {
		if (params?.roomId) {
			socket?.emit(SocketEvent.ROOM_INFO, params.roomId);

			socket?.on(SocketEvent.ROOM_INFO, ({ ownerId, players }) => {
				dispatch({
					type: 'fetch_room',
					payload: { roomId, ownerId, players }
				});
				setLoading(false);
			});
		} else {
			socket?.emit(SocketEvent.CREATE_MULTIPLAYER_ROOM);

			socket?.on(SocketEvent.CREATE_MULTIPLAYER_ROOM, roomId => {
				dispatch({
					type: 'fetch_room',
					payload: { roomId, ownerId: currentUser._id, players: [] }
				});
				setLoading(false);
			});
		}

		socket?.on(SocketEvent.JOIN_MULTIPLAYER_ROOM_ALERT, player => {
			console.log(
				`${player.username} joined the room: currentUser: ${currentUser.username}`
			);
			showToast(`${player.username} has joined the room!`);
			dispatch({ type: 'add_player', payload: player });
		});

		socket?.on(SocketEvent.LEAVE_MULTIPLAYER_ROOM_ALERT, player => {
			showToast(`${player.username} has left the room!`);
			dispatch({ type: 'remove_player', payload: player._id });
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
		dispatch({ type: 'add_invite', payload: friendId });

		setTimeout(() => {
			dispatch({ type: 'remove_invite', payload: friendId });
		}, 10000);
	};

	const startGame = () => {
		socket?.emit(SocketEvent.STARTING, roomId);
		navigation.replace('Quiz');
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
