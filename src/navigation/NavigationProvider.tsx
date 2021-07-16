import {
	HomeScreen,
	MultiplayerRoomScreen,
	OneVsOneScreen,
	ResultsScreen,
	SignupScreen,
	SplashScreen
} from '@app/screens';
import { AppNativeTheme, AppNavigationTheme } from '@app/theme';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { FC } from 'react';
import { Alert, StatusBar } from 'react-native';
import { ThemeProvider } from 'react-native-elements';
import { ProfileProvider, SocketProvider } from '@app/context';
import { AppStackParamList, RootStackParamList } from './paramsList';
import { useState } from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useRef } from 'react';
import { useCurrentUser } from '@app/hooks/firebase';
import { BASE_URL } from '@app/api/client';

const AppStack = createStackNavigator<AppStackParamList>();
const Stack = createStackNavigator<RootStackParamList>();

// TODO: socket id changing in different screens. Create socket context and move all socket code there. Expose functions for emit and on events
const mainStackScreens: FC = () => {
	return (
		<ProfileProvider>
			<SocketProvider>
				<SplashScreen>
					<Stack.Navigator>
						<Stack.Screen
							name='Home'
							component={HomeScreen}
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
					</Stack.Navigator>
				</SplashScreen>
			</SocketProvider>
		</ProfileProvider>
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
