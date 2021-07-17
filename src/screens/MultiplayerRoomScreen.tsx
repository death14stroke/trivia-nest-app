import React, { FC, useState, useEffect, useContext } from 'react';
import {
	FlatList,
	ImageBackground,
	ListRenderItem,
	StyleSheet,
	View,
	ViewStyle
} from 'react-native';
import {
	Text,
	Avatar,
	Badge,
	Icon,
	Theme,
	useTheme
} from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { useInfiniteQuery } from 'react-query';
import _ from 'lodash';
import { RootStackParamList } from '@app/navigation';
import { ProfileContext, SocketContext } from '@app/context';
import { Player, SocketEvent, UserStatus } from '@app/models';
import { BASE_URL } from '@app/api/client';
import { apiGetFriends } from '@app/api/users';
import { showToast } from '@app/hooks/ui';
import { Button, WaitingTimer } from '@app/components';
import { RouteProp } from '@react-navigation/native';

const PAGE_SIZE = 10;

interface Props {
	navigation: StackNavigationProp<RootStackParamList, 'Multiplayer'>;
	route: RouteProp<RootStackParamList, 'Multiplayer'>;
}

//TODO: navigate here on 'STARTING' event. Send 'READY' event in useeffect and wait for 'START' from server. On server set a timeout if all players ready in time like 5 sec
const MultiplayerRoomScreen: FC<Props> = ({ navigation, route }) => {
	const { state: currentUser } = useContext(ProfileContext);
	const socket = useContext(SocketContext);
	const { theme } = useTheme();
	const styles = useStyles(theme);
	const { colors } = theme;
	const params = route.params;
	const [timer, setTimer] = useState(true);
	const [roomId, setRoomId] = useState<string>();
	const [ownerId, setOwnerId] = useState<string>();
	const [players, setPlayers] = useState<Player[]>([]);
	const [roomInvites, setRoomInvites] = useState<string[]>([]);
	const { friends, _id } = currentUser;

	const { data, isLoading, fetchNextPage } = useInfiniteQuery<Player[]>(
		'friends',
		async ({ pageParam }) => {
			const { data } = await apiGetFriends(PAGE_SIZE, pageParam);
			return data;
		},
		{
			staleTime: 5 * 60 * 1000,
			getNextPageParam: lastPage =>
				lastPage.length === PAGE_SIZE
					? lastPage[lastPage.length - 1]
					: undefined
		}
	);

	useEffect(() => {
		if (params?.roomId) {
			socket?.emit(SocketEvent.ROOM_INFO, params.roomId);

			socket?.on(SocketEvent.ROOM_INFO, ({ ownerId, players }) => {
				setRoomId(roomId);
				setOwnerId(ownerId);
				setPlayers(players);
				setTimer(false);
			});
		} else {
			socket?.emit(SocketEvent.CREATE_MULTIPLAYER_ROOM);

			socket?.on(SocketEvent.CREATE_MULTIPLAYER_ROOM, roomId => {
				console.log('room created:', roomId);
				setRoomId(roomId);
				setOwnerId(_id);
				setTimer(false);
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
		setRoomInvites([...roomInvites, friendId]);
		setTimeout(() => {
			setRoomInvites(roomInvites.filter(id => id !== friendId));
		}, 10000);
	};

	const startGame = () => {
		socket?.emit(SocketEvent.STARTING, roomId);
	};

	const renderFriendCard: ListRenderItem<Player> = ({ item }) => {
		const { _id, username, avatar, status: playerStatus } = item;
		const status = friends.get(_id) ?? playerStatus;

		let badgeStyle: ViewStyle;
		if (status === UserStatus.ONLINE) {
			badgeStyle = styles.badgeOnline;
		} else if (status === UserStatus.BUSY) {
			badgeStyle = styles.badgeBusy;
		} else {
			badgeStyle = styles.badgeOffline;
		}

		return (
			<View
				style={{
					alignItems: 'center',
					backgroundColor: colors?.grey3,
					marginHorizontal: 4,
					padding: 4,
					borderRadius: 12,
					borderWidth: 1,
					borderColor: 'gold'
				}}>
				<View>
					<Avatar
						size='medium'
						rounded
						source={{ uri: BASE_URL + avatar }}
					/>
					<Badge badgeStyle={[styles.badge, badgeStyle]} />
				</View>
				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'space-between'
					}}>
					<Icon
						type='ionicon'
						name='chevron-down-outline'
						color='white'
					/>
					{status === UserStatus.ONLINE &&
						(!roomInvites.includes(_id) ? (
							<Icon
								type='ionicon'
								name='add-circle-outline'
								color='white'
								onPress={() => sendInvite(_id)}
							/>
						) : (
							<Icon
								type='ionicon'
								name='timer-outline'
								color='white'
							/>
						))}
				</View>
			</View>
		);
	};

	const renderMember: ListRenderItem<Player> = ({
		item: { avatar, username, _id }
	}) => {
		return (
			<View style={{ flex: 1, alignItems: 'center' }}>
				<Avatar
					size='xlarge'
					source={{ uri: BASE_URL + avatar }}
					containerStyle={
						_id === currentUser._id
							? { borderColor: 'red', borderWidth: 2 }
							: {}
					}
				/>
				{ownerId === _id && (
					<Icon
						type='ionicon'
						name='alert-circle-outline'
						color='gold'
					/>
				)}
				<Text h4>{username}</Text>
			</View>
		);
	};

	if (timer) {
		return <WaitingTimer />;
	}

	const friendsList = _.flatten(data?.pages);
	const playerUser: Player = {
		_id: currentUser._id!,
		avatar: currentUser.avatar!,
		username: currentUser.username!,
		level: currentUser.level!
	};
	const playersList = players.filter(p => p._id !== _id);

	return (
		<ImageBackground
			source={require('@assets/background.jpg')}
			style={{ flex: 1 }}>
			<SafeAreaView style={{ flex: 1, justifyContent: 'space-between' }}>
				<View>
					<Text style={{ textAlign: 'center', marginVertical: 4 }}>
						Challenge Friends
					</Text>
					<FlatList
						data={friendsList}
						keyExtractor={friend => friend._id}
						renderItem={renderFriendCard}
						horizontal
						onEndReached={() => {
							if (!isLoading) {
								fetchNextPage();
							}
						}}
						style={{ flexGrow: 0 }}
					/>
				</View>
				<FlatList
					data={[playerUser, ...playersList]}
					keyExtractor={player => player._id}
					renderItem={renderMember}
					numColumns={2}
					style={{ flexGrow: 0 }}
					contentContainerStyle={{
						justifyContent: 'space-between'
					}}
				/>
				{ownerId === currentUser._id && (
					<View style={{ marginHorizontal: '25%' }}>
						<Button.Raised onPress={startGame}>
							<Text h4 h4Style={{ fontWeight: 'bold' }}>
								Start
							</Text>
						</Button.Raised>
					</View>
				)}
			</SafeAreaView>
		</ImageBackground>
	);
};

const useStyles = ({ colors }: Theme) =>
	StyleSheet.create({
		badge: {
			bottom: 2,
			right: 0,
			position: 'absolute',
			height: 12,
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
		}
	});

export { MultiplayerRoomScreen };
