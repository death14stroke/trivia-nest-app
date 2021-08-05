import React, { FC } from 'react';
import { useContext } from 'react';
import { ViewStyle } from 'react-native';
import { useTheme } from 'react-native-elements';
import AwesomeButton from 'react-native-really-awesome-button';
import { SoundContext } from '@app/context';

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
	const { playButtonSound } = useContext(SoundContext);

	return (
		<AwesomeButton
			stretch
			progress={loading}
			backgroundShadow={!disabled ? '#800000' : colors?.grey5}
			backgroundColor={!disabled ? colors?.primary : colors?.grey3}
			backgroundDarker={!disabled ? '#960018' : colors?.grey4}
			borderRadius={24}
			onPress={async () => {
				onPress?.();
				await playButtonSound();
			}}
			style={style}
			disabled={disabled}>
			{children}
		</AwesomeButton>
	);
};

export { RaisedButton };
