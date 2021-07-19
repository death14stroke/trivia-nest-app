import React, { FC, useContext } from 'react';
import { FlatList, ImageBackground, ListRenderItem } from 'react-native';
import { useInfiniteQuery, useMutation } from 'react-query';
import _ from 'lodash';
import { ProfileContext } from '@app/context';
import { Player } from '@app/models';
import { apiGetFriends, apiUnfriendUser } from '@app/api/users';
import { FriendsCard } from '@app/components';

const PAGE_SIZE = 10;

const FriendsScreen: FC = () => {
	const {
		actions: { unfriend, undoUnfriend }
	} = useContext(ProfileContext);

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

	const { mutate: unfriendUser } = useMutation<unknown, unknown, string>(
		apiUnfriendUser,
		{
			onMutate: unfriend,
			onError: (_err, friendId) => undoUnfriend(friendId)
		}
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
