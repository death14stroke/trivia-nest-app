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

//TODO: mpeg not supported format
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
			backgroundShadow='#800000'
			backgroundColor={colors?.primary}
			backgroundDarker='#960018'
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
