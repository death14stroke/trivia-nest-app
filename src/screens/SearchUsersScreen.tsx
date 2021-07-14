import { BASE_URL } from '@app/api/client';
import {
	apiAcceptRequest,
	apiSearchUsers,
	apiSendRequest,
	apiUnfriendUser
} from '@app/api/users';
import { SearchBar } from '@app/components';
import { ProfileContext } from '@app/context';
import { Player } from '@app/models';
import _ from 'lodash';
import React, { FC, useState } from 'react';
import { useContext } from 'react';
import { FlatList, ListRenderItem, View } from 'react-native';
import { Avatar, Text, Icon, useTheme } from 'react-native-elements';
import { Button } from 'react-native-elements/dist/buttons/Button';
import { useInfiniteQuery, useMutation } from 'react-query';
import { useDebounce } from 'use-debounce/lib';

const PAGE_SIZE = 10;

const SearchUsersScreen: FC = () => {
	const {
		theme: { colors }
	} = useTheme();
	const {
		state,
		actions: {
			addFriendRequest,
			undoAddFriendRequest,
			acceptInvite,
			undoAcceptInvite,
			unfriend,
			undoUnfriend
		}
	} = useContext(ProfileContext);
	const { friends, invites, requests } = state!;

	const [rawQuery, setRawQuery] = useState('');
	const [query] = useDebounce(rawQuery, 1000);

	const { data, isLoading, fetchNextPage } = useInfiniteQuery<Player[]>(
		['users', query],
		async ({ pageParam }) => {
			const { data } = await apiSearchUsers(query, PAGE_SIZE, pageParam);
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

	const { mutate: sendFriendRequest } = useMutation<unknown, unknown, string>(
		apiSendRequest,
		{
			onMutate: addFriendRequest,
			onError: (err, friendId) => {
				console.error(err);
				undoAddFriendRequest(friendId);
			}
		}
	);

	const { mutate: acceptFriendRequest } = useMutation<
		unknown,
		unknown,
		string
	>(apiAcceptRequest, {
		onMutate: acceptInvite,
		onError: (_err, friendId) => undoAcceptInvite(friendId)
	});

	const { mutate: unfriendUser } = useMutation<unknown, unknown, string>(
		apiUnfriendUser,
		{
			onMutate: unfriend,
			onError: (_err, friendId) => undoUnfriend(friendId)
		}
	);

	const renderPlayerCard: ListRenderItem<Player> = ({ item }) => {
		const { username, avatar, level, _id } = item;

		const friendsIcon = () => {
			if (friends.has(_id)) {
				return (
					<Button
						type='outline'
						title='Unfriend'
						onPress={() => unfriendUser(_id)}
					/>
				);
			} else if (invites.has(_id)) {
				return (
					<Button
						type='outline'
						title='Accept'
						onPress={() => acceptFriendRequest(_id)}
					/>
				);
			} else if (requests.has(_id)) {
				return <Button type='outline' title='Sent' disabled />;
			} else {
				return (
					<Button
						type='outline'
						title='Send request'
						onPress={() => sendFriendRequest(_id)}
					/>
				);
			}
		};

		return (
			<View
				style={{
					flexDirection: 'row',
					backgroundColor: colors?.grey0,
					padding: 8,
					borderRadius: 12,
					borderWidth: 0.5,
					overflow: 'hidden',
					marginHorizontal: 4,
					marginVertical: 4,
					alignItems: 'center',
					flex: 1
				}}>
				<Avatar
					size='small'
					rounded
					source={{ uri: BASE_URL + avatar }}
				/>
				<View style={{ marginStart: 4, flex: 1 }}>
					<Text
						style={{
							fontWeight: 'bold',
							color: colors?.secondary
						}}>
						{username}
					</Text>
					<Text style={{ fontSize: 10, color: colors?.grey3 }}>
						{level}
					</Text>
				</View>
				{friendsIcon()}
			</View>
		);
	};

	const players = _.flatten(data?.pages);

	return (
		<View style={{ flex: 1 }}>
			<SearchBar
				placeholder='Search ShareNotes'
				value={rawQuery}
				onChangeText={setRawQuery}
				autoCapitalize='none'
				autoCompleteType='off'
				containerStyle={{ marginTop: 16 }}
			/>
			<FlatList
				data={players}
				keyExtractor={player => player._id}
				renderItem={renderPlayerCard}
				style={{ flex: 1 }}
				onEndReached={() => {
					if (!isLoading) {
						fetchNextPage();
					}
				}}
			/>
		</View>
	);
};

export { SearchUsersScreen };
