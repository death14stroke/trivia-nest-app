import React, { FC } from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Avatar, Icon, Theme, useTheme } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, FontFamily } from '@app/theme';
import { Player } from '@app/models';
import { BASE_URL } from '@app/api/client';

interface Props {
	player: Player;
	iconType: 'unfriend' | 'invite' | 'accept' | undefined;
	onAcceptRequest?: () => void;
	onUnfriendUser?: () => void;
	onSendFriendRequest?: () => void;
	containerStyle?: StyleProp<ViewStyle>;
}

const FriendsCard: FC<Props> = ({
	player,
	iconType,
	onAcceptRequest,
	onSendFriendRequest,
	onUnfriendUser,
	containerStyle
}) => {
	const { username, avatar, level } = player;
	const styles = useStyles(useTheme().theme);

	const friendsIcon = () => {
		if (iconType === 'unfriend') {
			return (
				<Icon
					type='feather'
					name='user-minus'
					onPress={onUnfriendUser}
				/>
			);
		} else if (iconType === 'accept') {
			return (
				<Icon
					type='ionicon'
					name='checkmark-circle'
					color='green'
					onPress={onAcceptRequest}
				/>
			);
		} else if (iconType === 'invite') {
			return (
				<Icon type='feather' name='user-plus' disabled color='gray' />
			);
		} else {
			return (
				<Icon
					type='feather'
					name='user-plus'
					onPress={onSendFriendRequest}
				/>
			);
		}
	};

	return (
		<View style={[styles.root, containerStyle]}>
			<View style={styles.gradientContainer}>
				<LinearGradient
					style={styles.gradient}
					colors={['white', '#D1C4E9']}>
					<Avatar
						size='medium'
						rounded
						source={{ uri: BASE_URL + avatar }}
					/>
					<View style={styles.infoContainer}>
						<Text style={styles.username}>{username}</Text>
						<Text style={styles.level}>{level}</Text>
					</View>
					{friendsIcon()}
				</LinearGradient>
			</View>
		</View>
	);
};

const useStyles = ({ colors }: Theme) =>
	StyleSheet.create({
		root: {
			borderRadius: 12,
			elevation: 4,
			shadowColor: colors?.grey5,
			shadowOffset: { width: 0, height: 8 },
			shadowOpacity: 0.8,
			shadowRadius: 4
		},
		gradientContainer: {
			borderRadius: 8,
			overflow: 'hidden'
		},
		gradient: {
			padding: 8,
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
		infoContainer: { justifyContent: 'center', marginStart: 8, flex: 1 }
	});

export { FriendsCard };
