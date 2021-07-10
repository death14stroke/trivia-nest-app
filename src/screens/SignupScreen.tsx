import { FC } from 'react';
import { Text } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';

const SignupScreen: FC = () => {
	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
			<Text>Signup</Text>
		</SafeAreaView>
	);
};

export { SignupScreen };
