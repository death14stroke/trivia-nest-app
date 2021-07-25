import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { Badge, Text, Theme, useTheme } from 'react-native-elements';
import { FontFamily } from '@app/theme';

interface Props {
	label: string;
	isFocused?: boolean;
	badge: number;
}

const TopTabItem: FC<Props> = ({ label, isFocused, badge }) => {
	const styles = useStyles(useTheme().theme);

	return (
		<View style={{ flexDirection: 'row', paddingTop: 4 }}>
			<Text
				style={[
					styles.label,
					isFocused ? styles.labelSelected : styles.labelNormal
				]}>
				{label}
			</Text>
			{badge > 0 && (
				<Badge
					value={badge <= 99 ? badge : '99+'}
					status='primary'
					containerStyle={styles.badgeContainer}
				/>
			)}
		</View>
	);
};

const useStyles = ({ colors }: Theme) =>
	StyleSheet.create({
		label: { fontSize: 18, textTransform: 'none' },
		labelNormal: { fontFamily: FontFamily.Regular, color: colors?.grey2 },
		labelSelected: { fontFamily: FontFamily.SemiBold, color: 'white' },
		badgeContainer: { marginStart: -4, marginTop: -4 }
	});

export { TopTabItem };
