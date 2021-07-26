import React, { FC, useContext, useCallback } from 'react';
import { FlatList, ImageBackground, ListRenderItem } from 'react-native';
import { useInfiniteQuery } from 'react-query';
import { useFocusEffect } from '@react-navigation/native';
import _ from 'lodash';
import { BadgeContext } from '@app/context';
import { Invite, Query } from '@app/models';
import { useFriendInviteMutations } from '@app/hooks/mutations';
import { apiGetInvites } from '@app/api/users';
import { InviteCard } from '@app/components';

const PAGE_SIZE = 25;

const InvitesScreen: FC = () => {
	const {
		state: { invites: invitesCount },
		actions: { updateInvitesBadge }
	} = useContext(BadgeContext);
	const [acceptFriendRequest, rejectFriendRequest] = useFriendInviteMutations(
		{}
	);

	const { data, isLoading, fetchNextPage } = useInfiniteQuery<Invite[]>(
		Query.INVITES,
		async ({ pageParam }) => apiGetInvites(PAGE_SIZE, pageParam),
		{
			staleTime: Infinity,
			getNextPageParam: lastPage =>
				lastPage.length >= PAGE_SIZE
					? lastPage[lastPage.length - 1]
					: undefined
		}
	);

	useFocusEffect(
		useCallback(() => {
			if (invitesCount !== 0) {
				updateInvitesBadge(0);
			}
		}, [invitesCount])
	);

	const renderInviteCard: ListRenderItem<Invite> = ({ item }) => {
		const {
			info: { _id }
		} = item;

		return (
			<InviteCard
				invite={item}
				containerStyle={{ marginVertical: 8 }}
				onAcceptRequest={() => acceptFriendRequest(_id)}
				onRejectRequest={() => rejectFriendRequest(_id)}
			/>
		);
	};

	const invites = _.flatten(data?.pages);

	return (
		<ImageBackground
			source={require('@assets/background.jpg')}
			style={{ flex: 1, paddingHorizontal: 8 }}>
			<FlatList
				data={invites}
				keyExtractor={invite => invite.info._id}
				renderItem={renderInviteCard}
				onEndReached={() => {
					if (!isLoading) {
						fetchNextPage();
					}
				}}
			/>
		</ImageBackground>
	);
};

export { InvitesScreen };
