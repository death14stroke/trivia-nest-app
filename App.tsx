import React, { FC } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashScreen from 'react-native-splash-screen';
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
import { NavigationProvider } from '@app/navigation';
import { ProfileProvider } from '@app/context';
import { Loading } from '@app/components';

// TODO: optimize images with tinypng
// Android: Setting a timer for multiple minutes warning for firebase
// expo-constants warning
import { LogBox } from 'react-native';
import { useEffect } from 'react';
LogBox.ignoreLogs(['Setting a timer', 'Constants.']);

const queryClient = new QueryClient();

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

	if (!fontsLoaded) {
		return null;
	}

	//TODO: call hide splashscreen in signup and home screen after data loaded
	console.log('hiding splash screen');
	SplashScreen.hide();

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
