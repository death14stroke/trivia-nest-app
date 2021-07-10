import React, { FC, useEffect, useReducer, createContext } from 'react';
import { QueryObserverResult, useQuery, useQueryClient } from 'react-query';
import _ from 'lodash';
import auth from '@react-native-firebase/auth';
import { apiCurrentUser } from '@app/api/users';
import { CurrentUser } from '@app/models';

interface Action {
	type: 'fetch_profile';
	payload?: any;
}

export type ProfileState = CurrentUser | undefined;

const INITIAL_STATE: ProfileState = undefined;

const profileReducer = (state: ProfileState, action: Action): ProfileState => {
	switch (action.type) {
		case 'fetch_profile':
			const user = action.payload;
			return user;
		default:
			return state;
	}
};

type ContextValue = {
	state: ProfileState;
	actions: {
		refreshProfile: () => Promise<
			QueryObserverResult<CurrentUser, unknown>
		>;
	};
};

const Context = createContext<ContextValue>(undefined!);

const Provider: FC = ({ children }) => {
	const [state, dispatch] = useReducer(profileReducer, INITIAL_STATE);
	const queryClient = useQueryClient();

	const { refetch } = useQuery<CurrentUser>('me', apiCurrentUser, {
		onSuccess: user => {
			dispatch({ type: 'fetch_profile', payload: user });
			queryClient.invalidateQueries({
				predicate: q => q.queryKey[0] !== 'me'
			});
		},
		enabled: false
	});

	useEffect(() => {
		const unsubscribe = auth().onAuthStateChanged(async user => {
			console.log('auth changed:', user?.email);
			if (!user) {
				dispatch({ type: 'fetch_profile', payload: null });
			} else {
				await refetch();
			}
		});

		return unsubscribe;
	}, []);

	const refreshProfile = () => {
		return refetch();
	};

	return (
		<Context.Provider value={{ state, actions: { refreshProfile } }}>
			{children}
		</Context.Provider>
	);
};

export { Context as ProfileContext, Provider as ProfileProvider };
