import React, { FC, useContext, useCallback } from 'react';
import {
	FlatList,
	ImageBackground,
	ListRenderItem,
	StyleSheet
} from 'react-native';
import { Text } from 'react-native-elements';
import { useInfiniteQuery } from 'react-query';
import LottieView from 'lottie-react-native';
import { useFocusEffect } from '@react-navigation/native';
import _ from 'lodash';
import { BadgeContext } from '@app/context';
import { Invite, Query } from '@app/models';
import { useFriendInviteMutations } from '@app/hooks/mutations';
import { apiGetInvites } from '@app/api/users';
import { InviteCard, ListItem, Loading } from '@app/components';
import { FontFamily } from '@app/theme';

const PAGE_SIZE = 25;

const InvitesScreen: FC = () => {
	const [acceptFriendRequest, rejectFriendRequest] = useFriendInviteMutations(
		{}
	);
	const {
		state: { invites: invitesCount },
		actions: { resetInvitesBadge }
	} = useContext(BadgeContext);

	const { data, isLoading, fetchNextPage, hasNextPage } = useInfiniteQuery<
		Invite[]
	>(
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
				resetInvitesBadge();
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

	const renderEmptyCard = () => {
		return !isLoading ? (
			<ListItem.Empty message='No invites pending' />
		) : null;
	};
	const renderLoadingFooter = () => {
		return hasNextPage && invites.length !== 0 ? <ListItem.Footer /> : null;
	};

	const invites = _.flatten(data?.pages);

	return (
		<ImageBackground
			source={require('@assets/background.jpg')}
			style={styles.root}>
			{isLoading && invites.length === 0 ? (
				<Loading />
			) : (
				<FlatList
					data={invites}
					keyExtractor={invite => invite.info._id}
					renderItem={renderInviteCard}
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

const styles = StyleSheet.create({
	root: { flex: 1, paddingHorizontal: 8 }
});

export { InvitesScreen };
