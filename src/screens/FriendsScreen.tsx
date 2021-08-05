import React, { FC, useCallback, useContext } from 'react';
import { FlatList, ImageBackground, ListRenderItem } from 'react-native';
import { useInfiniteQuery } from 'react-query';
import { useFocusEffect } from '@react-navigation/native';
import _ from 'lodash';
import { Player, Query } from '@app/models';
import { BadgeContext } from '@app/context';
import { apiGetFriends } from '@app/api/users';
import { useUnfriendMutation } from '@app/hooks/mutations';
import { FriendsCard, ListItem, Loading } from '@app/components';

const PAGE_SIZE = 25;

const FriendsScreen: FC = () => {
	const unfriendUser = useUnfriendMutation({});
	const {
		state: { friends: friendsCount },
		actions: { resetFriendsBadge }
	} = useContext(BadgeContext);

	const { data, isLoading, fetchNextPage, hasNextPage } = useInfiniteQuery<
		Player[]
	>(
		Query.FRIENDS,
		async ({ pageParam }) => apiGetFriends(PAGE_SIZE, pageParam),
		{
			staleTime: 30 * 60 * 1000,
			getNextPageParam: lastPage =>
				lastPage.length === PAGE_SIZE
					? lastPage[lastPage.length - 1]
					: undefined
		}
	);

	useFocusEffect(
		useCallback(() => {
			if (friendsCount !== 0) {
				resetFriendsBadge();
			}
		}, [friendsCount])
	);

	const renderFriendsCard: ListRenderItem<Player> = ({ item }) => {
		const { _id } = item;

		return (
			<FriendsCard
				player={item}
				iconType='unfriend'
				onUnfriendUser={() => unfriendUser(_id)}
				containerStyle={{ marginVertical: 8 }}
			/>
		);
	};

	const renderEmptyCard = () => {
		return !isLoading ? (
			<ListItem.Empty message='No friends found' />
		) : null;
	};
	const renderLoadingFooter = () => {
		return hasNextPage && friendsList.length !== 0 ? (
			<ListItem.Footer />
		) : null;
	};

	const friendsList = _.flatten(data?.pages);

	return (
		<ImageBackground
			source={require('@assets/background.jpg')}
			style={{ flex: 1, paddingHorizontal: 8 }}>
			{isLoading && friendsList.length === 0 ? (
				<Loading />
			) : (
				<FlatList
					data={friendsList}
					keyExtractor={player => player._id}
					renderItem={renderFriendsCard}
					onEndReached={() => {
						if (!isLoading) {
							fetchNextPage();
						}
					}}
					contentContainerStyle={{ flexGrow: 1 }}
					ListEmptyComponent={renderEmptyCard()}
					ListFooterComponent={renderLoadingFooter()}
				/>
			)}
		</ImageBackground>
	);
};

export { FriendsScreen };
