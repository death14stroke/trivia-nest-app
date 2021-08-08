import React, { FC } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from 'react-query';
import {
	useFonts,
	Nunito_200ExtraLight,
	Nunito_300Light,
	Nunito_400Regular,
	Nunito_600SemiBold,
	Nunito_700Bold,
	Nunito_800ExtraBold,
	Nunito_900Black
} from '@expo-google-fonts/nunito';
import messaging from '@react-native-firebase/messaging';
import { NavigationProvider } from '@app/navigation';
import { ProfileProvider } from '@app/context';

// Android: Setting a timer for multiple minutes warning for firebase
// expo-constants warning
import { LogBox } from 'react-native';
import { useEffect } from 'react';
LogBox.ignoreLogs(['Setting a timer', 'Constants.']);

const queryClient = new QueryClient();

//TODO: game sound
const App: FC = () => {
	let [fontsLoaded] = useFonts({
		Nunito_200ExtraLight,
		Nunito_300Light,
		Nunito_400Regular,
		Nunito_600SemiBold,
		Nunito_700Bold,
		Nunito_800ExtraBold,
		Nunito_900Black
	});

	const requestUserPermission = async () => {
		const authStatus = await messaging().requestPermission();
		const enabled =
			authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
			authStatus === messaging.AuthorizationStatus.PROVISIONAL;

		if (enabled) {
			console.log('FCM authorization status:', authStatus);
		}
	};

	useEffect(() => {
		requestUserPermission();
	}, []);

	if (!fontsLoaded) {
		return null;
	}

	return (
		<SafeAreaProvider>
			<QueryClientProvider client={queryClient}>
				<ProfileProvider>
					<NavigationProvider />
				</ProfileProvider>
			</QueryClientProvider>
		</SafeAreaProvider>
	);
};

export default App;
