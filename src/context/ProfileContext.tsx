import React, {
	FC,
	useEffect,
	useReducer,
	createContext,
	Dispatch
} from 'react';
import { QueryObserverResult, useQuery, useQueryClient } from 'react-query';
import _ from 'lodash';
import auth from '@react-native-firebase/auth';
import { apiCurrentUser } from '@app/api/users';
import { CurrentUser } from '@app/models';
import { string } from 'yup/lib/locale';
import { act } from 'react-test-renderer';

interface Action {
	type: 'fetch_profile' | 'update_profile';
	payload?: any;
}

type UpdateProfileParams = {
	username?: string;
	avatar?: string;
};

export type ProfileState = CurrentUser | undefined;

const INITIAL_STATE: ProfileState = undefined;

const profileReducer = (state: ProfileState, action: Action): ProfileState => {
	switch (action.type) {
		case 'fetch_profile':
			return action.payload;
		case 'update_profile':
			return {
				...state,
				...action.payload
			};
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
		updateProfile: (params: UpdateProfileParams) => void;
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

	const updateProfile = (params: UpdateProfileParams) => {
		dispatch({ type: 'update_profile', payload: params });
	};

	return (
		<Context.Provider
			value={{
				state,
				actions: {
					refreshProfile,
					updateProfile
				}
			}}>
			{children}
		</Context.Provider>
	);
};

export { Context as ProfileContext, Provider as ProfileProvider };
