import { BASE_URL } from '@app/api/client';
import { apiGetFriends } from '@app/api/users';
import { Button, WaitingTimer } from '@app/components';
import { useCurrentUser } from '@app/hooks/firebase';
import { showToast } from '@app/hooks/ui';
import { Player } from '@app/models';
import { RootStackParamList } from '@app/navigation';
import { StackNavigationProp } from '@react-navigation/stack';
import _ from 'lodash';
import React, { FC, useEffect, useRef } from 'react';
import { useState } from 'react';
import {
	FlatList,
	ImageBackground,
	ListRenderItem,
	StyleSheet,
	View,
	ViewStyle
} from 'react-native';
import { Text, Theme, useTheme } from 'react-native-elements';
import { Avatar } from 'react-native-elements/dist/avatar/Avatar';
import { Badge } from 'react-native-elements/dist/badge/Badge';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useInfiniteQuery } from 'react-query';
import { io, Socket } from 'socket.io-client';

const PAGE_SIZE = 10;

interface Props {
	navigation: StackNavigationProp<RootStackParamList, 'Multiplayer'>;
}

const MultiplayerRoomScreen: FC<Props> = ({ navigation }) => {
	const socket = useRef<Socket>();
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
		const token = await useCurrentUser()?.getIdToken();
		if (!token) {
			showToast('Could not connect to game server!');
			navigation.pop();
			return;
		}

		socket.current = io(BASE_URL, { auth: { token } });
		socket.current.emit('createRoom');

		socket.current.on('createRoom', roomId => {
			console.log('room created:', roomId);
			setRoomId(roomId);
			setTimer(false);
		});

		socket.current.on('joinRoomAlert', friendId => {
			showToast(`${friendId} has joined the room!`);
		});
	};

	const leaveRoom = () => {
		socket.current?.disconnect();
	};

	const renderFriendCard: ListRenderItem<Player> = ({ item }) => {
		const { _id, username, avatar, status } = item;

		let badgeStyle: ViewStyle = styles.badgeOffline;
		if (status === 2) {
			badgeStyle = styles.badgeOnline;
		} else {
			badgeStyle = styles.badgeBusy;
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
							socket.current?.emit('inviteRoom', {
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

	const friends = _.flatten(data?.pages);

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
						data={friends}
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
			borderWidth: 1
		}
	});

export { MultiplayerRoomScreen };
