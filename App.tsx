import { NavigationProvider } from '@app/navigation';
import { FC } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const App: FC = () => {
	return (
		<SafeAreaProvider>
			<NavigationProvider />
		</SafeAreaProvider>
	);
};

export default App;
