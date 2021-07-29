import React, { FC } from 'react';
import {
	ImageBackground,
	ListRenderItem,
	SafeAreaView,
	StyleSheet,
	View
} from 'react-native';
import { Avatar, Text } from 'react-native-elements';
import { FlatList } from 'react-native-gesture-handler';
import { RNToasty } from 'react-native-toasty';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@app/navigation';
import { Colors, FontFamily } from '@app/theme';
import { Player } from '@app/models';
import { BASE_URL } from '@app/api/client';
import { Loading, QuestionView } from '@app/components';
import { useSockets } from './socket';

interface Props {
	navigation: StackNavigationProp<RootStackParamList, 'Quiz'>;
	route: RouteProp<RootStackParamList, 'Quiz'>;
}

const QuizScreen: FC<Props> = ({ navigation, route }) => {
	const { battleId, type } = route.params;
	const {
		loading,
		currentUser,
		opponents,
		question,
		correctAnswer,
		position,
		duration,
		selectOption
	} = useSockets(type, battleId, {
		onResults: results => navigation.replace('Results', results),
		onPlayerLeft: username =>
			RNToasty.Info({
				title: `${username} left the match`,
				duration: 1,
				withIcon: false,
				fontFamily: FontFamily.Bold
			})
	});

	const renderPlayer: ListRenderItem<Player> = ({
		item: { _id, username, avatar }
	}) => (
		<View style={{ alignItems: 'center', flexWrap: 'wrap' }}>
			<Avatar
				size='large'
				source={{ uri: BASE_URL + avatar }}
				avatarStyle={{
					...styles.avatar,
					...(_id === currentUser._id && styles.currentUser)
				}}
			/>
			<Text style={styles.username}>{username}</Text>
		</View>
	);

	//TODO: add lottie anim of loading on this
	if (true) {
		return <Loading message='Preparing questions...' />;
	}

	const playerUser: Player = {
		_id: currentUser._id!,
		avatar: currentUser.avatar!,
		username: currentUser.username!,
		level: currentUser.level!
	};

	return (
		<ImageBackground
			style={{ flex: 1 }}
			source={require('@assets/background.jpg')}>
			<SafeAreaView style={styles.root}>
				<FlatList
					data={[playerUser, ...opponents]}
					keyExtractor={player => player._id}
					horizontal
					style={{ flexGrow: 0 }}
					contentContainerStyle={styles.contentContainer}
					renderItem={renderPlayer}
				/>
				<QuestionView
					question={question!}
					position={position}
					duration={duration}
					totalQuestions={10}
					correctAnswer={correctAnswer}
					onOptionSelected={id => selectOption(id)}
				/>
			</SafeAreaView>
		</ImageBackground>
	);
};

const styles = StyleSheet.create({
	root: { flex: 1, padding: 12, justifyContent: 'space-between' },
	avatar: { borderRadius: 12 },
	playersContainer: { flexDirection: 'row', justifyContent: 'space-between' },
	contentContainer: {
		justifyContent: 'space-between',
		width: '100%',
		paddingHorizontal: 12
	},
	username: { marginTop: 4, fontSize: 12, flexWrap: 'wrap' },
	currentUser: { borderWidth: 2, borderColor: Colors.curiousBlue }
});

export { QuizScreen };
