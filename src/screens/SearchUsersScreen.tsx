import React, { FC, useState, useContext } from 'react';
import { FlatList, ImageBackground, ListRenderItem } from 'react-native';
import { useInfiniteQuery, useMutation } from 'react-query';
import { useDebounce } from 'use-debounce/lib';
import _ from 'lodash';
import { ProfileContext } from '@app/context';
import { Player } from '@app/models';
import {
	useFriendInviteMutations,
	useSendFriendRequestMutation,
	useUnfriendMutation
} from '@app/hooks/mutations';
import { apiSearchUsers, apiUnfriendUser } from '@app/api/users';
import { FriendsCard, SearchBar } from '@app/components';

const PAGE_SIZE = 10;

const SearchUsersScreen: FC = () => {
	const [acceptFriendRequest] = useFriendInviteMutations({});
	const sendFriendRequest = useSendFriendRequestMutation({});
	const {
		state,
		actions: { unfriend, undoUnfriend }
	} = useContext(ProfileContext);

	const [rawQuery, setRawQuery] = useState('');
	const [query] = useDebounce(rawQuery, 1000);
	const { friends, invites, requests } = state!;

	const { data, isLoading, fetchNextPage } = useInfiniteQuery<Player[]>(
		['users', query],
		async ({ pageParam }) => apiSearchUsers(query, PAGE_SIZE, pageParam),
		{
			enabled: query.length > 0,
			staleTime: 5 * 60 * 1000,
			getNextPageParam: lastPage =>
				lastPage.length === PAGE_SIZE
					? lastPage[lastPage.length - 1]
					: undefined
		}
	);

	const unfriendUser = useUnfriendMutation({});

	const renderPlayerCard: ListRenderItem<Player> = ({ item }) => {
		const { _id } = item;

		let iconType: 'unfriend' | 'invite' | 'accept' | undefined = undefined;
		if (friends.has(_id)) {
			iconType = 'unfriend';
		} else if (invites.has(_id)) {
			iconType = 'accept';
		} else if (requests.has(_id)) {
			iconType = 'invite';
		}

		console.log('friendId:', item._id, iconType);

		return (
			<FriendsCard
				player={item}
				iconType={iconType}
				onUnfriendUser={() => unfriendUser(_id)}
				onAcceptRequest={() => acceptFriendRequest(_id)}
				onSendFriendRequest={() => sendFriendRequest(_id)}
				containerStyle={{ marginVertical: 8 }}
			/>
		);
	};

	const players = _.flatten(data?.pages);

	return (
		<ImageBackground
			source={require('@assets/background.jpg')}
			style={{ flex: 1 }}>
			<SearchBar
				placeholder='Search users'
				value={rawQuery}
				onChangeText={setRawQuery}
				autoCapitalize='none'
				autoCompleteType='off'
				containerStyle={{ marginTop: 8 }}
			/>
			<FlatList
				data={players}
				keyExtractor={player => player._id}
				renderItem={renderPlayerCard}
				style={{ flex: 1 }}
				contentContainerStyle={{ marginHorizontal: 8 }}
				onEndReached={() => {
					if (!isLoading) {
						fetchNextPage();
					}
				}}
			/>
		</ImageBackground>
	);
};

export { SearchUsersScreen };
