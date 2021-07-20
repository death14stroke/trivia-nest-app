// import React, { FC } from 'react';
// import { ViewStyle, View, Text, StyleSheet } from 'react-native';
// import {
// 	colors,
// 	Avatar,
// 	Badge,
// 	Icon,
// 	Theme,
// 	useTheme
// } from 'react-native-elements';
// import { BASE_URL } from '@app/api/client';
// import { Player, UserStatus } from '@app/models';

// interface Props {
// 	player: Player;
// }

// const MultiplayerInviteCard: FC<Props> = ({ player }) => {
// 	const { _id, username, avatar, status } = player;
// 	const styles = useStyles(useTheme().theme);

// 	let badgeStyle: ViewStyle;
// 	if (status === UserStatus.ONLINE) {
// 		badgeStyle = styles.badgeOnline;
// 	} else if (status === UserStatus.BUSY) {
// 		badgeStyle = styles.badgeBusy;
// 	} else {
// 		badgeStyle = styles.badgeOffline;
// 	}

// 	return (
// 		<View style={styles.root}>
// 			<View>
// 				<Avatar
// 					size='medium'
// 					rounded
// 					source={{ uri: BASE_URL + avatar }}
// 				/>
// 				<Badge badgeStyle={[styles.badge, badgeStyle]} />
// 			</View>
// 			<View
// 				style={{
// 					flexDirection: 'row',
// 					justifyContent: 'space-between'
// 				}}>
// 				<Text style={{ fontSize: 12 }}>{username}</Text>
// 				{status === UserStatus.ONLINE &&
// 					(!roomInvites.includes(_id) ? (
// 						<Icon
// 							type='ionicon'
// 							name='add-circle-outline'
// 							color='white'
// 							onPress={() => sendInvite(_id)}
// 						/>
// 					) : (
// 						<Icon
// 							type='ionicon'
// 							name='timer-outline'
// 							color='white'
// 						/>
// 					))}
// 			</View>
// 		</View>
// 	);
// };

// const useStyles = ({ colors }: Theme) =>
// 	StyleSheet.create({
// 		root: {
// 			alignItems: 'center',
// 			backgroundColor: colors?.grey3,
// 			marginHorizontal: 4,
// 			padding: 4,
// 			borderRadius: 12,
// 			borderWidth: 1,
// 			borderColor: 'gold'
// 		},
// 		badge: {
// 			bottom: 2,
// 			right: 0,
// 			position: 'absolute',
// 			height: 12,
// 			aspectRatio: 1,
// 			borderRadius: 100,
// 			borderColor: 'gold',
// 			borderWidth: 0.3
// 		},
// 		badgeOnline: {
// 			backgroundColor: colors?.success
// 		},
// 		badgeBusy: {
// 			backgroundColor: 'orange'
// 		},
// 		badgeOffline: {
// 			borderColor: colors?.disabled,
// 			backgroundColor: colors?.grey5,
// 			borderWidth: 0.5
// 		}
// 	});

// export { MultiplayerInviteCard };
