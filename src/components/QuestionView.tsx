import React, { FC, useState, useEffect } from 'react';
import {
	Animated,
	FlatList,
	ListRenderItem,
	StyleSheet,
	TouchableOpacity,
	View
} from 'react-native';
import { Text, LinearProgress } from 'react-native-elements';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import { Dimens } from '@app/theme';
import { Question } from '@app/models';
import { LottieOverlay } from './Overlay';

interface Props {
	question: Question;
	position: number;
	duration: number;
	correctAnswer?: string;
	onOptionSelected?: (id: string) => void;
	onTimeup?: () => void;
	totalQuestions: number;
}

const QuestionView: FC<Props> = ({
	question,
	position,
	duration,
	correctAnswer,
	onOptionSelected,
	onTimeup,
	totalQuestions
}) => {
	const [selected, setSelected] = useState<string>();
	const [disabled, setDisabled] = useState(false);

	useEffect(() => {
		setDisabled(false);
		setSelected(undefined);
	}, [position]);

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
					setDisabled(true);
					onOptionSelected?.(id);
				}}
				disabled={disabled}>
				<Text style={{ fontSize: 20, padding: 4 }}>{opt}</Text>
			</TouchableOpacity>
		);
	};

	return (
		<View style={{ flex: 1 }}>
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
						]}
						onComplete={() => {
							setDisabled(true);
							onTimeup?.();
						}}>
						{({ remainingTime }) => (
							<Animated.Text style={styles.timerText}>
								{remainingTime}
							</Animated.Text>
						)}
					</CountdownCircleTimer>
				</View>
				<View style={styles.questionContainer}>
					<View style={{ flexDirection: 'row' }}>
						<Text h4>
							Question {position + 1} of {totalQuestions}
						</Text>
					</View>
					<LinearProgress
						value={(position + 1) / totalQuestions}
						color='red'
						variant='determinate'
						style={{ height: 10, marginVertical: 8 }}
					/>
				</View>
			</View>
			<View style={{ flex: 1, justifyContent: 'space-between' }}>
				<View style={styles.questionCard}>
					<Text style={{ textAlign: 'center', fontSize: 18 }}>
						{question?.question}
					</Text>
				</View>
				<FlatList
					data={question?.options}
					keyExtractor={opt => opt.id}
					renderItem={renderOption}
					style={{ flexGrow: 0, marginBottom: 24 }}
				/>
			</View>
			<LottieOverlay
				isVisible={correctAnswer !== undefined}
				source={
					correctAnswer === selected
						? require('@assets/correct.json')
						: require('@assets/wrong.json')
				}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
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

export { QuestionView };
