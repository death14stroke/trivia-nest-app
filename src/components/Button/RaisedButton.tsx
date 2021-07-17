import React, { FC } from 'react';
import { ViewStyle } from 'react-native';
import { useTheme } from 'react-native-elements';
import AwesomeButton from 'react-native-really-awesome-button';

interface Props {
	onPress?: () => void;
	disabled?: boolean;
	style?: ViewStyle;
	loading?: boolean;
}

const RaisedButton: FC<Props> = ({
	onPress,
	disabled = false,
	loading = false,
	children,
	style
}) => {
	const {
		theme: { colors }
	} = useTheme();

	return (
		<AwesomeButton
			stretch
			progress={loading}
			backgroundShadow='#800000'
			backgroundColor={colors?.primary}
			backgroundDarker='#960018'
			borderRadius={24}
			onPress={onPress}
			style={style}
			disabled={disabled}>
			{children}
		</AwesomeButton>
	);
};

export { RaisedButton };
