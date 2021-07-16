import React, {
	FC,
	useEffect,
	useReducer,
	createContext,
	Dispatch
} from 'react';
import { QueryObserverResult, useQuery, useQueryClient } from 'react-query';
import auth from '@react-native-firebase/auth';
import _ from 'lodash';
import { apiCurrentUser } from '@app/api/users';
import { CurrentUser, Relation, UserStatus } from '@app/models';

interface Action {
	type:
		| 'fetch_profile'
		| 'fetch_friends'
		| 'update_profile'
		| 'add_request'
		| 'accept_invite'
		| 'unfriend'
		| 'undo_add_request'
		| 'undo_accept_invite'
		| 'undo_unfriend'
		| 'update_status';
	payload?: any;
}

type UpdateProfileParams = {
	username?: string;
	avatar?: string;
};

export type ProfileState = Partial<CurrentUser> & {
	friends: Map<string, UserStatus | undefined>;
	invites: Set<string>;
	requests: Set<string>;
};

// TODO: update user status for those friends who came online before current user
const profileReducer = (state: ProfileState, action: Action): ProfileState => {
	switch (action.type) {
		case 'fetch_profile':
			return { ...state, ...action.payload };
		case 'fetch_friends':
			const { invite, request, accepted } = _.groupBy(
				action.payload,
				rel => rel.status
			);
			const map = new Map<string, UserStatus | undefined>();
			accepted.forEach(id => map.set(id, state?.friends.get(id)));

			return {
				...state,
				friends: map,
				invites: new Set(invite?.map(rel => rel.uid2)),
				requests: new Set(request?.map(rel => rel.uid2))
			};
		case 'update_profile':
			return {
				...state,
				...action.payload
			};
		case 'add_request':
			state?.requests.add(action.payload);
			return { ...state };
		case 'undo_add_request':
			state?.requests.delete(action.payload);
			return { ...state };
		case 'accept_invite':
			state?.invites.delete(action.payload);
			state?.friends.set(action.payload, UserStatus.OFFLINE);
			return { ...state };
		case 'undo_accept_invite':
			state?.invites.add(action.payload);
			state?.friends.delete(action.payload);
			return { ...state };
		case 'unfriend':
			state?.friends.delete(action.payload);
			return { ...state };
		case 'undo_unfriend':
			state?.friends.set(action.payload, UserStatus.OFFLINE);
			return { ...state };
		case 'update_status':
			const { friendId, status } = action.payload;
			state?.friends.set(friendId, status);
			return { ...state };
		default:
			return state;
	}
};

const updateFriends =
	(dispatch: Dispatch<Action>) => (relations: Relation[]) => {
		dispatch({ type: 'fetch_friends', payload: relations });
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

const updateUserStatus =
	(dispatch: Dispatch<Action>) => (friendId: string, status: UserStatus) => {
		dispatch({ type: 'update_status', payload: { friendId, status } });
	};

type ContextValue = {
	state: ProfileState;
	actions: {
		refreshProfile: () => Promise<
			QueryObserverResult<CurrentUser, unknown>
		>;
		updateFriends: ReturnType<typeof updateFriends>;
		updateProfile: ReturnType<typeof updateProfile>;
		addFriendRequest: ReturnType<typeof addFriendRequest>;
		undoAddFriendRequest: ReturnType<typeof undoAddFriendRequest>;
		acceptInvite: ReturnType<typeof acceptInvite>;
		undoAcceptInvite: ReturnType<typeof undoAcceptInvite>;
		unfriend: ReturnType<typeof unfriend>;
		undoUnfriend: ReturnType<typeof undoUnfriend>;
		updateUserStatus: ReturnType<typeof updateUserStatus>;
	};
};

const INITIAL_VALUE: ProfileState = {
	friends: new Map(),
	invites: new Set(),
	requests: new Set()
};

const Context = createContext<ContextValue>(undefined!);

const Provider: FC = ({ children }) => {
	const [state, dispatch] = useReducer(profileReducer, INITIAL_VALUE);
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

		return () => {
			unsubscribe();
		};
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
					updateFriends: updateFriends(dispatch),
					updateProfile: updateProfile(dispatch),
					addFriendRequest: addFriendRequest(dispatch),
					undoAddFriendRequest: undoAddFriendRequest(dispatch),
					acceptInvite: acceptInvite(dispatch),
					undoAcceptInvite: undoAcceptInvite(dispatch),
					unfriend: unfriend(dispatch),
					undoUnfriend: undoUnfriend(dispatch),
					updateUserStatus: updateUserStatus(dispatch)
				}
			}}>
			{children}
		</Context.Provider>
	);
};

export { Context as ProfileContext, Provider as ProfileProvider };
