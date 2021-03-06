import React, { FC, useState, useContext } from 'react';
import {
	ActivityIndicator,
	ImageBackground,
	Platform,
	SafeAreaView,
	StatusBar,
	StyleSheet,
	View
} from 'react-native';
import { Avatar, Text } from 'react-native-elements';
import { StackNavigationProp } from '@react-navigation/stack';
import questions from '@assets/practice.json';
import { RootStackParamList } from '@app/navigation';
import { Colors } from '@app/theme';
import { AlertContext, ProfileContext } from '@app/context';
import { BASE_URL } from '@app/api/client';
import { QuestionView } from '@app/components';

const QUESTION_DURATION = 15;

interface Props {
	navigation: StackNavigationProp<RootStackParamList, 'Practice'>;
}

const PracticeScreen: FC<Props> = ({ navigation }) => {
	const { state: currentUser } = useContext(ProfileContext);
	const Alert = useContext(AlertContext);
	const [position, setPosition] = useState(0);
	const [correctAnswer, setCorrectAnswer] = useState<string | undefined>();
	const [score, setScore] = useState(0);

	const selectOption = (id: string) => {
		if (questions[position].correctAnswer === id) {
			setScore(score + 1);
		}
	};

	const revealAnswer = () => {
		setCorrectAnswer(questions[position].correctAnswer);

		setTimeout(() => {
			nextQuestion();
		}, 1000);
	};

	const nextQuestion = () => {
		if (position < questions.length - 1) {
			setCorrectAnswer(undefined);
			setPosition(position + 1);
		} else {
			setCorrectAnswer(undefined);
			Alert.alert({
				title: 'Results',
				description: `Your score: ${score} / ${questions.length}`,
				onSuccess: () => navigation.replace('Main')
			});
		}
	};

	const renderCurrentUser = () => {
		const { username, avatar } = currentUser;

		return (
			<View style={{ alignItems: 'center', flexWrap: 'wrap' }}>
				<Avatar
					size='large'
					source={{ uri: BASE_URL + avatar }}
					avatarStyle={styles.avatar}
					renderPlaceholderContent={<ActivityIndicator />}
				/>
				<Text style={styles.username}>{username}</Text>
			</View>
		);
	};

	return (
		<ImageBackground
			style={{ flex: 1, paddingHorizontal: 12 }}
			source={require('@assets/background.jpg')}>
			<SafeAreaView style={styles.root}>
				{renderCurrentUser()}
				<QuestionView
					question={questions[position]}
					totalQuestions={questions.length}
					position={position}
					duration={QUESTION_DURATION}
					correctAnswer={correctAnswer}
					onOptionSelected={selectOption}
					onTimeup={revealAnswer}
				/>
			</SafeAreaView>
		</ImageBackground>
	);
};

const styles = StyleSheet.create({
	root: {
		flex: 1,
		...Platform.select({
			android: { paddingTop: (StatusBar.currentHeight ?? 0) + 4 }
		})
	},
	avatar: {
		borderRadius: 12,
		borderWidth: 2,
		borderColor: Colors.curiousBlue
	},
	username: { marginTop: 4, fontSize: 12, flexWrap: 'wrap' }
});

export { PracticeScreen };
