import React, { FC, NamedExoticComponent, ReactElement } from 'react';
import { StyleSheet } from 'react-native';
import { Divider, Overlay, Theme, useTheme } from 'react-native-elements';
import { BlurView } from '@react-native-community/blur';

interface Props {
	visible?: boolean;
	onBackdropPress?: () => void;
	children: ReactElement<any, NamedExoticComponent>[];
}

const Container: FC<Props> = ({
	children,
	visible = false,
	onBackdropPress
}) => {
	const { theme } = useTheme();
	const styles = useStyles(theme);
	const { colors } = theme;

	const titleChildren: ReactElement<any, NamedExoticComponent>[] = [];
	const buttonContainerChildren: ReactElement<any, NamedExoticComponent>[] =
		[];
	const otherChildren: ReactElement<any, NamedExoticComponent>[] = [];
	React.Children.forEach(children, child => {
		if (
			child.type.name === 'DialogTitle' ||
			child.type.displayName === 'DialogTitle'
		) {
			titleChildren.push(child);
		} else if (
			child.type.name === 'DialogButtonContainer' ||
			child.type.displayName === 'DialogButtonContainer'
		) {
			buttonContainerChildren.push(child);
		} else {
			otherChildren.push(child);
		}
	});

	return (
		<Overlay
			isVisible={visible}
			onBackdropPress={onBackdropPress}
			transparent
			overlayStyle={styles.overlay}>
			<BlurView
				blurType='xlight'
				blurAmount={50}
				style={[StyleSheet.absoluteFill, { borderRadius: 16 }]}
			/>
			{titleChildren}
			<Divider
				orientation='horizontal'
				color={colors?.grey2}
				style={{ marginBottom: 8 }}
			/>
			{otherChildren}
			<Divider
				orientation='horizontal'
				style={{ marginTop: 8 }}
				color={colors?.grey2}
			/>
			{buttonContainerChildren}
		</Overlay>
	);
};

const useStyles = ({ colors }: Theme) =>
	StyleSheet.create({
		overlay: {
			padding: 0,
			borderRadius: 16,
			elevation: 8,
			shadowColor: colors?.grey1,
			shadowOffset: { width: 0, height: 4 },
			shadowOpacity: 0.4,
			shadowRadius: 12,
			backgroundColor: 'transparent'
		}
	});

export { Container };
