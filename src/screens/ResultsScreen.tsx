import React, { FC, useContext } from 'react';
import { FlatList, ImageBackground, ListRenderItem, View } from 'react-native';
import { Text, useTheme, Avatar, Badge } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@app/navigation';
import { BASE_URL } from '@app/api/client';
import { ProfileContext } from '@app/context';
import { Result } from '@app/models';
import { Button } from '@app/components';

interface Props {
	route: RouteProp<RootStackParamList, 'Results'>;
	navigation: StackNavigationProp<RootStackParamList, 'Results'>;
}

const ResultsScreen: FC<Props> = ({ route, navigation }) => {
	const results = route.params;
	const { state: currentUser } = useContext(ProfileContext);
	const {
		theme: { colors }
	} = useTheme();

	const renderPlayer: ListRenderItem<Result> = ({
		item: { player, score, coins }
	}) => (
		<View
			style={[
				{ marginVertical: 8 },
				player._id === currentUser?._id && {
					borderColor: colors?.primary,
					borderWidth: 4,
					borderRadius: 8
				}
			]}>
			<View style={{ flexDirection: 'row' }}>
				<Avatar
					source={{ uri: BASE_URL + player.avatar }}
					size='large'
					rounded
					containerStyle={{ marginHorizontal: 8 }}
				/>
				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems: 'center',
						flex: 1
					}}>
					<View style={{ flex: 1, justifyContent: 'space-between' }}>
						<Text style={{ fontSize: 18, fontWeight: '700' }}>
							{player.username}
						</Text>
						<Text style={{ fontSize: 16 }}>{player.level}</Text>
					</View>
					<View>
						<Text style={{ fontWeight: '500', fontSize: 18 }}>
							Score: {score}
						</Text>
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center'
							}}>
							<Text style={{ fontWeight: '500', fontSize: 18 }}>
								{coins}
							</Text>
							<Avatar
								size='small'
								source={require('@assets/coins.png')}
							/>
						</View>
					</View>
				</View>
			</View>
		</View>
	);

	console.log('results:', results);
	const winner = results[0];
	const isPlayerWinner = winner.player._id === currentUser!._id;

	console.log('winner:', winner, currentUser?._id, isPlayerWinner);

	return (
		<ImageBackground
			source={require('@assets/background.jpg')}
			style={{ flex: 1 }}>
			<SafeAreaView
				style={{
					flex: 1,
					paddingHorizontal: 12,
					justifyContent: 'space-between'
				}}>
				<View style={{ flex: 1 }}>
					<View style={{ alignItems: 'center' }}>
						<Text h3>
							{isPlayerWinner
								? 'You win!!'
								: 'Better luck next time...'}
						</Text>
						<View style={{ marginVertical: 12 }}>
							<Avatar
								size='xlarge'
								rounded
								source={{
									uri: BASE_URL + winner.player.avatar
								}}
								avatarStyle={
									isPlayerWinner
										? {
												borderWidth: 4,
												borderColor: colors?.primary
										  }
										: {}
								}
							/>
							<Badge
								value={winner.score}
								status='primary'
								containerStyle={{
									position: 'absolute',
									top: -4,
									right: -20
								}}
								badgeStyle={{
									height: 50,
									width: 50,
									borderRadius: 100,
									backgroundColor: colors?.primary,
									borderWidth: 0
								}}
								textStyle={{ fontSize: 22 }}
							/>
						</View>
						<Text h4>{winner.player.username}</Text>
						<View style={{ flexDirection: 'row' }}>
							<View
								style={{
									flexDirection: 'row',
									alignItems: 'center'
								}}>
								<Text
									style={{ fontWeight: '600', fontSize: 18 }}>
									{winner.coins}
								</Text>
								<Avatar
									size='small'
									source={require('@assets/coins.png')}
									containerStyle={{ marginStart: 4 }}
								/>
							</View>
						</View>
					</View>
					<FlatList
						data={results.slice(1)}
						keyExtractor={result => result.player._id}
						renderItem={renderPlayer}
						style={{ marginTop: 24, flexGrow: 0 }}
					/>
				</View>
				<View style={{ marginBottom: 24 }}>
					<Button.Solid
						title='Exit'
						onPress={() => navigation.pop()}
						containerStyle={{ marginBottom: 24 }}
					/>
					<Button.Solid
						title='Play again'
						onPress={() => navigation.replace('OneVsOne')}
					/>
				</View>
			</SafeAreaView>
		</ImageBackground>
	);
};

export { ResultsScreen };
