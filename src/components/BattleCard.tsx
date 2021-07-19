import React, { FC } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Text, Avatar, Theme, useTheme } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
import { formatDistance } from 'date-fns';
import { FontFamily } from '@app/theme';
import { BASE_URL } from '@app/api/client';

type PlayerInfo = {
	_id: string;
	username: string;
	avatar: string;
	level: string;
};

type Score = {
	_id: string;
	coins: number;
	score: number;
};

interface Props {
	userInfo: PlayerInfo;
	opponentInfo: PlayerInfo;
	userScore: Score;
	opponentScore: Score;
	type: '1v1' | 'multi';
	containerStyle?: StyleProp<ViewStyle>;
	time: Date;
}

const BattleCard: FC<Props> = ({
	userInfo,
	opponentInfo,
	userScore,
	opponentScore,
	type,
	time,
	containerStyle
}) => {
	const { theme } = useTheme();
	const styles = useStyles(theme);
	const { colors } = theme;

	let header;
	if (userScore.score > opponentScore.score) {
		header = { title: 'Victory', color: '#90CAF9' };
	} else if (userScore.score < opponentScore.score) {
		header = { title: 'Defeat', color: '#EF9A9A' };
	} else {
		header = { title: 'Tie', color: colors?.grey0 };
	}

	return (
		<View style={[styles.container, containerStyle]}>
			<View style={styles.headerContainer}>
				<Text style={[styles.battleResult, { color: header.color }]}>
					{header.title}
				</Text>
				<Text style={styles.score}>
					{userScore?.score} - {opponentScore.score}
				</Text>
			</View>
			<View style={{ flexDirection: 'row', alignItems: 'center' }}>
				<LinearGradient
					colors={[colors!.grey0!, '#BBDEFB']}
					style={styles.playerContainer}>
					<Avatar
						size='small'
						rounded
						source={{ uri: BASE_URL + userInfo.avatar }}
					/>
					<View style={{ justifyContent: 'center', marginStart: 4 }}>
						<Text style={styles.playerName}>
							{userInfo.username}
						</Text>
						<Text style={styles.level}>{userInfo.level}</Text>
					</View>
				</LinearGradient>
				<LinearGradient
					colors={[colors!.grey0!, '#FFCDD2']}
					style={[
						styles.playerContainer,
						{ justifyContent: 'flex-end' }
					]}>
					<View style={{ marginEnd: 4 }}>
						<Text style={styles.opponentName}>
							{opponentInfo?.username}
						</Text>
						<Text style={styles.level}>{opponentInfo?.level}</Text>
					</View>
					<Avatar
						size='small'
						rounded
						source={{ uri: BASE_URL + opponentInfo?.avatar }}
					/>
				</LinearGradient>
				<View style={styles.typeContainer}>
					<Avatar
						size='small'
						source={
							type === '1v1'
								? require('@assets/battle.png')
								: require('@assets/friends.png')
						}
					/>
				</View>
			</View>
			<View style={styles.bottomContainer}>
				<Text style={{ color: 'black' }}>
					{formatDistance(new Date(), time)} ago
				</Text>
				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
					<Text style={styles.coins}>
						{userScore.coins > 0 && '+'}
						{userScore.coins}
					</Text>
					<Avatar
						size='small'
						source={require('@assets/coins.png')}
					/>
				</View>
			</View>
		</View>
	);
};

const useStyles = ({ colors }: Theme) =>
	StyleSheet.create({
		container: {
			backgroundColor: colors?.grey0,
			borderRadius: 12,
			elevation: 4,
			shadowColor: colors?.grey5,
			shadowOffset: { width: 0, height: 4 },
			shadowOpacity: 0.7,
			shadowRadius: 4
		},
		headerContainer: {
			flexDirection: 'row',
			backgroundColor: colors?.grey5,
			alignItems: 'center',
			padding: 8,
			borderTopStartRadius: 12,
			borderTopEndRadius: 12
		},
		battleResult: {
			fontSize: 18,
			fontFamily: FontFamily.Bold
		},
		score: {
			textAlign: 'center',
			position: 'absolute',
			left: 0,
			right: 0,
			fontSize: 18,
			fontFamily: FontFamily.Black
		},
		playerContainer: {
			flexDirection: 'row',
			flex: 1,
			alignItems: 'center',
			padding: 8
		},
		playerName: {
			color: 'blue',
			fontFamily: FontFamily.Bold
		},
		level: {
			color: colors?.grey5,
			fontFamily: FontFamily.Light,
			fontSize: 12
		},
		typeContainer: {
			...StyleSheet.absoluteFillObject,
			justifyContent: 'center',
			alignItems: 'center'
		},
		opponentName: { color: 'red', fontFamily: FontFamily.Bold },
		coins: {
			color: 'black',
			marginEnd: 4,
			fontSize: 16,
			fontFamily: FontFamily.SemiBold
		},
		bottomContainer: {
			backgroundColor: 'white',
			padding: 8,
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
			borderBottomStartRadius: 12,
			borderBottomEndRadius: 12
		}
	});

export { BattleCard };
