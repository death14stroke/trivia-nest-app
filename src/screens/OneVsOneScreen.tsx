import { BASE_URL } from '@app/api/client';
import { WaitingTimer } from '@app/components';
import React, { FC, useEffect, useRef } from 'react';
import { useState } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-elements';
import { Socket, io } from 'socket.io-client';

const OneVsOneScreen: FC = () => {
	const [loading, setLoading] = useState(true);
	const socket = useRef<Socket>();

	useEffect(() => {
		socket.current = io(BASE_URL);
		socket.current.on('hello', msg => {
			console.log('socket io msg:', msg);
			//showToast(msg);
		});

		return () => {
			socket.current?.disconnect();
		};
	}, []);

	if (loading) {
		return <WaitingTimer />;
	}

	return (
		<View>
			<Text style={{ color: 'white' }}>OneVsOne</Text>
		</View>
	);
};

export { OneVsOneScreen };
