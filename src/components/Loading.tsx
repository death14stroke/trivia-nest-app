import React, { FC, memo } from 'react';
import { ImageBackground } from 'react-native';
import { Text } from 'react-native-elements';

interface Props {
	message?: string;
}

const Loading: FC<Props> = ({ message }) => {
	return (
		<ImageBackground
			source={require('@assets/background.jpg')}
			style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
			<Text h2>{message}</Text>
		</ImageBackground>
	);
};

export default memo(Loading);
