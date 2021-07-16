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

const PAGE_SIZE = 10;

interface Props {
	navigation: StackNavigationProp<RootStackParamList, 'Multiplayer'>;
}

// TODO: update friend online status real time
const MultiplayerRoomScreen: FC<Props> = ({ navigation }) => {
	const {
		state: { friends }
	} = useContext(ProfileContext);
	const socket = useContext(SocketContext);
	const { theme } = useTheme();
	const styles = useStyles(theme);
	const { colors } = theme;

	const [timer, setTimer] = useState(true);
	const [roomId, setRoomId] = useState<string>();

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
		init();
		return leaveRoom;
	}, []);

	const init = async () => {
		socket?.emit(SocketEvent.CREATE_MULTIPLAYER_ROOM);

		socket?.on(SocketEvent.CREATE_MULTIPLAYER_ROOM, roomId => {
			console.log('room created:', roomId);
			setRoomId(roomId);
			setTimer(false);
		});

		socket?.on(SocketEvent.JOIN_MULTIPLAYER_ROOM_ALERT, friendId => {
			showToast(`${friendId} has joined the room!`);
		});
	};

	const leaveRoom = () => {
		socket?.emit(SocketEvent.LEAVE_MULTIPLAYER_ROOM, roomId);
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
					<Icon
						type='ionicon'
						name='add-circle-outline'
						color='white'
						onPress={() => {
							socket?.emit(SocketEvent.INVITE_MULTIPLAYER_ROOM, {
								roomId,
								friendId: _id
							});
						}}
					/>
				</View>
			</View>
		);
	};

	if (timer) {
		return <WaitingTimer />;
	}

	const friendsList = _.flatten(data?.pages);

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
				<View style={{ marginHorizontal: '25%' }}>
					<Button.Raised>
						<Text h4 h4Style={{ fontWeight: 'bold' }}>
							Start
						</Text>
					</Button.Raised>
				</View>
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
