import React, { FC } from 'react';
import {
	View,
	StyleSheet,
	StyleProp,
	ViewStyle,
	ActivityIndicator
} from 'react-native';
import { Text, Avatar, useTheme, Theme } from 'react-native-elements';
import { Colors, FontFamily } from '@app/theme';
import { Player } from '@app/models';
import { BASE_URL } from '@app/api/client';

interface Props {
	player: Player;
	score: number;
	coins: number;
	isCurrentUser?: boolean;
	containerStyle?: StyleProp<ViewStyle>;
}

const ResultCard: FC<Props> = ({
	player,
	score,
	coins,
	isCurrentUser,
	containerStyle
}) => {
	const styles = useStyles(useTheme().theme);

	return (
		<View
			style={[
				styles.root,
				containerStyle,
				isCurrentUser && styles.currentUser
			]}>
			<View style={{ flexDirection: 'row', alignItems: 'center' }}>
				<Avatar
					source={{ uri: BASE_URL + player.avatar }}
					size='medium'
					rounded
					containerStyle={{ marginHorizontal: 8 }}
					renderPlaceholderContent={<ActivityIndicator />}
				/>
				<View style={styles.infoContainer}>
					<View style={{ flex: 1, justifyContent: 'space-between' }}>
						<Text style={styles.username}>{player.username}</Text>
						<Text style={styles.level}>{player.level}</Text>
					</View>
					<View>
						<Text style={styles.score}>{score} / 10</Text>
						<View style={styles.coinsContainer}>
							<Text style={styles.coins}>{coins}</Text>
							<Avatar
								size='small'
								source={require('@assets/coins.png')}
								renderPlaceholderContent={<ActivityIndicator />}
							/>
						</View>
					</View>
				</View>
			</View>
		</View>
	);
};

const useStyles = ({ colors }: Theme) =>
	StyleSheet.create({
		root: {
			padding: 4,
			borderWidth: 1,
			borderRadius: 8,
			backgroundColor: colors?.grey4
		},
		currentUser: {
			borderColor: Colors.curiousBlue,
			borderWidth: 4,
			borderRadius: 8
		},
		username: { fontSize: 18, fontFamily: FontFamily.Bold },
		level: { fontFamily: FontFamily.Light },
		coins: { fontFamily: FontFamily.SemiBold, marginEnd: 8 },
		score: { fontFamily: FontFamily.SemiBold },
		coinsContainer: {
			flexDirection: 'row',
			alignItems: 'center',
			marginTop: 8
		},
		infoContainer: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
			flex: 1
		}
	});

export { ResultCard };
