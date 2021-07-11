import React, { FC } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Text, View } from 'react-native';

const WaitingTimer: FC = () => {
	const [time, setTime] = useState(0);

	useEffect(() => {
		const timer = setInterval(() => {
			setTime(prevTime => prevTime + 1);
		}, 1000);

		return () => {
			clearInterval(timer);
		};
	}, []);

	return (
		<View style={{ flex: 1, justifyContent: 'center' }}>
			<Text style={{ color: 'white' }}>{time}</Text>
		</View>
	);
};

export { WaitingTimer };
