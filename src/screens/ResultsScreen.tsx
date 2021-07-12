import { BASE_URL } from '@app/api/client';
import { Result } from '@app/models';
import { RootStackParamList } from '@app/navigation';
import { RouteProp } from '@react-navigation/native';
import React, { FC } from 'react';
import { FlatList, ImageBackground, ListRenderItem, View } from 'react-native';
import { Text } from 'react-native-elements';
import { Avatar } from 'react-native-elements/dist/avatar/Avatar';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Props {
	route: RouteProp<RootStackParamList, 'Results'>;
}

const ResultsScreen: FC<Props> = ({ route }) => {
	const results = route.params;

	const renderPlayer: ListRenderItem<Result> = ({
		item: { player, score, coins }
	}) => (
		<ImageBackground
			source={require('@assets/background.jpg')}
			style={{ width: 'auto', height: 200 }}>
			<View style={{ flexDirection: 'row' }}>
				<Avatar
					source={{ uri: BASE_URL + player.avatar }}
					size='large'
				/>
				<View>
					<Text>{player.username}</Text>
					<Text>{player.level}</Text>
					<View style={{ flexDirection: 'row' }}>
						<Text>{coins}</Text>
						<Avatar
							size='small'
							source={require('@assets/coins.png')}
						/>
						<Text>{score}</Text>
					</View>
				</View>
			</View>
		</ImageBackground>
	);

	console.log('results:', results);

	return (
		<ImageBackground
			source={require('@assets/background.jpg')}
			style={{ flex: 1 }}>
			<SafeAreaView style={{ flex: 1 }}>
				<FlatList
					data={results}
					keyExtractor={result => result.player._id}
					renderItem={renderPlayer}
				/>
			</SafeAreaView>
		</ImageBackground>
	);
};

export { ResultsScreen };
