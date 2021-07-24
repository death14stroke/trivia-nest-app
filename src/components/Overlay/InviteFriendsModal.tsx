import React, { FC } from 'react';
import {
	FlatList,
	Platform,
	PlatformColor,
	StyleSheet,
	View,
	ListRenderItem
} from 'react-native';
import { Divider, Overlay, Text, Theme, useTheme } from 'react-native-elements';
import { useInfiniteQuery } from 'react-query';
import _ from 'lodash';
import { FontFamily } from '@app/theme';
import { Player, UserStatus } from '@app/models';
import { apiGetFriends } from '@app/api/users';
import { Button } from '../Button';
import { AvailableFriendsCard } from '../ListItem';
import { useContext } from 'react';
import { ProfileContext } from '@app/context';

const PAGE_SIZE = 10;

interface Props {
	open?: boolean;
	roomInvites: Set<string>;
	roomMembers: string[];
	onBackdropPress?: () => void;
	onInviteFriend?: (friendId: string) => void;
}

//TODO: status not updating...update status fetch from react query with socket events
const InviteFriendsModal: FC<Props> = ({
	open = false,
	roomInvites,
	roomMembers,
	onBackdropPress,
	onInviteFriend
}) => {
	const styles = useStyles(useTheme().theme);
	const {
		state: { friends }
	} = useContext(ProfileContext);

	const { data, isLoading, fetchNextPage } = useInfiniteQuery<Player[]>(
		'friends',
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

	const friendsList = _.chain(data?.pages)
		.flatten()
		.filter(
			({ _id, status }) =>
				status !== UserStatus.OFFLINE && !roomMembers.includes(_id)
		)
		.value();

	return (
		<Overlay
			isVisible={open}
			onBackdropPress={onBackdropPress}
			transparent
			overlayStyle={styles.overlay}>
			<View style={styles.header}>
				<Text style={styles.headerText}>Invite Friends</Text>
			</View>
			<Divider orientation='horizontal' style={{ marginBottom: 8 }} />
			<FlatList
				data={friendsList}
				keyExtractor={player => player._id}
				renderItem={renderFriendCard}
				style={{ flexGrow: 0 }}
				contentContainerStyle={{ marginHorizontal: 4 }}
				onEndReached={() => {
					if (!isLoading) {
						fetchNextPage();
					}
				}}
			/>
			<Divider orientation='horizontal' style={{ marginTop: 8 }} />
			<View style={styles.buttonContainer}>
				<Button.Text
					title='Done'
					titleStyle={styles.buttonTitle}
					onPress={onBackdropPress}
				/>
			</View>
		</Overlay>
	);
};

const useStyles = ({ colors }: Theme) =>
	StyleSheet.create({
		overlay: {
			padding: 0,
			borderRadius: 16,
			elevation: 8,
			shadowColor: colors?.grey1,
			shadowOffset: { width: 0, height: 4 },
			shadowOpacity: 0.8,
			shadowRadius: 12,
			width: '90%',
			...Platform.select({
				ios: { backgroundColor: PlatformColor('systemGray6') },
				android: { backgroundColor: 'rgb(242, 242, 247)' }
			})
		},
		header: {
			overflow: 'hidden',
			borderTopLeftRadius: 16,
			borderTopRightRadius: 16
		},
		headerText: {
			fontSize: 20,
			padding: 8,
			color: 'black',
			textAlign: 'center',
			fontFamily: FontFamily.SemiBold
		},
		buttonContainer: {
			borderBottomLeftRadius: 16,
			borderBottomRightRadius: 16
		},
		buttonTitle: { fontFamily: FontFamily.Bold }
	});

export { InviteFriendsModal };
