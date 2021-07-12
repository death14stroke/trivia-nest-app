import { BASE_URL } from '@app/api/client';
import { WaitingTimer } from '@app/components';
import { ProfileContext } from '@app/context';
import { useCurrentUser } from '@app/hooks/firebase';
import { showToast } from '@app/hooks/ui';
import { Player, Question } from '@app/models';
import { RootStackParamList } from '@app/navigation';
import { Dimens } from '@app/theme';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { Dispatch, FC, useEffect, useRef } from 'react';
import { useCallback } from 'react';
import { useContext } from 'react';
import { useReducer } from 'react';
import { useState } from 'react';
import { FlatList, ImageBackground, StyleSheet } from 'react-native';
import { ListRenderItem } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { View } from 'react-native';
import { Text } from 'react-native-elements';
import { Avatar } from 'react-native-elements/dist/avatar/Avatar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Socket, io } from 'socket.io-client';

interface Props {
	navigation: StackNavigationProp<RootStackParamList, 'OneVsOne'>;
}

type State = {
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
			return { ...state, opponent: action.payload };
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

//TODO: update timer and receive answer at server

const OneVsOneScreen: FC<Props> = ({ navigation }) => {
	const [timer, setTimer] = useState(true);
	const [loading, setLoading] = useState(false);
	const [selected, setSelected] = useState<string>();
	const [state, dispatch] = useReducer(quizReducer, {});
	const { state: currentUser } = useContext(ProfileContext);
	const socket = useRef<Socket>();
	const { opponent, question, correctAnswer } = state;
	const [countDown, setCountDown] = useState(15);

	useEffect(() => {
		init();

		return leaveRoom;
	}, []);

	const updateCountDown = useCallback(
		timer => {
			if (countDown === 0) {
				clearInterval(timer);
			}
			setCountDown(prevCountDown => prevCountDown - 1);
		},
		[countDown]
	);

	const init = async () => {
		const token = await useCurrentUser()?.getIdToken();
		if (!token) {
			showToast('Could not connect to game server!');
			return;
		}

		socket.current = io(BASE_URL, { auth: { token } });
		socket.current.emit('joinWaitingRoom');

		socket.current.once('start', ({ players }: { players: Player[] }) => {
			console.log('players:', players);
			dispatch({
				type: 'update_opponent',
				payload: players.find(player => player._id !== currentUser!._id)
			});
			setTimer(false);
			setLoading(true);
		});

		socket.current.on('question', ({ pos, question, next }) => {
			setLoading(false);
			setSelected(undefined);
			setCountDown((next - Date.now()) / 1000);
			const timer = setInterval(updateCountDown, 1000);
			dispatch({ type: 'update_question', payload: question });
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
						battleId: '',
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
				<View>
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
							<Text style={{ marginTop: 4 }}>
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
							<Text style={{ marginTop: 4 }}>
								{opponent?.username}
							</Text>
						</View>
					</View>
					<Text>{countDown.toFixed(0)}</Text>
					<View
						style={{
							backgroundColor: '#162447',
							borderRadius: Dimens.borderRadius,
							padding: 12,
							marginTop: 24
						}}>
						<Text
							h4
							h4Style={{
								textAlign: 'center'
							}}>
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
