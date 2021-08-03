import React, { FC, memo, NamedExoticComponent, ReactElement } from 'react';
import { StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Divider, Overlay, Theme, useTheme } from 'react-native-elements';
import { BlurView } from '@react-native-community/blur';

interface Props {
	visible?: boolean;
	onBackdropPress?: () => void;
	children: ReactElement<any, NamedExoticComponent>[];
	style?: StyleProp<ViewStyle>;
}

const Container: FC<Props> = ({
	children,
	visible = false,
	onBackdropPress,
	style
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
		//FIXME: displayname not working

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
			transparent
			overlayStyle={[styles.overlay, style]}>
			<BlurView
				blurType='xlight'
				blurAmount={50}
				style={[StyleSheet.absoluteFill, { borderRadius: 16 }]}
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

export default memo(
	Container,
	(prevProps, nextProps) =>
		prevProps.visible === nextProps.visible &&
		prevProps.children === nextProps.children
);
