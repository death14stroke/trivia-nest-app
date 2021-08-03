import React, { FC } from 'react';
import {
	StyleSheet,
	View,
	ViewStyle,
	StyleProp,
	ActivityIndicator
} from 'react-native';
import { Text, Avatar, Icon, useTheme, Theme } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
import { formatDistance } from 'date-fns';
import { FontFamily, Colors } from '@app/theme';
import { Invite } from '@app/models';
import { BASE_URL } from '@app/api/client';

interface Props {
	invite: Invite;
	onAcceptRequest?: () => void;
	onRejectRequest?: () => void;
	containerStyle?: StyleProp<ViewStyle>;
}

const InviteCard: FC<Props> = ({
	invite,
	onAcceptRequest,
	onRejectRequest,
	containerStyle
}) => {
	const styles = useStyles(useTheme().theme);
	const {
		time,
		info: { username, avatar, level }
	} = invite;

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
						renderPlaceholderContent={<ActivityIndicator />}
					/>
					<View style={styles.infoContainer}>
						<Text style={styles.username}>{username}</Text>
						<Text style={styles.level}>{level}</Text>
					</View>
					<View style={styles.iconsContainer}>
						<Icon
							type='ionicon'
							name='checkmark-circle'
							color='green'
							size={28}
							onPress={onAcceptRequest}
						/>
						<Icon
							type='ionicon'
							name='close-circle'
							color='red'
							size={28}
							containerStyle={{ marginHorizontal: 4 }}
							onPress={onRejectRequest}
						/>
					</View>
				</LinearGradient>
			</View>
			<View style={{ padding: 8 }}>
				<Text style={{ color: 'black' }}>
					{formatDistance(new Date(), new Date(time))} ago
				</Text>
			</View>
		</View>
	);
};

const useStyles = ({ colors }: Theme) =>
	StyleSheet.create({
		root: {
			backgroundColor: 'white',
			borderRadius: 12,
			elevation: 4,
			shadowColor: colors?.grey5,
			shadowOffset: { width: 0, height: 8 },
			shadowOpacity: 0.8,
			shadowRadius: 4
		},
		level: {
			color: colors?.grey5,
			fontFamily: FontFamily.Light,
			fontSize: 14
		},
		gradientContainer: {
			borderTopLeftRadius: 8,
			borderTopRightRadius: 8,
			overflow: 'hidden'
		},
		username: {
			fontFamily: FontFamily.ExtraBold,
			color: Colors.purpleHeart,
			fontSize: 16
		},
		iconsContainer: {
			flexDirection: 'row',
			alignItems: 'center',
			position: 'absolute',
			top: 0,
			bottom: 0,
			right: 0
		},
		infoContainer: { justifyContent: 'center', marginStart: 8 },
		gradient: { padding: 8, flexDirection: 'row' }
	});

export { InviteCard };
