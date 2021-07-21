import React, { FC, useState, useEffect } from 'react';
import { ImageBackground, StatusBar } from 'react-native';
import { ThemeProvider, Avatar } from 'react-native-elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { ProfileProvider, SocketProvider } from '@app/context';
import { AppNativeTheme, AppNavigationTheme, FontFamily } from '@app/theme';
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
import { BottomTabBar } from '@app/components';
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
				<SplashScreen>
					<Stack.Navigator screenOptions={{ headerShown: false }}>
						<Stack.Screen name='Main' component={bottomTabs} />
						<Stack.Screen
							name='Results'
							component={ResultsScreen}
						/>
						<Stack.Screen
							name='Multiplayer'
							component={MultiplayerRoomScreen}
						/>
						<Stack.Screen name='Quiz' component={QuizScreen} />
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
			</SocketProvider>
		</ProfileProvider>
	);
};

const bottomTabs = () => {
	return (
		<Tab.Navigator
			initialRouteName='Home'
			tabBar={props => <BottomTabBar {...props} />}>
			<Tab.Screen
				name='History'
				component={HistoryScreen}
				options={{
					tabBarLabel: 'Activity',
					tabBarIcon: () => (
						<Avatar
							size='small'
							source={require('@assets/history.png')}
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
						/>
					)
				}}
			/>
		</Tab.Navigator>
	);
};

const topTabs = () => {
	const { top } = useSafeAreaInsets();

	return (
		<ImageBackground
			source={require('@assets/background.jpg')}
			style={{ flex: 1 }}>
			<TopTab.Navigator
				style={{ marginTop: top }}
				tabBarOptions={{
					style: { backgroundColor: 'transparent' },
					labelStyle: {
						fontFamily: FontFamily.SemiBold,
						fontSize: 18,
						textTransform: 'none'
					}
				}}>
				<TopTab.Screen name='Invites' component={InvitesScreen} />
				<TopTab.Screen name='Friends' component={FriendsScreen} />
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
			<StatusBar barStyle='light-content' />
			<NavigationContainer theme={AppNavigationTheme}>
				<AppStack.Navigator
					initialRouteName={getInitialRoute()}
					screenOptions={{ headerShown: false }}>
					<AppStack.Screen name='Signup' component={SignupScreen} />
					<AppStack.Screen
						name='mainFlow'
						component={mainStackScreens}
					/>
				</AppStack.Navigator>
			</NavigationContainer>
		</ThemeProvider>
	);
};

export { NavigationProvider };
