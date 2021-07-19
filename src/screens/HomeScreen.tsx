import React, { FC, useContext, useState } from 'react';
import {
	View,
	StyleSheet,
	Dimensions,
	ListRenderItem,
	ImageBackground
} from 'react-native';
import { Avatar, Icon, Text, Theme, useTheme } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import Carousel from 'react-native-snap-carousel';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { StackNavigationProp } from '@react-navigation/stack';
import { BottomTabParamList, RootStackParamList } from '@app/navigation';
import { ProfileContext } from '@app/context';
import { CurrentUser, IntroMode, Mode } from '@app/models';
import { BASE_URL } from '@app/api/client';
import { apiGetAvatars, apiUpdateUserProfile } from '@app/api/users';
import { showToast } from '@app/hooks/ui';
import { IntroCard, ProfileModal, SelectAvatarModal } from '@app/components';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { FontFamily } from '@app/theme';

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
	navigation: CompositeNavigationProp<
		StackNavigationProp<RootStackParamList, 'Main'>,
		BottomTabNavigationProp<BottomTabParamList, 'Home'>
	>;
}

const HomeScreen: FC<Props> = ({ navigation }) => {
	const styles = useStyles(useTheme().theme);
	const queryClient = useQueryClient();
	const {
		state: user,
		actions: { updateProfile }
	} = useContext(ProfileContext);

	const [avatarModal, setAvatarModal] = useState(false);
	const [profileModal, setProfileModal] = useState(false);

	const { data: avatars } = useQuery<string[]>('avatars', apiGetAvatars, {
		staleTime: 120 * 60 * 1000
	});

	const { mutate } = useMutation<
		unknown,
		unknown,
		{ username?: string; avatar?: string },
		CurrentUser | undefined
	>(params => apiUpdateUserProfile(params), {
		onMutate: async params => {
			await queryClient.cancelQueries('me');
			updateProfile(params);

			const prevProfile = queryClient.getQueryData<CurrentUser>('me');
			queryClient.setQueryData('me', { ...prevProfile, ...params });

			return prevProfile;
		},
		onSuccess: () => showToast('Profile updated!'),
		onError: (_err, _params, context) => {
			showToast('Could not update profile');
			queryClient.setQueryData('me', context);
		}
	});

	const toggleProfileModal = () => setProfileModal(!profileModal);
	const toggleAvatarModal = () => setAvatarModal(!avatarModal);

	const navigateToGame = (key: Mode) => {
		if (key === '1v1') {
			navigation.navigate('MatchMaking');
		} else if (key === 'multi') {
			navigation.navigate('Multiplayer');
		}
	};

	const renderIntroCard: ListRenderItem<IntroMode> = ({ item }) => (
		<IntroCard
			mode={item}
			currentCoins={user?.coins ?? 0}
			containerStyle={{ minHeight: '75%' }}
			onModeSelected={() => navigateToGame(item.key)}
		/>
	);

	return (
		<ImageBackground
			source={require('@assets/background.jpg')}
			style={{ flex: 1 }}>
			<SafeAreaView style={styles.root}>
				<View style={styles.header}>
					<Avatar
						size='large'
						source={{ uri: BASE_URL + user?.avatar }}
						containerStyle={styles.avatar}
						avatarStyle={styles.avatar}
						onPress={toggleAvatarModal}
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
						<Text style={{ textAlign: 'right' }}>
							{user?.coins}
						</Text>
					</View>
					{/* TODO: toggle settings modal instead */}
					<Avatar
						rounded
						icon={{ type: 'ionicon', name: 'person' }}
						containerStyle={styles.profileIcon}
						onPress={toggleProfileModal}
					/>
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
					<Text style={styles.footer}>Made with </Text>
					<Icon type='ionicon' name='heart' color='red' />
					<Text style={styles.footer}> in India </Text>
				</View>
				<SelectAvatarModal
					open={avatarModal}
					data={avatars ?? []}
					defaultAvatar={user?.avatar}
					onCancel={toggleAvatarModal}
					onSuccess={avatar => {
						mutate({ avatar });
						toggleAvatarModal();
					}}
				/>
				<ProfileModal
					open={profileModal}
					onClose={toggleProfileModal}
					onBackdropPress={toggleProfileModal}
				/>
			</SafeAreaView>
		</ImageBackground>
	);
};

const useStyles = ({ colors }: Theme) =>
	StyleSheet.create({
		root: { flex: 1 },
		header: {
			flexDirection: 'row',
			backgroundColor: 'black',
			borderRadius: 12,
			marginHorizontal: 12,
			alignItems: 'center'
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
		},
		profileIcon: {
			backgroundColor: colors?.primary,
			marginHorizontal: 8
		},
		footer: { fontSize: 18, fontFamily: FontFamily.Bold }
	});

export { HomeScreen };
