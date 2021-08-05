import React, { FC, useState, useEffect, useContext } from 'react';
import { ActivityIndicator, ImageBackground, StatusBar } from 'react-native';
import { ThemeProvider, Avatar } from 'react-native-elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {
	AlertProvider,
	BadgeContext,
	BadgeProvider,
	ProfileProvider,
	SocketProvider,
	SoundProvider
} from '@app/context';
import { AppNativeTheme, AppNavigationTheme } from '@app/theme';
import {
	FriendsScreen,
	HistoryScreen,
	HomeScreen,
	InvitesScreen,
	MatchMakingScreen,
	MultiplayerRoomScreen,
	PracticeScreen,
	QuizScreen,
	ResultsScreen,
	SearchUsersScreen,
	SignupScreen,
	SplashScreen
} from '@app/screens';
import { BottomTabBar, TopTabBar } from '@app/components';
import {
	AppStackParamList,
	BottomTabParamList,
	RootStackParamList,
	TopTabParamList
} from './paramsList';

const AppStack = createStackNavigator<AppStackParamList>();
const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<BottomTabParamList>();
const TopTab = createMaterialTopTabNavigator<TopTabParamList>();

const mainStackScreens: FC = () => {
	return (
		<ProfileProvider>
			<SocketProvider>
				<BadgeProvider>
					<AlertProvider>
						<SplashScreen>
							<Stack.Navigator
								screenOptions={{ headerShown: false }}>
								<Stack.Screen
									name='Main'
									component={bottomTabs}
								/>
								<Stack.Screen
									name='Results'
									component={ResultsScreen}
								/>
								<Stack.Screen
									name='Multiplayer'
									component={MultiplayerRoomScreen}
								/>
								<Stack.Screen
									name='Quiz'
									component={QuizScreen}
								/>
								<Stack.Screen
									name='MatchMaking'
									component={MatchMakingScreen}
								/>
								<Stack.Screen
									name='Practice'
									component={PracticeScreen}
								/>
							</Stack.Navigator>
						</SplashScreen>
					</AlertProvider>
				</BadgeProvider>
			</SocketProvider>
		</ProfileProvider>
	);
};

const bottomTabs: FC = () => {
	return (
		<Tab.Navigator
			initialRouteName='Home'
			tabBar={props => <BottomTabBar {...props} />}
			backBehavior='initialRoute'>
			<Tab.Screen
				name='History'
				component={HistoryScreen}
				options={{
					tabBarLabel: 'Activity',
					tabBarIcon: () => (
						<Avatar
							size='small'
							source={require('@assets/history.png')}
							renderPlaceholderContent={<ActivityIndicator />}
						/>
					)
				}}
			/>
			<Tab.Screen
				name='Home'
				component={HomeScreen}
				options={{
					tabBarLabel: 'Battle',
					tabBarIcon: () => (
						<Avatar
							size='small'
							source={require('@assets/battle.png')}
							renderPlaceholderContent={<ActivityIndicator />}
						/>
					)
				}}
			/>
			<Tab.Screen
				name='People'
				component={topTabs}
				options={{
					tabBarLabel: 'Friends',
					tabBarIcon: () => (
						<Avatar
							size='small'
							source={require('@assets/friends.png')}
							renderPlaceholderContent={<ActivityIndicator />}
						/>
					)
				}}
			/>
		</Tab.Navigator>
	);
};

const topTabs: FC = () => {
	const { top } = useSafeAreaInsets();
	const {
		state: { invites, friends }
	} = useContext(BadgeContext);

	return (
		<ImageBackground
			source={require('@assets/background.jpg')}
			style={{ flex: 1 }}>
			<TopTab.Navigator
				style={{ marginTop: top }}
				backBehavior='initialRoute'
				tabBar={props => <TopTabBar {...props} />}>
				<TopTab.Screen
					name='Invites'
					component={InvitesScreen}
					options={{ tabBarLabel: invites.toString() }}
				/>
				<TopTab.Screen
					name='Friends'
					component={FriendsScreen}
					options={{ tabBarLabel: friends.toString() }}
				/>
				<TopTab.Screen name='Players' component={SearchUsersScreen} />
			</TopTab.Navigator>
		</ImageBackground>
	);
};

const NavigationProvider: FC = () => {
	const [user, setUser] = useState<FirebaseAuthTypes.User | null>();

	useEffect(() => {
		const unsubscribe = auth().onAuthStateChanged(user => setUser(user));
		return unsubscribe;
	}, []);

	const getInitialRoute = (): keyof AppStackParamList => {
		if (user) {
			return 'mainFlow';
		}
		return 'Signup';
	};

	if (user === undefined) {
		return null;
	}

	return (
		<ThemeProvider theme={AppNativeTheme} useDark>
			<SoundProvider>
				<NavigationContainer theme={AppNavigationTheme}>
					<StatusBar barStyle='light-content' />
					<AppStack.Navigator
						initialRouteName={getInitialRoute()}
						screenOptions={{ headerShown: false }}>
						<AppStack.Screen
							name='Signup'
							component={SignupScreen}
						/>
						<AppStack.Screen
							name='mainFlow'
							component={mainStackScreens}
						/>
					</AppStack.Navigator>
				</NavigationContainer>
			</SoundProvider>
		</ThemeProvider>
	);
};

export { NavigationProvider };
