import { BASE_URL } from '@app/api/client';
import { formatDistance } from 'date-fns';
import React, { FC } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { View, StyleSheet } from 'react-native';
import { Text, Avatar, Theme, useTheme } from 'react-native-elements';

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
	type: string;
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

	let header = {
		title: 'Tie',
		color: colors?.grey0
	};

	if (userScore.score > opponentScore.score) {
		header = {
			title: 'Victory',
			color: 'cyan'
		};
	} else if (userScore.score < opponentScore.score) {
		header = {
			title: 'Defeat',
			color: 'red'
		};
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
			<View style={{ flexDirection: 'row', margin: 8 }}>
				<View style={styles.playerContainer}>
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
				</View>
				<View style={styles.typeContainer}>
					<Text style={{ color: 'black' }}>{type}</Text>
				</View>
				<View
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
				</View>
			</View>
			<View
				style={{
					backgroundColor: 'white',
					padding: 8,
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center'
				}}>
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
			borderWidth: 2,
			overflow: 'hidden'
		},
		headerContainer: {
			flexDirection: 'row',
			backgroundColor: colors?.grey4,
			alignItems: 'center',
			padding: 8
		},
		battleResult: {
			fontSize: 18,
			fontWeight: 'bold'
		},
		score: {
			textAlign: 'center',
			position: 'absolute',
			left: 0,
			right: 0,
			fontSize: 18,
			fontWeight: 'bold'
		},
		playerContainer: {
			flexDirection: 'row',
			flex: 1,
			alignItems: 'center'
		},
		playerName: {
			color: 'blue',
			fontWeight: 'bold'
		},
		level: {
			color: 'grey',
			fontWeight: 'bold',
			fontSize: 10
		},
		typeContainer: {
			alignItems: 'center',
			justifyContent: 'center'
		},
		opponentName: { color: 'red', fontWeight: 'bold' },
		coins: {
			color: 'black',
			marginEnd: 4,
			fontSize: 16,
			fontWeight: 'bold'
		}
	});

export { BattleCard };
