import React, { FC } from 'react';
import { Text, View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Avatar, Badge, Icon, Theme, useTheme } from 'react-native-elements';
import { Colors, FontFamily } from '@app/theme';
import { Player, UserStatus } from '@app/models';
import { BASE_URL } from '@app/api/client';

interface Props {
	player: Player;
	containerStyle?: StyleProp<ViewStyle>;
	isInvited?: boolean;
	onInvite?: () => void;
}

//TODO: 15 sec lottie timer animation small
const AvailableFriendsCard: FC<Props> = ({
	player,
	containerStyle,
	isInvited = false,
	onInvite
}) => {
	const { theme } = useTheme();
	const { colors } = theme;
	const styles = useStyles(theme);
	const { username, avatar, level, status } = player;

	let badgeStyle: ViewStyle;
	if (status === UserStatus.ONLINE) {
		badgeStyle = styles.badgeOnline;
	} else if (status === UserStatus.BUSY) {
		badgeStyle = styles.badgeBusy;
	} else {
		badgeStyle = styles.badgeOffline;
	}

	return (
		<View style={[styles.root, containerStyle]}>
			<View>
				<Avatar
					rounded
					size='medium'
					source={{ uri: BASE_URL + avatar }}
				/>
				<Badge badgeStyle={[styles.badge, badgeStyle]} />
			</View>
			<View style={styles.infoContainer}>
				<Text style={styles.username}>{username}</Text>
				<Text style={styles.level}>{level}</Text>
			</View>
			{!isInvited ? (
				<Icon
					type='ionicon'
					name='add-circle-outline'
					color={
						status === UserStatus.ONLINE ? 'black' : colors?.grey3
					}
					onPress={onInvite}
					disabledStyle={{ backgroundColor: 'transparent' }}
					disabled={status !== UserStatus.ONLINE}
				/>
			) : (
				<Icon type='ionicon' name='timer-outline' color='black' />
			)}
		</View>
	);
};

const useStyles = ({ colors }: Theme) =>
	StyleSheet.create({
		root: {
			borderRadius: 12,
			flexDirection: 'row',
			alignItems: 'center'
		},
		username: {
			fontFamily: FontFamily.ExtraBold,
			color: Colors.purpleHeart,
			fontSize: 16
		},
		level: {
			color: colors?.grey5,
			fontFamily: FontFamily.Light,
			fontSize: 14
		},
		infoContainer: { justifyContent: 'center', marginStart: 8, flex: 1 },
		badge: {
			bottom: 2,
			right: 0,
			position: 'absolute',
			height: 12,
			aspectRatio: 1,
			borderRadius: 100,
			borderColor: 'gold',
			borderWidth: 0.3
		},
		badgeOnline: { backgroundColor: colors?.success },
		badgeBusy: { backgroundColor: 'orange' },
		badgeOffline: {
			borderColor: colors?.disabled,
			backgroundColor: colors?.grey3,
			borderWidth: 0.5
		}
	});

export { AvailableFriendsCard };
