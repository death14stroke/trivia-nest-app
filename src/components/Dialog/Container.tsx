import React, { FC, memo, NamedExoticComponent, ReactElement } from 'react';
import { StyleSheet, StyleProp, ViewStyle, View, Platform } from 'react-native';
import { Divider, Overlay, Theme, useTheme } from 'react-native-elements';
import { BlurView } from '@react-native-community/blur';

interface Props {
	visible?: boolean;
	onBackdropPress?: () => void;
	children: ReactElement<any, NamedExoticComponent>[];
	overlayStyle?: StyleProp<ViewStyle>;
	containerStyle?: StyleProp<ViewStyle>;
}

const Container: FC<Props> = ({
	children,
	visible = false,
	onBackdropPress,
	overlayStyle,
	containerStyle
}) => {
	const { theme } = useTheme();
	const styles = useStyles(theme);
	const { colors } = theme;

	const titleChildren: ReactElement<any, NamedExoticComponent>[] = [];
	const buttonContainerChildren: ReactElement<any, NamedExoticComponent>[] =
		[];
	const otherChildren: ReactElement<any, NamedExoticComponent>[] = [];
	React.Children.forEach(children, child => {
		const { name, displayName } = child.type;

		if (
			name === 'DialogTitle' ||
			displayName === 'DialogTitle' ||
			name === 'DialogDescription' ||
			displayName === 'DialogDescription'
		) {
			titleChildren.push(child);
		} else if (
			name === 'DialogButtonContainer' ||
			displayName === 'DialogButtonContainer'
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
			backdropStyle={
				Platform.OS === 'android' && { backgroundColor: 'transparent' }
			}
			overlayStyle={[styles.overlay, overlayStyle]}>
			<View style={[styles.root, containerStyle]}>
				<BlurView
					blurType='xlight'
					blurAmount={50}
					style={[StyleSheet.absoluteFillObject]}
				/>
				{titleChildren}
				{otherChildren}
				{buttonContainerChildren.length > 0 && (
					<Divider
						orientation='horizontal'
						style={{ marginTop: 8 }}
						color={colors?.grey2}
					/>
				)}
				{buttonContainerChildren}
			</View>
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
		},
		root: { overflow: 'hidden', borderRadius: 16 }
	});

export default memo(
	Container,
	(prevProps, nextProps) =>
		prevProps.visible === nextProps.visible &&
		prevProps.children === nextProps.children
);
