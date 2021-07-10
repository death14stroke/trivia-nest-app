import { NavigationProvider } from '@app/navigation';
import React, { FC } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ProfileProvider } from 'src/context/ProfileContext';

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
