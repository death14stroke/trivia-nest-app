import React, { FC, useContext } from 'react';
import { View, StyleSheet, Dimensions, ListRenderItem } from 'react-native';
import { Avatar, Icon, Text } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import Carousel from 'react-native-snap-carousel';
import { BASE_URL } from '@app/api/client';
import { ProfileContext } from '@app/context';
import { IntroMode, Mode } from '@app/models';
import { IntroCard } from '@app/components';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@app/navigation';

const modes: IntroMode[] = [
	{
		key: '1v1',
		title: '1 vs 1',
		description:
			'Play with random players online and get a chance to win more.',
		cost: 50,
		image: require('@assets/mode_1v1.jpg')
	},
	{
		key: 'multi',
		title: 'Multiplayer',
		description: "Challenge your friends and beat 'em all",
		cost: 20,
		image: require('@assets/mode_multi.jpg')
	},
	{
		key: 'test',
		title: 'How to play?',
		description:
			'Test the interface by giving answers to some fixed questions',
		cost: 0,
		image: require('@assets/mode_test.jpg')
	}
];

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Props {
	navigation: StackNavigationProp<RootStackParamList, 'Home'>;
}

const HomeScreen: FC<Props> = ({ navigation }) => {
	const { state: user } = useContext(ProfileContext);

	const renderIntroCard: ListRenderItem<IntroMode> = ({ item }) => (
		<IntroCard
			mode={item}
			currentCoins={user?.coins ?? 0}
			containerStyle={{ minHeight: '60%' }}
			onModeSelected={() => navigateToGame(item.key)}
		/>
	);

	const navigateToGame = (key: Mode) => {
		if (key === '1v1') {
			navigation.navigate('OneVsOne');
		}
	};

	return (
		<SafeAreaView style={styles.root}>
			<View style={styles.header}>
				<Avatar
					size='large'
					source={{ uri: BASE_URL + user?.avatar }}
					containerStyle={styles.avatar}
					avatarStyle={styles.avatar}
				/>
				<View style={styles.nameContainer}>
					<Text style={styles.username}>{user?.username}</Text>
					<Text style={styles.level}>{user?.level}</Text>
				</View>
				<View style={styles.coinsContainer}>
					<Avatar
						source={require('@assets/coins.png')}
						size='small'
					/>
					<Text style={{ textAlign: 'right' }}>{user?.coins}</Text>
				</View>
			</View>
			<View style={{ flex: 1 }}>
				<Carousel
					data={modes}
					renderItem={renderIntroCard}
					sliderWidth={SCREEN_WIDTH}
					itemWidth={SCREEN_WIDTH * 0.7}
					activeSlideAlignment='center'
					slideStyle={{ justifyContent: 'center' }}
				/>
			</View>
			<View style={styles.footerContainer}>
				<Text style={{ fontSize: 18 }}>Made with </Text>
				<Icon type='ionicon' name='heart' color='red' />
				<Text style={{ fontSize: 18 }}> in India </Text>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	root: { flex: 1, backgroundColor: 'blue' },
	header: {
		flexDirection: 'row',
		backgroundColor: 'black',
		borderRadius: 12,
		marginHorizontal: 12
	},
	avatar: { borderRadius: 12 },
	nameContainer: { justifyContent: 'center', flex: 1, marginStart: 8 },
	username: { fontSize: 24, fontWeight: 'bold' },
	level: { fontSize: 16 },
	coinsContainer: { justifyContent: 'center', marginEnd: 16 },
	footerContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	}
});

export { HomeScreen };
