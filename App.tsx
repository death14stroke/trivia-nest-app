import React, { FC } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from 'react-query';
import AppLoading from 'expo-app-loading';
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

// Android: Setting a timer for multiple minutes warning for firebase
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Setting a timer']);

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
		return <AppLoading />;
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
