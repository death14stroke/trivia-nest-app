import React, { FC } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text, Icon, Avatar, Theme, useTheme } from 'react-native-elements';
import { Colors } from '@app/theme';
import { Player } from '@app/models';
import { BASE_URL } from '@app/api/client';

interface Props {
	player?: Player;
	currentUserId: string;
	ownerId: string | undefined;
	onInvitePress?: () => void;
}

const RoomMember: FC<Props> = ({
	player,
	currentUserId,
	ownerId,
	onInvitePress
}) => {
	const { theme } = useTheme();
	const styles = useStyles(theme);
	const { colors } = theme;

	console.log('owner:', ownerId);

	if (!player) {
		return (
			<View style={{ flex: 0.5, alignItems: 'center' }}>
				<TouchableOpacity
					style={styles.inviteContainer}
					onPress={onInvitePress}>
					<Icon
						type='feather'
						name='user-plus'
						size={44}
						color={colors?.grey1}
					/>
					<Text h4 h4Style={{ color: colors?.grey1 }}>
						Invite user
					</Text>
				</TouchableOpacity>
			</View>
		);
	}

	const { _id, username, avatar } = player;

	return (
		<View style={{ flex: 0.5, alignItems: 'center' }}>
			<View style={{ borderRadius: 8 }}>
				<Avatar
					size='xlarge'
					source={{ uri: BASE_URL + avatar }}
					avatarStyle={{
						...styles.avatar,
						...(_id === currentUserId && styles.currentUser)
					}}
				/>
				{ownerId === _id && (
					<Avatar
						size='large'
						source={require('@assets/king.png')}
						containerStyle={styles.ownerBadge}
					/>
				)}
			</View>
			<Text h4>{username}</Text>
		</View>
	);
};

const useStyles = ({ colors }: Theme) =>
	StyleSheet.create({
		inviteContainer: {
			borderColor: colors?.grey1,
			borderWidth: 2,
			borderStyle: 'dashed',
			borderRadius: 8,
			height: 150,
			width: 150,
			justifyContent: 'center',
			alignItems: 'center'
		},
		ownerBadge: {
			position: 'absolute',
			right: -37,
			top: -40
		},
		avatar: { borderRadius: 8 },
		currentUser: {
			borderColor: Colors.curiousBlue,
			borderWidth: 3
		}
	});

export { RoomMember };
