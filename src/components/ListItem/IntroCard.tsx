import React, { FC, memo } from 'react';
import {
	View,
	StyleSheet,
	StyleProp,
	ViewStyle,
	ActivityIndicator
} from 'react-native';
import { Avatar, Image, Text } from 'react-native-elements';
import { Dimens, FontFamily } from '@app/theme';
import { IntroMode } from '@app/models';
import { Button } from '../Button';

interface Props {
	mode: IntroMode;
	currentCoins: number;
	onModeSelected?: () => void;
	containerStyle?: StyleProp<ViewStyle>;
}

const IntroCard: FC<Props> = ({
	mode,
	currentCoins,
	onModeSelected,
	containerStyle
}) => {
	const { title, description, cost, image } = mode;

	return (
		<View style={[styles.card, containerStyle]}>
			<Image
				source={image}
				style={styles.image}
				PlaceholderContent={<ActivityIndicator />}
			/>
			<View style={styles.textContainer}>
				<Text h3 h3Style={styles.title}>
					{title}
				</Text>
				<Text style={styles.description}>{description}</Text>
			</View>
			<View style={styles.button}>
				<Button.Raised
					onPress={onModeSelected}
					disabled={currentCoins < cost}>
					<Text style={styles.buttonTitle}>
						{cost === 0 ? 'Free' : cost.toString()}
					</Text>
					<Avatar
						size='small'
						source={require('@assets/coins.png')}
						containerStyle={{ marginStart: 8 }}
						renderPlaceholderContent={<ActivityIndicator />}
					/>
				</Button.Raised>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	card: {
		justifyContent: 'space-between',
		borderRadius: Dimens.borderRadius,
		backgroundColor: 'black',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.5,
		shadowRadius: 16,
		elevation: 8
	},
	image: {
		borderTopLeftRadius: Dimens.borderRadius,
		borderTopRightRadius: Dimens.borderRadius,
		aspectRatio: 1.2
	},
	title: { textAlign: 'center', fontFamily: FontFamily.Bold },
	description: {
		textAlign: 'center',
		marginVertical: 12,
		fontFamily: FontFamily.ExtraLight,
		fontSize: 20
	},
	textContainer: { padding: 12 },
	button: { marginHorizontal: 12, marginBottom: 12 },
	buttonTitle: { fontFamily: FontFamily.Bold, fontSize: 24 }
});

export default memo(IntroCard);
