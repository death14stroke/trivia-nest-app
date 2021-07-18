import React, { FC, useState, useEffect } from 'react';
import { StatusBar } from 'react-native';
import { ThemeProvider } from 'react-native-elements';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ProfileProvider, SocketProvider } from '@app/context';
import { AppNativeTheme, AppNavigationTheme } from '@app/theme';
import {
	FriendsScreen,
	HistoryScreen,
	HomeScreen,
	MatchMakingScreen,
	MultiplayerRoomScreen,
	OneVsOneScreen,
	QuizScreen,
	ResultsScreen,
	SignupScreen,
	SplashScreen
} from '@app/screens';
import { BottomTabBar } from '@app/components';
import {
	AppStackParamList,
	BottomTabParamList,
	RootStackParamList
} from './paramsList';
import { Avatar } from 'react-native-elements/dist/avatar/Avatar';

const AppStack = createStackNavigator<AppStackParamList>();
const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<BottomTabParamList>();

const mainStackScreens: FC = () => {
	return (
		<ProfileProvider>
			<SocketProvider>
				<SplashScreen>
					<Stack.Navigator>
						<Stack.Screen
							name='Main'
							component={bottomTabs}
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name='OneVsOne'
							component={OneVsOneScreen}
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name='Results'
							component={ResultsScreen}
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name='Multiplayer'
							component={MultiplayerRoomScreen}
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name='Quiz'
							component={QuizScreen}
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name='MatchMaking'
							component={MatchMakingScreen}
							options={{ headerShown: false }}
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
							size='medium'
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
							size='medium'
							source={require('@assets/battle.png')}
						/>
					)
				}}
			/>
			<Tab.Screen
				name='Friends'
				component={FriendsScreen}
				options={{
					tabBarLabel: 'Friends',
					tabBarIcon: () => (
						<Avatar
							size='medium'
							source={require('@assets/friends.png')}
						/>
					)
				}}
			/>
		</Tab.Navigator>
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
