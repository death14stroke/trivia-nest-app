import { HomeScreen, SignupScreen } from '@app/screens';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { FC, useContext } from 'react';
import { ProfileContext } from 'src/context/ProfileContext';
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

	return (
		<NavigationContainer>
			{stackScreens(getInitialRoute())}
		</NavigationContainer>
	);
};

export { NavigationProvider };
