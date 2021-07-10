import { BASE_URL } from '@app/api/client';
import { apiGetAvatars } from '@app/api/users';
import React, { FC } from 'react';
import { StyleSheet } from 'react-native';
import { View } from 'react-native';
import { Text, Image, Input, Button, Avatar } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from 'react-query';

const SignupScreen: FC = () => {
	const { data: avatars } = useQuery<string[]>('avatars', apiGetAvatars, {
		staleTime: 120 * 60 * 1000
	});

	return (
		<SafeAreaView style={styles.root}>
			<Image
				source={require('@assets/welcome.jpg')}
				style={{ height: 200, aspectRatio: 1 }}
			/>
			<Text h3 h3Style={{ fontWeight: 'bold' }}>
				Join the battlefield!
			</Text>
			<View style={styles.form}>
				<Avatar
					source={{ uri: BASE_URL + avatars?.[0] }}
					rounded
					size='large'
					containerStyle={{
						marginTop: -50,
						alignSelf: 'center'
					}}
					activeOpacity={0.8}
					onPress={() => {}}
				/>
				<Input label='Username' placeholder='Your username' />
				<Input label='Email' placeholder='Your email' />
				<Input label='Password' placeholder='Your password' />
				<Button
					title='Continue'
					raised
					buttonStyle={{ borderRadius: 24 }}
					containerStyle={{ borderRadius: 24 }}
				/>
			</View>
			<View style={{ flexDirection: 'row', alignItems: 'center' }}>
				<Text style={{ fontSize: 16 }}>Already a member?</Text>
				<Button
					type='clear'
					titleStyle={{ color: 'red', fontSize: 16 }}
					title='Login'
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
		padding: 12
	}
});

export { SignupScreen };
