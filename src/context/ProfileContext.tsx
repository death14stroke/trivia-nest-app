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

interface Action {
	type:
		| 'fetch_profile'
		| 'update_profile'
		| 'add_request'
		| 'accept_invite'
		| 'unfriend'
		| 'undo_add_request'
		| 'undo_accept_invite'
		| 'undo_unfriend';
	payload?: any;
}

type UpdateProfileParams = {
	username?: string;
	avatar?: string;
};

export type ProfileState =
	| (Omit<CurrentUser, 'results'> & {
			friends: Set<string>;
			invites: Set<string>;
			requests: Set<string>;
	  })
	| undefined;

const INITIAL_STATE: ProfileState = undefined;

const profileReducer = (state: ProfileState, action: Action): ProfileState => {
	switch (action.type) {
		case 'fetch_profile':
			const user = action.payload;
			const { invite, request, accepted } = _.groupBy(
				user?.relations,
				rel => rel.status
			);

			console.log(user, invite, request, accepted);

			return (
				user && {
					...user,
					friends: new Set(accepted?.map(rel => rel.uid2)),
					invites: new Set(invite?.map(rel => rel.uid2)),
					requests: new Set(request?.map(rel => rel.uid2))
				}
			);
		case 'update_profile':
			return {
				...state,
				...action.payload
			};
		case 'add_request':
			state?.requests.add(action.payload);
			return state && { ...state };
		case 'undo_add_request':
			state?.requests.delete(action.payload);
			return state && { ...state };
		case 'accept_invite':
			state?.invites.delete(action.payload);
			state?.friends.add(action.payload);
			return state && { ...state };
		case 'undo_accept_invite':
			state?.invites.add(action.payload);
			state?.friends.delete(action.payload);
			return state && { ...state };
		case 'unfriend':
			state?.friends.delete(action.payload);
			return state && { ...state };
		case 'undo_unfriend':
			state?.friends.add(action.payload);
			return state && { ...state };
		default:
			return state;
	}
};

const updateProfile =
	(dispatch: Dispatch<Action>) => (params: UpdateProfileParams) => {
		dispatch({ type: 'update_profile', payload: params });
	};

const addFriendRequest = (dispatch: Dispatch<Action>) => (friendId: string) => {
	dispatch({ type: 'add_request', payload: friendId });
};

const undoAddFriendRequest =
	(dispatch: Dispatch<Action>) => (friendId: string) => {
		dispatch({ type: 'undo_add_request', payload: friendId });
	};

const acceptInvite = (dispatch: Dispatch<Action>) => (friendId: string) => {
	dispatch({ type: 'accept_invite', payload: friendId });
};

const undoAcceptInvite = (dispatch: Dispatch<Action>) => (friendId: string) => {
	dispatch({ type: 'undo_accept_invite', payload: friendId });
};

const unfriend = (dispatch: Dispatch<Action>) => (friendId: string) => {
	dispatch({ type: 'unfriend', payload: friendId });
};

const undoUnfriend = (dispatch: Dispatch<Action>) => (friendId: string) => {
	dispatch({ type: 'undo_unfriend', payload: friendId });
};

type ContextValue = {
	state: ProfileState;
	actions: {
		refreshProfile: () => Promise<
			QueryObserverResult<CurrentUser, unknown>
		>;
		updateProfile: ReturnType<typeof updateProfile>;
		addFriendRequest: ReturnType<typeof addFriendRequest>;
		undoAddFriendRequest: ReturnType<typeof undoAddFriendRequest>;
		acceptInvite: ReturnType<typeof acceptInvite>;
		undoAcceptInvite: ReturnType<typeof undoAcceptInvite>;
		unfriend: ReturnType<typeof unfriend>;
		undoUnfriend: ReturnType<typeof undoUnfriend>;
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
		<Context.Provider
			value={{
				state,
				actions: {
					refreshProfile,
					updateProfile: updateProfile(dispatch),
					addFriendRequest: addFriendRequest(dispatch),
					undoAddFriendRequest: undoAddFriendRequest(dispatch),
					acceptInvite: acceptInvite(dispatch),
					undoAcceptInvite: undoAcceptInvite(dispatch),
					unfriend: unfriend(dispatch),
					undoUnfriend: undoUnfriend(dispatch)
				}
			}}>
			{children}
		</Context.Provider>
	);
};

export { Context as ProfileContext, Provider as ProfileProvider };
