import React, { FC, useState } from 'react';
import {
	LayoutAnimation,
	Platform,
	StyleSheet,
	UIManager,
	View
} from 'react-native';
import { Text, Image } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontFamily } from '@app/theme';
import { Button, LoginForm, SignupForm } from '@app/components';

if (Platform.OS === 'android') {
	if (UIManager.setLayoutAnimationEnabledExperimental) {
		UIManager.setLayoutAnimationEnabledExperimental(true);
	}
}

const SignupScreen: FC = () => {
	const [signup, setSignup] = useState(true);

	const toggleMode = () => {
		LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
		setSignup(!signup);
	};

	return (
		<SafeAreaView style={styles.root}>
			<Image
				source={require('@assets/welcome.jpg')}
				style={styles.logo}
			/>
			<Text h3 h3Style={styles.header}>
				{signup ? 'Join the battlefield!' : 'Welcome back soldier!'}
			</Text>
			<View style={styles.form}>
				{signup ? <SignupForm /> : <LoginForm />}
			</View>
			<View style={{ flexDirection: 'row', alignItems: 'center' }}>
				<Text style={{ fontSize: 16 }}>
					{signup ? 'Already a member?' : 'New to Trivia Nest?'}
				</Text>
				<Button.Text
					title={signup ? 'Login' : 'Register'}
					titleStyle={{ fontSize: 16 }}
					onPress={toggleMode}
				/>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	root: {
		flex: 1,
		backgroundColor: 'black',
		alignItems: 'center',
		justifyContent: 'space-evenly'
	},
	logo: { height: 200, aspectRatio: 1 },
	form: { flex: 1, width: '100%', justifyContent: 'center' },
	header: { fontFamily: FontFamily.Bold }
});

export { SignupScreen };
