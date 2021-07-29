import React, { FC, useState, useContext } from 'react';
import { FlatList, ImageBackground, ListRenderItem } from 'react-native';
import { useInfiniteQuery } from 'react-query';
import { useDebounce } from 'use-debounce/lib';
import _ from 'lodash';
import { ProfileContext } from '@app/context';
import { Player, Query } from '@app/models';
import {
	useFriendInviteMutations,
	useSendFriendRequestMutation,
	useUnfriendMutation
} from '@app/hooks/mutations';
import { apiSearchUsers } from '@app/api/users';
import { FriendsCard, ListItem, Loading, SearchBar } from '@app/components';

const PAGE_SIZE = 10;

const SearchUsersScreen: FC = () => {
	const [acceptFriendRequest] = useFriendInviteMutations({});
	const sendFriendRequest = useSendFriendRequestMutation({});
	const unfriendUser = useUnfriendMutation({});
	const { state } = useContext(ProfileContext);
	const [rawQuery, setRawQuery] = useState('');
	const [query] = useDebounce(rawQuery, 1000);
	const { friends, invites, requests } = state!;

	const { data, isLoading, fetchNextPage, hasNextPage } = useInfiniteQuery<
		Player[]
	>(
		[Query.USERS, query],
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

	const renderEmptyCard = () => {
		return !isLoading ? (
			<ListItem.Empty message='No players found' />
		) : null;
	};
	const renderLoadingFooter = () => {
		return hasNextPage && players.length !== 0 ? <ListItem.Footer /> : null;
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
			{isLoading && players.length === 0 ? (
				<Loading />
			) : (
				<FlatList
					data={players}
					keyExtractor={player => player._id}
					renderItem={renderPlayerCard}
					contentContainerStyle={{ marginHorizontal: 8, flexGrow: 1 }}
					onEndReached={() => {
						if (!isLoading) {
							fetchNextPage();
						}
					}}
					ListEmptyComponent={renderEmptyCard()}
					ListFooterComponent={renderLoadingFooter()}
				/>
			)}
		</ImageBackground>
	);
};

export { SearchUsersScreen };
