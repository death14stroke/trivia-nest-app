import React, { FC, useEffect, useRef, createContext } from 'react';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { io, Socket } from 'socket.io-client';
import { BASE_URL } from '@app/api/client';
import { useCurrentUser } from '@app/hooks/firebase';

type ContextValue = Socket | undefined;

const Context = createContext<ContextValue>(undefined!);

const Provider: FC = ({ children }) => {
	const user = useCurrentUser()!;
	const socket = useRef<Socket>();

	useEffect(() => {
		init(user);

		return () => {
			socket.current?.disconnect();
		};
	}, [user.uid]);

	const init = async (user?: FirebaseAuthTypes.User) => {
		const token = await user?.getIdToken();
		if (token) {
			socket.current = io(BASE_URL, { auth: { token } });
		}
	};

	return (
		<Context.Provider value={socket.current}>{children}</Context.Provider>
	);
};

export { Context as SocketContext, Provider as SocketProvider };
