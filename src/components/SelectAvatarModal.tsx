import React, { FC, useState } from 'react';
import { StyleSheet } from 'react-native';
import {
	FlatList,
	View,
	Image,
	ListRenderItem,
	TouchableOpacity
} from 'react-native';
import { Divider, Overlay, Text, Theme, useTheme } from 'react-native-elements';
import { BASE_URL } from '@app/api/client';
import { Button } from './Button';

interface Props {
	open: boolean;
	data: string[];
	defaultAvatar?: string;
	onBackdropPress?: () => void;
	onSuccess?: (avatar: string) => void;
	onCancel?: () => void;
}

const SelectAvatarModal: FC<Props> = ({
	open,
	data,
	defaultAvatar = data[0],
	onBackdropPress,
	onSuccess,
	onCancel
}) => {
	const { theme } = useTheme();
	const styles = useStyles(theme);
	const [selected, setSelected] = useState<string>(defaultAvatar);

	const renderAvatar: ListRenderItem<string> = ({ item }) => (
		<TouchableOpacity onPress={() => setSelected(item)}>
			<Image
				source={{ uri: BASE_URL + item }}
				key={item}
				style={[
					styles.avatar,
					selected === item && styles.avatarSelected
				]}
			/>
		</TouchableOpacity>
	);
	return (
		<Overlay
			isVisible={open}
			onBackdropPress={onBackdropPress}
			overlayStyle={styles.overlay}>
			<Text style={styles.header}>Select avatar</Text>
			<Divider orientation='horizontal' style={{ marginBottom: 8 }} />
			<FlatList
				data={data}
				keyExtractor={uri => uri}
				renderItem={renderAvatar}
				numColumns={3}
				style={{ flexGrow: 0 }}
			/>
			<Divider orientation='horizontal' style={{ marginTop: 8 }} />
			<View style={styles.buttonContainer}>
				<Button.Text
					title='Cancel'
					titleStyle={{ fontWeight: 'bold' }}
					containerStyle={{ flex: 1 }}
					onPress={onCancel}
				/>
				<Divider orientation='vertical' />
				<Button.Text
					title='OK'
					titleStyle={{ fontWeight: 'bold' }}
					containerStyle={{ flex: 1 }}
					onPress={() => onSuccess?.(selected)}
				/>
			</View>
		</Overlay>
	);
};

const useStyles = ({ colors }: Theme) =>
	StyleSheet.create({
		avatar: {
			height: 100,
			width: 100,
			margin: 4,
			borderRadius: 8
		},
		avatarSelected: {
			borderWidth: 4,
			borderColor: colors?.primary
		},
		header: {
			fontSize: 20,
			color: 'black',
			padding: 8,
			textAlign: 'center',
			fontWeight: 'bold'
		},
		overlay: { padding: 0, borderRadius: 8 },
		buttonContainer: {
			flexDirection: 'row',
			borderRadius: 8
		}
	});

export { SelectAvatarModal };
