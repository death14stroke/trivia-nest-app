import React, { FC, memo } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Avatar, Image, Text } from 'react-native-elements';
import { Dimens } from '@app/theme';
import { IntroMode } from '@app/models';
import { Button } from './Button';

interface Props {
	mode: IntroMode;
	onModeSelected?: () => void;
	containerStyle?: StyleProp<ViewStyle>;
}

const IntroCard: FC<Props> = ({ mode, onModeSelected, containerStyle }) => {
	const { title, description, cost, image } = mode;

	return (
		<View style={[styles.card, containerStyle]}>
			<View style={{ flex: 1 }}>
				<Image source={image} style={styles.image} />
			</View>
			<View style={styles.textContainer}>
				<Text h3 style={styles.title}>
					{title}
				</Text>
				<Text h4 style={styles.description}>
					{description}
				</Text>
				<Button.Solid
					title={cost === 0 ? 'Free' : cost.toString()}
					titleStyle={styles.buttonTitle}
					onPress={onModeSelected}
					iconPosition='right'
					icon={
						<Avatar
							size='small'
							source={require('@assets/coins.png')}
							containerStyle={{ marginStart: 8 }}
						/>
					}
				/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	card: {
		borderRadius: Dimens.borderRadius,
		padding: 0,
		backgroundColor: 'black',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.5,
		shadowRadius: 16,
		elevation: 8
	},
	image: {
		borderTopLeftRadius: Dimens.borderRadius,
		borderTopRightRadius: Dimens.borderRadius,
		height: '100%',
		overflow: 'hidden'
	},
	title: {
		color: 'white',
		textAlign: 'center',
		fontWeight: 'bold'
	},
	description: {
		color: 'white',
		textAlign: 'center',
		marginVertical: 12
	},
	textContainer: {
		padding: 12,
		flex: 1,
		justifyContent: 'space-between'
	},
	buttonTitle: { fontWeight: '600', fontSize: 24 }
});

export default memo(IntroCard);
