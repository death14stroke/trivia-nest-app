import { NavigationProvider } from '@app/navigation';
import React, { FC } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ProfileProvider } from '@app/context';

// Android: Setting a timer for multiple minutes warning for firebase
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Setting a timer']);

const queryClient = new QueryClient();

const App: FC = () => {
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
