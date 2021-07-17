import React, { FC, useState } from 'react';
import {
	FlatList,
	View,
	Image,
	ListRenderItem,
	TouchableOpacity,
	StyleSheet
} from 'react-native';
import { Divider, Overlay, Text, Theme, useTheme } from 'react-native-elements';
import { FontFamily } from '@app/theme';
import { BASE_URL } from '@app/api/client';
import { Button } from '../Button';

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
			<View style={styles.header}>
				<Text style={styles.headerText}>Select avatar</Text>
			</View>
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
				<Divider orientation='vertical' width={1} />
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
		avatarSelected: { borderWidth: 4, borderColor: colors?.primary },
		header: {
			overflow: 'hidden',
			backgroundColor: colors?.grey0,
			borderTopLeftRadius: 16,
			borderTopRightRadius: 16
		},
		headerText: {
			fontSize: 20,
			padding: 8,
			color: 'black',
			textAlign: 'center',
			fontFamily: FontFamily.SemiBold
		},
		overlay: {
			padding: 0,
			borderRadius: 16,
			elevation: 8,
			shadowColor: colors?.grey1,
			shadowOffset: { width: 0, height: 4 },
			shadowOpacity: 0.8,
			shadowRadius: 12
		},
		buttonContainer: {
			flexDirection: 'row',
			backgroundColor: colors?.grey0,
			borderBottomLeftRadius: 16,
			borderBottomRightRadius: 16
		}
	});

export { SelectAvatarModal };
