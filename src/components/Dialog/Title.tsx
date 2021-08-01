import React, { FC, memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon, Text } from 'react-native-elements';
import { FontFamily } from '@app/theme';

interface Props {
	children: string;
	showCloseIcon?: boolean;
	onClose?: () => void;
}

const Title: FC<Props> = ({ children, showCloseIcon, onClose }) => {
	return (
		<View style={styles.root}>
			<Text style={styles.text}>{children}</Text>
			{showCloseIcon && (
				<Icon
					type='ionicon'
					name='close-outline'
					color='white'
					containerStyle={styles.closeIcon}
					onPress={onClose}
				/>
			)}
		</View>
	);
};

Title.displayName = 'DialogTitle';

const styles = StyleSheet.create({
	root: { flexDirection: 'row', alignItems: 'center' },
	text: {
		color: 'black',
		textAlign: 'center',
		fontSize: 20,
		padding: 8,
		fontFamily: FontFamily.Bold,
		flex: 1
	},
	closeIcon: {
		backgroundColor: 'red',
		borderRadius: 8,
		marginEnd: 12,
		borderWidth: 1,
		borderColor: 'white',
		position: 'absolute',
		end: 0
	}
});

export default memo(
	Title,
	(prevProps, nextProps) => prevProps.children === nextProps.children
);
