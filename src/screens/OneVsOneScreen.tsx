import { BASE_URL } from '@app/api/client';
import { WaitingTimer } from '@app/components';
import { ProfileContext } from '@app/context';
import { useCurrentUser } from '@app/hooks/firebase';
import { showToast } from '@app/hooks/ui';
import { Player, Question } from '@app/models';
import { RootStackParamList } from '@app/navigation';
import { Dimens } from '@app/theme';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { FC, useEffect, useRef } from 'react';
import { useContext } from 'react';
import { useReducer } from 'react';
import { useState } from 'react';
import { Animated, FlatList, ImageBackground, StyleSheet } from 'react-native';
import { ListRenderItem } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { View } from 'react-native';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import { Text } from 'react-native-elements';
import { Avatar } from 'react-native-elements/dist/avatar/Avatar';
import LinearProgress from 'react-native-elements/dist/linearProgress/LinearProgress';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Socket, io } from 'socket.io-client';
import LottieView from 'lottie-react-native';

interface Props {
	navigation: StackNavigationProp<RootStackParamList, 'OneVsOne'>;
}

type State = {
	battleId?: string;
	opponent?: Player;
	question?: Question;
	correctAnswer?: string;
};

type Action = {
	type: 'update_opponent' | 'update_question' | 'update_correct_answer';
	payload?: any;
};

const quizReducer = (state: State, action: Action): State => {
	switch (action.type) {
		case 'update_opponent':
			const { battleId, opponent } = action.payload;
			return { ...state, battleId, opponent };
		case 'update_question':
			return {
				...state,
				correctAnswer: undefined,
				question: action.payload
			};
		case 'update_correct_answer':
			return { ...state, correctAnswer: action.payload };
		default:
			return state;
	}
};

//TODO: correct/wrong animation, results screen

const OneVsOneScreen: FC<Props> = ({ navigation }) => {
	const [timer, setTimer] = useState(true);
	const [loading, setLoading] = useState(false);
	const [selected, setSelected] = useState<string>();
	const [state, dispatch] = useReducer(quizReducer, {});
	const { state: currentUser } = useContext(ProfileContext);
	const socket = useRef<Socket>();
	const { battleId, opponent, question, correctAnswer } = state;
	const [duration, setDuration] = useState<number>(15);
	const [pos, setPos] = useState(0);

	useEffect(() => {
		init();

		return leaveRoom;
	}, []);

	const init = async () => {
		const token = await useCurrentUser()?.getIdToken();
		if (!token) {
			showToast('Could not connect to game server!');
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
				console.log('players:', players);
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
			dispatch({ type: 'update_correct_answer', payload: prevAns });

			setTimeout(() => {
				dispatch({ type: 'update_question', payload: question });
				setLoading(false);
				setSelected(undefined);
				setDuration(Math.round((next - Date.now()) / 1000));
				setPos(pos);
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
				style={{
					backgroundColor,
					borderRadius: Dimens.borderRadius,
					padding: 12,
					marginVertical: 8
				}}
				onPress={() => {
					console.log('selected:', id);
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

	if (timer) {
		return <WaitingTimer onCancel={onCancel} />;
	}

	if (loading) {
		return <Text>Loading...</Text>;
	}

	if (correctAnswer) {
		return (
			<LottieView
				autoPlay
				source={
					correctAnswer === selected
						? require('@assets/correct.json')
						: require('@assets/wrong.json')
				}
			/>
		);
	}

	return (
		<ImageBackground
			style={{ flex: 1 }}
			source={require('@assets/background.jpg')}>
			<SafeAreaView
				style={{
					flex: 1,
					padding: 12,
					justifyContent: 'space-between'
				}}>
				<View style={{ flex: 1 }}>
					<View
						style={{
							flexDirection: 'row',
							justifyContent: 'space-between'
						}}>
						<View>
							<Avatar
								size='large'
								source={{ uri: BASE_URL + currentUser?.avatar }}
								containerStyle={styles.avatar}
								avatarStyle={styles.avatar}
							/>
							<Text style={{ marginTop: 4, fontSize: 16 }}>
								{currentUser?.username}
							</Text>
						</View>
						<View>
							<Avatar
								size='large'
								source={{ uri: BASE_URL + opponent?.avatar }}
								containerStyle={styles.avatar}
								avatarStyle={styles.avatar}
							/>
							<Text style={{ marginTop: 4, fontSize: 16 }}>
								{opponent?.username}
							</Text>
						</View>
					</View>
					<View
						style={{
							flexDirection: 'row',
							justifyContent: 'center',
							alignItems: 'center',
							alignContent: 'center',
							marginTop: 18
						}}>
						<View
							style={{
								justifyContent: 'center',
								marginEnd: 12,
								alignItems: 'center'
							}}>
							<CountdownCircleTimer
								key={pos}
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
									<Animated.Text
										style={{
											color: 'white',
											fontSize: 24
										}}>
										{remainingTime}
									</Animated.Text>
								)}
							</CountdownCircleTimer>
						</View>
						<View
							style={{
								flex: 1,
								justifyContent: 'center'
							}}>
							<View style={{ flexDirection: 'row' }}>
								<Text h4>Question {pos + 1} of 10</Text>
							</View>
							<LinearProgress
								value={(pos + 1) / 10}
								color='red'
								variant='determinate'
								style={{ height: 10, marginVertical: 8 }}
							/>
						</View>
					</View>
					<View
						style={{
							backgroundColor: '#162447',
							borderRadius: Dimens.borderRadius,
							padding: 12,
							marginTop: 24
						}}>
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
			</SafeAreaView>
		</ImageBackground>
	);
};

const styles = StyleSheet.create({
	root: { flex: 1, backgroundColor: 'blue' },

	avatar: { borderRadius: 12 }
});

export { OneVsOneScreen };
