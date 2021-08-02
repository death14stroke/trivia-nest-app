import React, { FC, useEffect, useRef, createContext } from 'react';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { io, Socket } from 'socket.io-client';
import { BASE_URL } from '@app/api/client';
import { useCurrentUser } from '@app/hooks/firebase';
import { SocketEvent, Relation } from '@app/models';
import { useContext } from 'react';
import { ProfileContext } from './ProfileContext';

type ContextValue = Socket | undefined;

const Context = createContext<ContextValue>(undefined!);

const Provider: FC = ({ children }) => {
	const user = useCurrentUser();
	const {
		actions: { updateFriends }
	} = useContext(ProfileContext);
	const socket = useRef<Socket>();

	useEffect(() => {
		if (user) {
			init(user);
		}

		socket.current?.once(SocketEvent.RELATIONS, (relations: Relation[]) => {
			updateFriends(relations);
		});

		return () => {
			socket.current?.disconnect();
		};
	}, [user?.uid]);

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
