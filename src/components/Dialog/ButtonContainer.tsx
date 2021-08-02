import React, { FC, memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Divider, useTheme } from 'react-native-elements';

interface Props {
	children: Element[];
}

const ButtonContainer: FC<Props> = ({ children }) => {
	const {
		theme: { colors }
	} = useTheme();

	const buttonsWithSeparators: any[] = [];
	React.Children.forEach(children, (child, index) => {
		if (!child) {
			return;
		}

		buttonsWithSeparators.push(
			child,
			<Divider
				orientation='vertical'
				color={colors?.grey2}
				key={`divider_${index}`}
			/>
		);
	});

	return (
		<View style={styles.buttonContainer}>
			{buttonsWithSeparators.slice(0, -1)}
		</View>
	);
};

ButtonContainer.displayName = 'DialogButtonContainer';

const styles = StyleSheet.create({
	buttonContainer: {
		flexDirection: 'row',
		borderBottomLeftRadius: 16,
		borderBottomRightRadius: 16
	}
});

export default memo(
	ButtonContainer,
	(prevProps, nextProps) => prevProps.children === nextProps.children
);
