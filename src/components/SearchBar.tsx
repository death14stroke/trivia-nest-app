import React, { FC } from 'react';
import { StyleSheet } from 'react-native';
import { Input, InputProps, Theme, useTheme } from 'react-native-elements';

type Props = InputProps;

const SearchBar: FC<Props> = ({ inputContainerStyle, ...props }) => {
	const { theme } = useTheme();
	const styles = useStyles(theme);
	const { colors } = theme;

	return (
		<Input
			{...props}
			inputContainerStyle={styles.inputContainer}
			leftIcon={{
				type: 'ionicon',
				name: 'search-outline',
				color: colors?.grey3
			}}
			leftIconContainerStyle={{ marginEnd: 8 }}
			inputStyle={{ color: 'black' }}
			placeholderTextColor={colors?.grey2}
		/>
	);
};

const useStyles = ({ colors }: Theme) =>
	StyleSheet.create({
		inputContainer: {
			backgroundColor: colors?.grey0,
			borderRadius: 12,
			borderBottomWidth: 0,
			paddingHorizontal: 12
		}
	});

export { SearchBar };
