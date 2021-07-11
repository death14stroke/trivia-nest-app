import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Image } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, LoginForm, SignupForm } from '@app/components';
import { useState } from 'react';

const SignupScreen: FC = () => {
	const [signup, setSignup] = useState(true);

	const toggleMode = () => setSignup(!signup);

	return (
		<SafeAreaView style={styles.root}>
			<Image
				source={require('@assets/welcome.jpg')}
				style={{ height: 200, aspectRatio: 1 }}
			/>
			<Text h3 h3Style={styles.header}>
				{signup ? 'Join the battlefield!' : 'Welcome back soldier!'}
			</Text>
			{signup ? <SignupForm /> : <LoginForm />}
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center'
				}}>
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
	form: {
		backgroundColor: 'white',
		borderRadius: 24,
		alignSelf: 'stretch',
		marginTop: 38,
		paddingHorizontal: 12,
		paddingBottom: 12
	},
	avatar: {
		marginTop: -38,
		marginBottom: 8,
		alignSelf: 'center'
	},
	header: { fontWeight: 'bold' }
});

export { SignupScreen };
