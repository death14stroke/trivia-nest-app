import React, { FC, useContext } from 'react';
import { FlatList, StyleSheet, View, ListRenderItem } from 'react-native';
import { useInfiniteQuery } from 'react-query';
import LottieView from 'lottie-react-native';
import _ from 'lodash';
import { ProfileContext } from '@app/context';
import { Player, Query, UserStatus } from '@app/models';
import { apiGetFriends } from '@app/api/users';
import { AvailableFriendsCard, ListItem } from '../ListItem';
import Dialog from '../Dialog';

const PAGE_SIZE = 25;

interface Props {
	open?: boolean;
	roomInvites: Set<string>;
	roomMembers: string[];
	onBackdropPress?: () => void;
	onInviteFriend?: (friendId: string) => void;
}

const InviteFriendsModal: FC<Props> = ({
	open = false,
	roomInvites,
	roomMembers,
	onBackdropPress,
	onInviteFriend
}) => {
	const {
		state: { friends }
	} = useContext(ProfileContext);

	const { data, isLoading, fetchNextPage, hasNextPage } = useInfiniteQuery<
		Player[]
	>(
		Query.FRIENDS,
		async ({ pageParam }) => apiGetFriends(PAGE_SIZE, pageParam),
		{
			staleTime: 5 * 60 * 1000,
			getNextPageParam: lastPage =>
				lastPage.length === PAGE_SIZE
					? lastPage[lastPage.length - 1]
					: undefined
		}
	);

	const renderFriendCard: ListRenderItem<Player> = ({ item }) => {
		const { _id } = item;
		item.status = friends.get(_id) ?? item.status;

		return (
			<AvailableFriendsCard
				player={item}
				containerStyle={{ marginVertical: 4 }}
				isInvited={roomInvites.has(_id)}
				onInvite={() => onInviteFriend?.(_id)}
			/>
		);
	};

	const renderEmptyCard = () => {
		return !isLoading ? (
			<ListItem.Empty message='No friends available' color='black' />
		) : null;
	};
	const renderLoadingFooter = () => {
		return hasNextPage && friendsList.length !== 0 ? (
			<ListItem.Footer />
		) : null;
	};

	const friendsList = _.chain(data?.pages)
		.flatten()
		.filter(
			({ _id, status }) =>
				status !== UserStatus.OFFLINE && !roomMembers.includes(_id)
		)
		.value();

	return (
		<Dialog.Container
			visible={open}
			onBackdropPress={onBackdropPress}
			style={{ width: '90%' }}>
			<Dialog.Title>Invite Friends</Dialog.Title>
			{isLoading && friendsList.length === 0 ? (
				<View style={styles.lottieContainer}>
					<LottieView
						autoPlay
						source={require('@assets/inviteTimer.json')}
						style={styles.lottie}
					/>
				</View>
			) : (
				<FlatList
					data={friendsList}
					keyExtractor={player => player._id}
					renderItem={renderFriendCard}
					contentContainerStyle={{ marginHorizontal: 4 }}
					onEndReached={() => {
						if (!isLoading) {
							fetchNextPage();
						}
					}}
					ListEmptyComponent={renderEmptyCard}
					ListFooterComponent={renderLoadingFooter()}
				/>
			)}
			<Dialog.ButtonContainer>
				<Dialog.Button title='Cancel' onPress={onBackdropPress} />
			</Dialog.ButtonContainer>
		</Dialog.Container>
	);
};

const styles = StyleSheet.create({
	lottie: { height: 50, aspectRatio: 1 },
	lottieContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	}
});

export { InviteFriendsModal };
