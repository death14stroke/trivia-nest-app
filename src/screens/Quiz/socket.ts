import { useContext, useEffect, useReducer, useState } from 'react';
import { useQueryClient } from 'react-query';
import { ProfileContext, SocketContext } from '@app/context';
import { Player, Question, Response, Result, SocketEvent } from '@app/models';
import { showToast } from '@app/hooks/ui';

type State = {
	battleId?: string;
	opponents: Player[];
	question?: Question;
	correctAnswer?: string;
	position: number;
	duration: number;
};

type Action = {
	type: 'update_opponent' | 'update_question' | 'update_correct_answer';
	payload?: any;
};

type Game = {
	battleId: string;
	players: Player[];
};

type Callbacks = {
	onResults?: (results: Result[]) => void;
	onPlayerLeft?: (username: string) => void;
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

export const useSockets = (
	type: '1v1' | 'multi',
	battleId: string,
	{ onResults, onPlayerLeft }: Callbacks
) => {
	const queryClient = useQueryClient();
	const socket = useContext(SocketContext);
	const { state: currentUser } = useContext(ProfileContext);
	const [state, dispatch] = useReducer(quizReducer, {
		opponents: [],
		position: 0,
		duration: 15
	});
	const [loading, setLoading] = useState(true);

	const { opponents, question, correctAnswer, position, duration } = state;

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

	useEffect(() => {
		if (type === '1v1') {
			socket?.emit(SocketEvent.READY_1V1, battleId);
		} else {
			socket?.emit(
				SocketEvent.READY_MULTI,
				battleId,
				(resp: Response) => {
					if (resp.status === 'error') {
						showToast(resp.message);
					}
				}
			);
		}

		socket?.once(SocketEvent.START, ({ battleId, players }: Game) => {
			dispatch({
				type: 'update_opponent',
				payload: {
					battleId,
					opponents: players.filter(
						player => player._id !== currentUser!._id
					)
				}
			});
		});

		socket?.on(SocketEvent.QUESTION, ({ pos, question, next, prevAns }) => {
			if (pos === 0) {
				dispatch({
					type: 'update_question',
					payload: {
						question,
						position: pos,
						duration: Math.round((next - Date.now()) / 1000)
					}
				});
				setLoading(false);
				return;
			}

			dispatch({
				type: 'update_correct_answer',
				payload: prevAns
			});

			setTimeout(() => {
				dispatch({
					type: 'update_question',
					payload: {
						question,
						position: pos,
						duration: Math.round((next - Date.now()) / 1000)
					}
				});
			}, 1000);
		});

		socket?.on(SocketEvent.RESULTS, ({ results, prevAns }) => {
			socket.off(SocketEvent.LEAVE_BATTLE);
			queryClient.invalidateQueries('battles');
			queryClient.invalidateQueries('me');
			dispatch({
				type: 'update_correct_answer',
				payload: prevAns
			});

			setTimeout(() => onResults?.(results), 1000);
		});

		socket?.on(SocketEvent.LEAVE_BATTLE, (player: Player) => {
			onPlayerLeft?.(player.username);
		});

		return leaveRoom;
	}, []);

	return {
		loading,
		currentUser,
		opponents,
		question,
		correctAnswer,
		position,
		duration,
		selectOption
	};
};
