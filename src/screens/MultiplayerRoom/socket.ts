import { useContext, useEffect, useReducer, useState } from 'react';
import { Alert } from 'react-native';
import _ from 'lodash';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@app/navigation';
import { ProfileContext, SocketContext } from '@app/context';
import { Player, Response, SocketEvent } from '@app/models';
import { showToast } from '@app/hooks/ui';

type Room = {
	ownerId: string;
	players: Player[];
};

type Callbacks = {
	onJoinRoom?: (username: string) => void;
	onLeaveRoom?: (username: string) => void;
};

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
		| 'remove_invite'
		| 'update_owner';
	payload?: any;
};

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
			state.roomInvites.delete(action.payload);
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
		case 'update_owner':
			return { ...state, ownerId: action.payload };
		default:
			return state;
	}
};

const INITIAL_STATE: State = { players: [], roomInvites: new Set() };
const INVITE_TIMEOUT_MS = 10000;

export const useSockets = (
	navigation: StackNavigationProp<RootStackParamList, 'Multiplayer'>,
	paramsRoomId: string | undefined,
	{ onJoinRoom, onLeaveRoom }: Callbacks
) => {
	const socket = useContext(SocketContext);
	const { state: currentUser } = useContext(ProfileContext);
	const [loading, setLoading] = useState(true);
	const [state, dispatch] = useReducer(roomReducer, INITIAL_STATE);

	useEffect(() => {
		if (paramsRoomId) {
			socket?.emit(
				SocketEvent.ROOM_INFO,
				paramsRoomId,
				({ ownerId, players }: Room) => {
					dispatch({
						type: 'fetch_room',
						payload: { roomId: paramsRoomId, ownerId, players }
					});
					setLoading(false);
				}
			);
		} else {
			socket?.once(
				SocketEvent.CREATE_MULTIPLAYER_ROOM,
				(roomId: string) => {
					dispatch({
						type: 'fetch_room',
						payload: {
							roomId,
							ownerId: currentUser._id,
							players: []
						}
					});
					setLoading(false);
				}
			);
			socket?.emit(
				SocketEvent.CREATE_MULTIPLAYER_ROOM,
				(resp: Response) => {
					if (resp.status === 'error') {
						Alert.alert(resp.message);
					}
				}
			);
		}

		socket?.on(
			SocketEvent.JOIN_MULTIPLAYER_ROOM_ALERT,
			(player: Player) => {
				onJoinRoom?.(player.username);
				dispatch({ type: 'add_player', payload: player });
			}
		);

		socket?.on(
			SocketEvent.LEAVE_MULTIPLAYER_ROOM_ALERT,
			(player: Player) => {
				onLeaveRoom?.(player.username);
				dispatch({ type: 'remove_player', payload: player._id });
			}
		);

		socket?.once(SocketEvent.STARTING, (battleId: string) => {
			socket.off(SocketEvent.LEAVE_MULTIPLAYER_ROOM_ALERT);
			navigation.replace('Quiz', { battleId, type: 'multi' });
		});

		socket?.on(SocketEvent.ROOM_OWNER_UPDATE, ownerId => {
			dispatch({ type: 'update_owner', payload: ownerId });
		});

		return leaveRoom;
	}, []);

	const leaveRoom = () => {
		socket?.emit(SocketEvent.LEAVE_MULTIPLAYER_ROOM);
	};

	const sendInvite = (friendId: string) => {
		socket?.emit(SocketEvent.INVITE_MULTIPLAYER_ROOM, {
			roomId: state.roomId,
			friendId
		});
		dispatch({ type: 'add_invite', payload: friendId });
		setTimeout(() => {
			dispatch({ type: 'remove_invite', payload: friendId });
		}, INVITE_TIMEOUT_MS);
	};

	const startGame = () => {
		socket?.emit(SocketEvent.STARTING, state.roomId);
	};

	return { state, loading, sendInvite, startGame };
};
