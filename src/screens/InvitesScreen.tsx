import React, { FC } from 'react';
import { FlatList, ImageBackground, ListRenderItem } from 'react-native';
import { useInfiniteQuery, useMutation, useQueryClient } from 'react-query';
import _ from 'lodash';
import { Invite } from '@app/models';
import {
	apiAcceptRequest,
	apiGetInvites,
	apiRejectRequest
} from '@app/api/users';
import { InviteCard } from '@app/components';
import { useContext } from 'react';
import { ProfileContext } from '@app/context';

const PAGE_SIZE = 20;

//TODO: accept/reject friend request via socket
const InvitesScreen: FC = () => {
	const queryClient = useQueryClient();
	const {
		actions: {
			acceptInvite,
			undoAcceptInvite,
			rejectInvite,
			undoRejectInvite
		}
	} = useContext(ProfileContext);

	const { data, isLoading, fetchNextPage } = useInfiniteQuery<Invite[]>(
		'invites',
		async ({ pageParam }) => {
			const { data } = await apiGetInvites(PAGE_SIZE, pageParam);
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

	const { mutate: acceptFriendRequest } = useMutation<
		unknown,
		unknown,
		string
	>(apiAcceptRequest, {
		onMutate: acceptInvite,
		onError: (_err, friendId) => undoAcceptInvite(friendId),
		onSuccess: () => {
			queryClient.invalidateQueries('invites');
			queryClient.invalidateQueries('friends');
		}
	});

	const { mutate: rejectFriendRequest } = useMutation<
		unknown,
		unknown,
		string
	>(apiRejectRequest, {
		onMutate: rejectInvite,
		onError: (_err, friendId) => undoRejectInvite(friendId),
		onSuccess: () => queryClient.invalidateQueries('invites')
	});

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
