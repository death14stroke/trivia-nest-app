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
		| 'reject_invite'
		| 'unfriend'
		| 'undo_add_request'
		| 'undo_accept_invite'
		| 'undo_reject_invite'
		| 'undo_unfriend'
		| 'update_status'
		| 'received_friend_request'
		| 'received_friend_request_accept';
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
			accepted?.forEach(id => map.set(id, state?.friends.get(id)));

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
			state.requests.add(action.payload);
			return { ...state };
		case 'undo_add_request':
			state.requests.delete(action.payload);
			return { ...state };
		case 'accept_invite':
			state.invites.delete(action.payload);
			state.friends.set(action.payload, UserStatus.OFFLINE);
			return { ...state };
		case 'undo_accept_invite':
			state.invites.add(action.payload);
			state.friends.delete(action.payload);
			return { ...state };
		case 'unfriend':
			state.friends.delete(action.payload);
			return { ...state };
		case 'undo_unfriend':
			state.friends.set(action.payload, UserStatus.OFFLINE);
			return { ...state };
		case 'reject_invite':
			state.invites.delete(action.payload);
			return { ...state };
		case 'undo_reject_invite':
			state.invites.add(action.payload);
			return { ...state };
		case 'update_status':
			const { friendId, status } = action.payload;
			state.friends.set(friendId, status);
			return { ...state };
		case 'received_friend_request':
			state.invites.add(action.payload);
			return { ...state };
		case 'received_friend_request_accept':
			state.requests.delete(action.payload);
			state.friends.set(action.payload, UserStatus.ONLINE);
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

const rejectInvite = (dispatch: Dispatch<Action>) => (friendId: string) => {
	dispatch({ type: 'reject_invite', payload: friendId });
};

const undoRejectInvite = (dispatch: Dispatch<Action>) => (friendId: string) => {
	dispatch({ type: 'undo_reject_invite', payload: friendId });
};

const updateUserStatus =
	(dispatch: Dispatch<Action>) => (friendId: string, status: UserStatus) => {
		dispatch({ type: 'update_status', payload: { friendId, status } });
	};

const receivedFriendRequest =
	(dispatch: Dispatch<Action>) => (friendId: string) => {
		dispatch({ type: 'received_friend_request', payload: friendId });
	};

const receivedFriendRequestAccept =
	(dispatch: Dispatch<Action>) => (friendId: string) => {
		dispatch({ type: 'received_friend_request_accept', payload: friendId });
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
		rejectInvite: ReturnType<typeof rejectInvite>;
		undoRejectInvite: ReturnType<typeof undoRejectInvite>;
		receivedFriendRequest: ReturnType<typeof receivedFriendRequest>;
		receivedFriendRequestAccept: ReturnType<
			typeof receivedFriendRequestAccept
		>;
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
		},
		enabled: false
	});

	useEffect(() => {
		const unsubscribe = auth().onAuthStateChanged(async user => {
			console.log('auth changed:', user?.email);
			if (!user) {
				dispatch({ type: 'fetch_profile', payload: null });
			} else {
				queryClient.invalidateQueries();
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
					updateUserStatus: updateUserStatus(dispatch),
					rejectInvite: rejectInvite(dispatch),
					undoRejectInvite: undoRejectInvite(dispatch),
					receivedFriendRequest: receivedFriendRequest(dispatch),
					receivedFriendRequestAccept:
						receivedFriendRequestAccept(dispatch)
				}
			}}>
			{children}
		</Context.Provider>
	);
};

export { Context as ProfileContext, Provider as ProfileProvider };
