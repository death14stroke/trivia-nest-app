import React, {
	FC,
	useState,
	useReducer,
	useContext,
	useEffect,
	useRef
} from 'react';
import {
	View,
	Animated,
	FlatList,
	ImageBackground,
	StyleSheet,
	ListRenderItem,
	TouchableOpacity
} from 'react-native';
import { Text, Avatar, LinearProgress } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import { Socket, io } from 'socket.io-client';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@app/navigation';
import { Dimens } from '@app/theme';
import { ProfileContext } from '@app/context';
import { Player, Question } from '@app/models';
import { BASE_URL } from '@app/api/client';
import { useCurrentUser } from '@app/hooks/firebase';
import { showToast } from '@app/hooks/ui';
import { LottieOverlay, WaitingTimer } from '@app/components';

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
	const { state: currentUser } = useContext(ProfileContext);
	const socket = useRef<Socket>();

	const [timer, setTimer] = useState(true);
	const [loading, setLoading] = useState(false);
	const [selected, setSelected] = useState<string>();
	const [duration, setDuration] = useState<number>(15);
	const [state, dispatch] = useReducer(quizReducer, { position: 0 });

	const { battleId, opponent, question, correctAnswer, position } = state;

	useEffect(() => {
		init();
		return leaveRoom;
	}, []);

	const init = async () => {
		const token = await useCurrentUser()?.getIdToken();
		if (!token) {
			showToast('Could not connect to game server!');
			navigation.pop();
			return;
		}

		socket.current = io(BASE_URL, { auth: { token } });
		socket.current.emit('joinWaitingRoom');

		socket.current.once(
			'start',
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

		socket.current.on('question', ({ pos, question, next, prevAns }) => {
			dispatch({
				type: 'update_correct_answer',
				payload: { correctAnswer: prevAns, position: pos }
			});

			setTimeout(() => {
				dispatch({ type: 'update_question', payload: question });
				setLoading(false);
				setSelected(undefined);
				setDuration(Math.round((next - Date.now()) / 1000));
			}, 1000);
		});

		socket.current.on('results', results => {
			console.log(results);
			navigation.navigate('Results', results);
		});
	};

	const leaveRoom = () => {
		socket.current?.disconnect();
	};

	const onCancel = () => {
		leaveRoom();
		navigation.pop();
	};

	const renderOption: ListRenderItem<{ id: string; opt: string }> = ({
		item: { id, opt }
	}) => {
		let backgroundColor = '#162447';
		if (id === selected) {
			if (correctAnswer && correctAnswer !== selected) {
				backgroundColor = 'red';
			} else {
				backgroundColor = 'gray';
			}
		}
		if (id === correctAnswer) {
			backgroundColor = 'green';
		}

		return (
			<TouchableOpacity
				style={[styles.option, { backgroundColor }]}
				onPress={() => {
					setSelected(id);
					socket.current?.emit('answer', {
						battleId,
						questionId: question?._id,
						answer: id
					});
				}}
				disabled={selected !== undefined}>
				<Text style={{ fontSize: 20, padding: 4 }}>{opt}</Text>
			</TouchableOpacity>
		);
	};

	const renderPlayer = (player: Player) => (
		<View>
			<Avatar
				size='large'
				source={{ uri: BASE_URL + player.avatar }}
				containerStyle={styles.avatar}
				avatarStyle={styles.avatar}
			/>
			<Text style={{ marginTop: 4, fontSize: 16 }}>
				{player.username}
			</Text>
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
				<View style={{ flex: 1 }}>
					<View style={styles.playersContainer}>
						{renderPlayer(currentUser!)}
						{renderPlayer(opponent!)}
					</View>
					<View style={styles.progressContainer}>
						<View style={styles.timer}>
							<CountdownCircleTimer
								key={position}
								isPlaying
								duration={duration}
								size={75}
								strokeWidth={12}
								colors={[
									['#004777', 0.4],
									['#F7B801', 0.4],
									['#A30000', 0.2]
								]}>
								{({ remainingTime }) => (
									<Animated.Text style={styles.timerText}>
										{remainingTime}
									</Animated.Text>
								)}
							</CountdownCircleTimer>
						</View>
						<View style={styles.questionContainer}>
							<View style={{ flexDirection: 'row' }}>
								<Text h4>Question {position + 1} of 10</Text>
							</View>
							<LinearProgress
								value={(position + 1) / 10}
								color='red'
								variant='determinate'
								style={{ height: 10, marginVertical: 8 }}
							/>
						</View>
					</View>
					<View style={styles.questionCard}>
						<Text style={{ textAlign: 'center', fontSize: 18 }}>
							{question?.question}
						</Text>
					</View>
				</View>
				<FlatList
					data={question?.options}
					keyExtractor={opt => opt.id}
					renderItem={renderOption}
					style={{ flexGrow: 0, marginBottom: 24 }}
				/>
				<LottieOverlay
					isVisible={correctAnswer !== undefined}
					source={
						correctAnswer === selected
							? require('@assets/correct.json')
							: require('@assets/wrong.json')
					}
				/>
			</SafeAreaView>
		</ImageBackground>
	);
};

const styles = StyleSheet.create({
	safeArea: { flex: 1, padding: 12, justifyContent: 'space-between' },
	avatar: { borderRadius: 12 },
	playersContainer: { flexDirection: 'row', justifyContent: 'space-between' },
	progressContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		alignContent: 'center',
		marginTop: 18
	},
	timer: { justifyContent: 'center', marginEnd: 12, alignItems: 'center' },
	timerText: { color: 'white', fontSize: 24 },
	questionContainer: { flex: 1, justifyContent: 'center' },
	questionCard: {
		backgroundColor: '#162447',
		borderRadius: Dimens.borderRadius,
		padding: 12,
		marginTop: 24
	},
	option: {
		borderRadius: Dimens.borderRadius,
		padding: 12,
		marginVertical: 8
	}
});

export { OneVsOneScreen };
