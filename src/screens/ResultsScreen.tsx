import React, { FC, useContext, useEffect } from 'react';
import {
	FlatList,
	ImageBackground,
	ListRenderItem,
	View,
	StyleSheet,
	ActivityIndicator
} from 'react-native';
import { Text, useTheme, Avatar, Badge } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@app/navigation';
import { Colors, FontFamily } from '@app/theme';
import { ProfileContext } from '@app/context';
import { Result } from '@app/models';
import { BASE_URL } from '@app/api/client';
import { Button, ResultCard } from '@app/components';

interface Props {
	route: RouteProp<RootStackParamList, 'Results'>;
	navigation: StackNavigationProp<RootStackParamList, 'Results'>;
}

const ResultsScreen: FC<Props> = ({ route, navigation }) => {
	const results = route.params;
	const {
		state: currentUser,
		actions: { refreshProfile }
	} = useContext(ProfileContext);
	const {
		theme: { colors }
	} = useTheme();

	useEffect(() => {
		refreshProfile();
	}, []);

	const renderPlayer: ListRenderItem<Result> = ({
		item: { player, score, coins }
	}) => (
		<ResultCard
			player={player}
			score={score}
			coins={coins}
			isCurrentUser={player._id === currentUser._id}
		/>
	);

	const player = results.find(
		({ player }) => player._id === currentUser._id
	)!;
	const isPlayerWinner = player?.score === results[0].score;
	let winner: Result;
	if (isPlayerWinner) {
		winner = player;
	} else {
		winner = results[0];
	}

	const renderWinner = () => {
		const badgeBackgroundColor = isPlayerWinner
			? Colors.curiousBlue
			: colors?.primary;

		return (
			<View style={{ alignItems: 'center' }}>
				<View style={{ marginVertical: 12 }}>
					<Avatar
						size='xlarge'
						rounded
						source={{ uri: BASE_URL + winner.player.avatar }}
						avatarStyle={isPlayerWinner ? styles.avatarWinner : {}}
						renderPlaceholderContent={<ActivityIndicator />}
					/>
					<Badge
						value={winner.score}
						status='primary'
						containerStyle={styles.badgeContainer}
						badgeStyle={[
							styles.badge,
							{ backgroundColor: badgeBackgroundColor }
						]}
						textStyle={{ fontSize: 22 }}
					/>
				</View>
				<Text style={{ fontSize: 20, fontFamily: FontFamily.Bold }}>
					{winner.player.username}
				</Text>
				<View style={{ flexDirection: 'row', marginTop: 4 }}>
					<View
						style={{
							flexDirection: 'row',
							alignItems: 'center'
						}}>
						<Text style={styles.coins}>{winner.coins}</Text>
						<Avatar
							size='small'
							source={require('@assets/coins.png')}
							containerStyle={{ marginStart: 4 }}
							renderPlaceholderContent={<ActivityIndicator />}
						/>
					</View>
				</View>
			</View>
		);
	};

	return (
		<ImageBackground
			source={require('@assets/background.jpg')}
			style={{ flex: 1 }}>
			<SafeAreaView style={styles.root}>
				<View style={{ flex: 1 }}>
					<View style={{ alignItems: 'center' }}>
						<Text h3>
							{isPlayerWinner
								? 'You win!!'
								: 'Better luck next time...'}
						</Text>
					</View>
					{renderWinner()}
					<FlatList
						data={results.filter(
							({ player }) => player._id !== winner.player._id
						)}
						keyExtractor={result => result.player._id}
						renderItem={renderPlayer}
						style={{ marginTop: 24, flexGrow: 0 }}
					/>
				</View>
				<View style={{ marginBottom: 24 }}>
					<Button.Raised
						onPress={() => navigation.pop()}
						style={{ marginBottom: 24 }}>
						<Text h4>Exit</Text>
					</Button.Raised>
				</View>
			</SafeAreaView>
		</ImageBackground>
	);
};

const styles = StyleSheet.create({
	root: { flex: 1, paddingHorizontal: 12, justifyContent: 'space-between' },
	avatarWinner: { borderWidth: 4, borderColor: Colors.curiousBlue },
	badgeContainer: { position: 'absolute', top: -4, right: -20 },
	badge: {
		height: 50,
		width: 50,
		borderRadius: 100,
		borderWidth: 0
	},
	coins: { fontFamily: FontFamily.SemiBold, fontSize: 18 }
});

export { ResultsScreen };
