import React, { FC, useState, useReducer, useContext, useEffect } from 'react';
import { View, ImageBackground, StyleSheet } from 'react-native';
import { Text, Avatar, useTheme } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@app/navigation';
import { ProfileContext, SocketContext } from '@app/context';
import { Player, Question, SocketEvent } from '@app/models';
import { BASE_URL } from '@app/api/client';
import { showToast } from '@app/hooks/ui';
import { QuestionView, WaitingTimer } from '@app/components';

interface Props {
	navigation: StackNavigationProp<RootStackParamList, 'OneVsOne'>;
}

type State = {
	battleId?: string;
	opponent?: Player;
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

const OneVsOneScreen: FC<Props> = ({ navigation }) => {
	const {
		theme: { colors }
	} = useTheme();
	const { state: currentUser } = useContext(ProfileContext);
	const socket = useContext(SocketContext);

	const [timer, setTimer] = useState(true);
	const [loading, setLoading] = useState(false);
	const [duration, setDuration] = useState<number>(15);
	const [state, dispatch] = useReducer(quizReducer, { position: 0 });

	const { battleId, opponent, question, correctAnswer, position } = state;

	useEffect(() => {
		init();
		return leaveRoom;
	}, []);

	const init = async () => {
		socket?.emit(SocketEvent.JOIN_WAITING_ROOM);

		socket?.on('error', ({ message }) => {
			showToast(message);
			navigation.pop();
		});

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
						opponent: players.find(
							player => player._id !== currentUser!._id
						)
					}
				});
				setTimer(false);
				setLoading(true);
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
			showToast(`${uid} has left the battle`);
		});
	};

	const leaveRoom = () => {
		socket?.emit(SocketEvent.LEAVE_WAITING_ROOM);
		socket?.emit(SocketEvent.LEAVE_1V1_BATTLE);
	};

	const onCancel = () => {
		navigation.pop();
	};

	const renderPlayer = ({ avatar, username, _id }: Player) => (
		<View style={{ alignItems: 'center' }}>
			<Avatar
				size='large'
				source={{ uri: BASE_URL + avatar }}
				containerStyle={[
					styles.avatar,
					_id === currentUser?._id && {
						borderWidth: 2,
						borderColor: colors?.primary
					}
				]}
				avatarStyle={styles.avatar}
			/>
			<Text style={{ marginTop: 4, fontSize: 16 }}>{username}</Text>
		</View>
	);

	if (timer) {
		return <WaitingTimer onCancel={onCancel} />;
	}

	if (loading) {
		return <Text>Loading...</Text>;
	}

	return (
		<ImageBackground
			style={{ flex: 1 }}
			source={require('@assets/background.jpg')}>
			<SafeAreaView style={styles.safeArea}>
				<View style={styles.playersContainer}>
					{renderPlayer(currentUser)}
					{renderPlayer(opponent!)}
					{renderPlayer(opponent!)}
					{renderPlayer(opponent!)}
				</View>
				<QuestionView
					question={question!}
					position={position}
					duration={duration}
					correctAnswer={correctAnswer}
					onOptionSelected={id => {
						socket?.emit(SocketEvent.ANSWER, {
							battleId,
							questionId: question?._id,
							answer: id
						});
					}}
				/>
			</SafeAreaView>
		</ImageBackground>
	);
};

const styles = StyleSheet.create({
	safeArea: { flex: 1, padding: 12, justifyContent: 'space-between' },
	avatar: { borderRadius: 12 },
	playersContainer: { flexDirection: 'row', justifyContent: 'space-between' }
});

export { OneVsOneScreen };
