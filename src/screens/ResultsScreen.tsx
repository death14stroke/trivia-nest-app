import { Player, Result } from '@app/models';
import React, { FC } from 'react';
import { FlatList, ImageBackground, ListRenderItem, View } from 'react-native';
import { Text } from 'react-native-elements';
import { Avatar } from 'react-native-elements/dist/avatar/Avatar';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Props {
	results: Result[];
}

const ResultsScreen: FC<Props> = ({ results }) => {
	const renderPlayer: ListRenderItem<Result> = ({
		item: { player, score, coins }
	}) => (
		<ImageBackground source={require('@assets/background.jpg')}>
			<View style={{ flexDirection: 'row' }}>
				<Avatar source={{ uri: player.avatar }} size='large' />
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
