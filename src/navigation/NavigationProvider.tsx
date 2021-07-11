import { HomeScreen, SignupScreen } from '@app/screens';
import { AppNativeTheme, AppNavigationTheme } from '@app/theme';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { FC, useContext } from 'react';
import { StatusBar } from 'react-native';
import { ThemeProvider } from 'react-native-elements';
import { ProfileContext } from '@app/context';
import { RootStackParamList } from './paramsList';

const Stack = createStackNavigator<RootStackParamList>();

const stackScreens = (initialRoute: keyof RootStackParamList) => {
	return (
		<Stack.Navigator initialRouteName={initialRoute}>
			<Stack.Screen
				name='Signup'
				component={SignupScreen}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name='Home'
				component={HomeScreen}
				options={{ headerShown: false }}
			/>
		</Stack.Navigator>
	);
};

const NavigationProvider: FC = () => {
	const { state: user } = useContext(ProfileContext);

	const getInitialRoute = (): keyof RootStackParamList => {
		if (user) {
			return 'Home';
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
				{stackScreens(getInitialRoute())}
			</NavigationContainer>
		</ThemeProvider>
	);
};

export { NavigationProvider };
