import React, { FC, useContext, useEffect, useReducer, useState } from 'react';
import {
	ImageBackground,
	ListRenderItem,
	SafeAreaView,
	StyleSheet,
	View
} from 'react-native';
import { Avatar, Text, useTheme } from 'react-native-elements';
import { FlatList } from 'react-native-gesture-handler';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@app/navigation';
import { Colors } from '@app/theme';
import { ProfileContext, SocketContext } from '@app/context';
import { Player, Question, SocketEvent } from '@app/models';
import { BASE_URL } from '@app/api/client';
import { showToast } from '@app/hooks/ui';
import { QuestionView } from '@app/components';

type State = {
	battleId?: string;
	opponents: Player[];
	question?: Question;
	correctAnswer?: string;
	position: number;
};

type Action = {
	type: 'update_opponent' | 'update_question' | 'update_correct_answer';
	payload?: any;
};

const quizReducer = (state: State, action: Action): State => {
	switch (action.type) {
		case 'update_opponent':
			return { ...state, ...action.payload };
		case 'update_question':
			return {
				...state,
				correctAnswer: undefined,
				...action.payload
			};
		case 'update_correct_answer':
			return { ...state, correctAnswer: action.payload };
		default:
			return state;
	}
};

interface Props {
	navigation: StackNavigationProp<RootStackParamList, 'Quiz'>;
}

//TODO: navigate here on 'STARTING' event. Send 'READY' event in useeffect and wait for 'START' from server. On server set a timeout if all players ready in time like 5 sec
const QuizScreen: FC<Props> = ({ navigation }) => {
	const {
		theme: { colors }
	} = useTheme();
	const { state: currentUser } = useContext(ProfileContext);
	const socket = useContext(SocketContext);

	const [loading, setLoading] = useState(true);
	const [duration, setDuration] = useState<number>(15);
	const [state, dispatch] = useReducer(quizReducer, {
		opponents: [],
		position: 0
	});

	useEffect(() => {
		socket?.emit(SocketEvent.READY);

		socket?.once(
			SocketEvent.START,
			({
				battleId,
				players
			}: {
				battleId: string;
				players: Player[];
			}) => {
				dispatch({
					type: 'update_opponent',
					payload: {
						battleId,
						opponents: players.filter(
							player => player._id !== currentUser!._id
						)
					}
				});
			}
		);

		socket?.on(SocketEvent.QUESTION, ({ pos, question, next, prevAns }) => {
			if (pos === 0) {
				dispatch({
					type: 'update_question',
					payload: { question, position: pos }
				});
				setLoading(false);
				setDuration(Math.round((next - Date.now()) / 1000));
				return;
			}

			dispatch({
				type: 'update_correct_answer',
				payload: prevAns
			});

			setTimeout(() => {
				dispatch({
					type: 'update_question',
					payload: { question, position: pos }
				});
				setLoading(false);
				setDuration(Math.round((next - Date.now()) / 1000));
			}, 1000);
		});

		socket?.on(SocketEvent.RESULTS, ({ results, prevAns }) => {
			socket.off(SocketEvent.LEAVE_1V1_BATTLE);
			dispatch({
				type: 'update_correct_answer',
				payload: prevAns
			});

			setTimeout(() => {
				navigation.replace('Results', results);
			}, 1000);
		});

		socket?.on(SocketEvent.LEAVE_1V1_BATTLE, uid => {
			const player = opponents.find(({ _id }) => _id === uid);
			showToast(`${player?.username} has left the battle`);
		});

		return leaveRoom;
	}, []);

	const leaveRoom = () => {
		socket?.emit(SocketEvent.LEAVE_BATTLE);
	};

	const selectOption = (optionId: string) => {
		socket?.emit(SocketEvent.ANSWER, {
			battleId,
			questionId: question?._id,
			answer: optionId
		});
	};

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

	const { battleId, opponents, question, correctAnswer, position } = state;

	if (loading) {
		return <Text>Loading...</Text>;
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
			<SafeAreaView style={styles.safeArea}>
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
					correctAnswer={correctAnswer}
					onOptionSelected={id => selectOption(id)}
				/>
			</SafeAreaView>
		</ImageBackground>
	);
};

const styles = StyleSheet.create({
	safeArea: { flex: 1, padding: 12, justifyContent: 'space-between' },
	avatar: { borderRadius: 12 },
	playersContainer: { flexDirection: 'row', justifyContent: 'space-between' },
	contentContainer: {
		justifyContent: 'space-between',
		width: '100%',
		paddingHorizontal: 12
	},
	username: {
		marginTop: 4,
		fontSize: 12,
		flexWrap: 'wrap'
	},
	currentUser: {
		borderWidth: 2,
		borderColor: Colors.curiousBlue
	}
});

export { QuizScreen };
