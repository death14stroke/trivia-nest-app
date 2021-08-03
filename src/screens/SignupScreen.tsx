import React, { FC, useState } from 'react';
import {
	ActivityIndicator,
	KeyboardAvoidingView,
	LayoutAnimation,
	Platform,
	ScrollView,
	StyleSheet,
	UIManager,
	View
} from 'react-native';
import { Text, Avatar } from 'react-native-elements';
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
			<ScrollView
				alwaysBounceVertical={false}
				contentContainerStyle={{
					justifyContent: 'space-between',
					flexGrow: 1
				}}>
				<KeyboardAvoidingView
					style={{ flex: 1 }}
					contentContainerStyle={styles.contentContainer}
					behavior='position'>
					<Avatar
						source={require('@assets/welcome.jpg')}
						size='xlarge'
						renderPlaceholderContent={<ActivityIndicator />}
					/>
					<Text h3 h3Style={styles.header}>
						{signup
							? 'Join the battlefield!'
							: 'Welcome back soldier!'}
					</Text>
					<View style={styles.form}>
						{signup ? <SignupForm /> : <LoginForm />}
					</View>
				</KeyboardAvoidingView>
				<View style={styles.footer}>
					<Text style={{ fontSize: 16 }}>
						{signup ? 'Already a member?' : 'New to Trivia Nest?'}
					</Text>
					<Button.Text
						title={signup ? 'Login' : 'Register'}
						titleStyle={{ fontSize: 16 }}
						onPress={toggleMode}
					/>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	root: { flex: 1, backgroundColor: 'black' },
	contentContainer: { alignItems: 'center', flex: 1 },
	form: { flex: 1, width: '100%', justifyContent: 'center' },
	header: { fontFamily: FontFamily.Bold },
	footer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center'
	}
});

export { SignupScreen };
