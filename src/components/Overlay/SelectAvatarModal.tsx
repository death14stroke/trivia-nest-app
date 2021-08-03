import React, { FC, useState } from 'react';
import {
	FlatList,
	ListRenderItem,
	TouchableOpacity,
	StyleSheet,
	ActivityIndicator
} from 'react-native';
import { Image, Theme, useTheme } from 'react-native-elements';
import { BASE_URL } from '@app/api/client';
import Dialog from '../Dialog';

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
	const styles = useStyles(useTheme().theme);
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
				PlaceholderContent={<ActivityIndicator />}
			/>
		</TouchableOpacity>
	);

	return (
		<Dialog.Container visible={open} onBackdropPress={onBackdropPress}>
			<Dialog.Title>Select avatar</Dialog.Title>
			<FlatList
				data={data}
				keyExtractor={uri => uri}
				renderItem={renderAvatar}
				numColumns={3}
				style={{ flexGrow: 0 }}
			/>
			<Dialog.ButtonContainer>
				<Dialog.Button title='Cancel' onPress={onCancel} />
				<Dialog.Button
					title='OK'
					onPress={() => onSuccess?.(selected)}
				/>
			</Dialog.ButtonContainer>
		</Dialog.Container>
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
		avatarSelected: { borderWidth: 4, borderColor: colors?.primary }
	});

export { SelectAvatarModal };
