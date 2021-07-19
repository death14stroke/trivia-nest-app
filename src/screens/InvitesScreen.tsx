import React, { FC } from 'react';
import { FlatList, ImageBackground, ListRenderItem } from 'react-native';
import { useInfiniteQuery } from 'react-query';
import _ from 'lodash';
import { Invite } from '@app/models';
import { apiGetInvites } from '@app/api/users';
import { InviteCard } from '@app/components';

const PAGE_SIZE = 20;

//TODO: accept/reject friend request via socket
const InvitesScreen: FC = () => {
	const { data } = useInfiniteQuery<Invite[]>(
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

	const renderInviteCard: ListRenderItem<Invite> = ({ item }) => (
		<InviteCard invite={item} containerStyle={{ marginVertical: 8 }} />
	);

	const invites = _.flatten(data?.pages);

	return (
		<ImageBackground
			source={require('@assets/background.jpg')}
			style={{ flex: 1, paddingHorizontal: 8 }}>
			<FlatList
				data={invites}
				keyExtractor={invite => invite.info._id}
				renderItem={renderInviteCard}
			/>
		</ImageBackground>
	);
};

export { InvitesScreen };
