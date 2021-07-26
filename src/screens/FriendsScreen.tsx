import React, { FC, useCallback, useContext } from 'react';
import { FlatList, ImageBackground, ListRenderItem } from 'react-native';
import { useInfiniteQuery } from 'react-query';
import { useFocusEffect } from '@react-navigation/native';
import _ from 'lodash';
import { Player, Query } from '@app/models';
import { BadgeContext } from '@app/context';
import { apiGetFriends } from '@app/api/users';
import { useUnfriendMutation } from '@app/hooks/mutations';
import { FriendsCard } from '@app/components';

const PAGE_SIZE = 25;

const FriendsScreen: FC = () => {
	const unfriendUser = useUnfriendMutation({});
	const {
		state: { friends: friendsCount },
		actions: { updateFriendsBadge }
	} = useContext(BadgeContext);

	const { data, isLoading, fetchNextPage } = useInfiniteQuery<Player[]>(
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
				updateFriendsBadge(0);
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

	const friendsList = _.flatten(data?.pages);

	return (
		<ImageBackground
			source={require('@assets/background.jpg')}
			style={{ flex: 1, paddingHorizontal: 8 }}>
			<FlatList
				data={friendsList}
				keyExtractor={player => player._id}
				renderItem={renderFriendsCard}
				style={{ flex: 1 }}
				onEndReached={() => {
					if (!isLoading) {
						fetchNextPage();
					}
				}}
			/>
		</ImageBackground>
	);
};

export { FriendsScreen };
