import { BASE_URL } from '@app/api/client';
import { apiGetAvatars } from '@app/api/users';
import { Input, Button } from '@app/components';
import { useFormik } from 'formik';
import React, { FC, useCallback } from 'react';
import { useState } from 'react';
import { Alert, FlatList, ListRenderItem, StyleSheet } from 'react-native';
import { View } from 'react-native';
import { Text, Image, Avatar, Overlay, Divider } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from 'react-query';

const SignupScreen: FC = () => {
	const [open, setOpen] = useState(false);
	//const {} = useFormik();

	const { data: avatars } = useQuery<string[]>('avatars', apiGetAvatars, {
		staleTime: 120 * 60 * 1000
	});

	const toggleModal = () => setOpen(!open);

	const renderAvatar: ListRenderItem<string> = ({ item }) => {
		console.log(item);
		return (
			<Image
				source={{ uri: BASE_URL + item }}
				key={item}
				style={{
					height: 100,
					width: 100,
					margin: 4,
					borderWidth: 4,
					borderColor: 'red',
					borderRadius: 8
				}}
			/>
		);
	};

	return (
		<SafeAreaView style={styles.root}>
			<Image
				source={require('@assets/welcome.jpg')}
				style={{ height: 200, aspectRatio: 1 }}
			/>
			<Text h3 h3Style={styles.header}>
				Join the battlefield!
			</Text>
			<View style={styles.form}>
				<Avatar
					source={{ uri: BASE_URL + avatars?.[0] }}
					rounded
					size='large'
					containerStyle={styles.avatar}
					activeOpacity={0.8}
					onPress={toggleModal}
				/>
				<Input.Username />
				<Input.Email />
				<Input.Password />
				<Button.Solid title='Continue' raised />
			</View>
			<View style={{ flexDirection: 'row', alignItems: 'center' }}>
				<Text style={{ fontSize: 16 }}>Already a member?</Text>
				<Button.Text title='Login' titleStyle={{ fontSize: 16 }} />
			</View>
			<Overlay
				isVisible={open}
				onBackdropPress={toggleModal}
				overlayStyle={{ padding: 0, borderRadius: 8 }}>
				<Text
					h4
					h4Style={{
						color: 'black',
						padding: 8,
						textAlign: 'center',
						fontWeight: 'bold'
					}}>
					Select avatar
				</Text>
				<Divider orientation='horizontal' style={{ marginBottom: 8 }} />
				<FlatList
					data={avatars}
					keyExtractor={uri => uri}
					renderItem={renderAvatar}
					numColumns={3}
					style={{ flexGrow: 0 }}
				/>
				<Divider orientation='horizontal' style={{ marginTop: 8 }} />
				<View
					style={{
						flexDirection: 'row',
						borderRadius: 8
					}}>
					<Button.Text
						title='Cancel'
						titleStyle={{ fontWeight: 'bold' }}
					/>
					<Divider orientation='vertical' />
					<Button.Text
						title='OK'
						titleStyle={{ fontWeight: 'bold' }}
						onPress={() => Alert.prompt('Hi')}
					/>
				</View>
			</Overlay>
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
