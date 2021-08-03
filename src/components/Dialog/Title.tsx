import React, { FC, FunctionComponent, memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon, Text } from 'react-native-elements';
import { FontFamily } from '@app/theme';

interface Props {
	children: string;
	showCloseIcon?: boolean;
	onClose?: () => void;
}

const Title: FunctionComponent<Props> = ({
	children,
	showCloseIcon,
	onClose
}) => {
	return (
		<View style={styles.root} key='title'>
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

const Component = memo(
	Title,
	(prevProps, nextProps) => prevProps.children === nextProps.children
);
Component.displayName = 'DialogTitle';

export default Component;
