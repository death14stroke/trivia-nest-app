import React, { FC, useReducer, createContext, Dispatch } from 'react';

interface Action {
	type:
		| 'update_invites_badge'
		| 'reset_invites_badge'
		| 'update_friends_badge'
		| 'reset_friends_badge';
}

type State = { invites: number; friends: number };

const badgeReducer = (state: State, action: Action): State => {
	switch (action.type) {
		case 'update_invites_badge':
			return { ...state, invites: state.invites + 1 };
		case 'reset_invites_badge':
			return { ...state, invites: 0 };
		case 'update_friends_badge':
			return { ...state, friends: state.friends + 1 };
		case 'reset_friends_badge':
			return { ...state, friends: 0 };
		default:
			return state;
	}
};

const updateInvitesBadge = (dispatch: Dispatch<Action>) => () => {
	dispatch({ type: 'update_invites_badge' });
};

const resetInvitesBadge = (dispatch: Dispatch<Action>) => () => {
	dispatch({ type: 'reset_invites_badge' });
};

const updateFriendsBadge = (dispatch: Dispatch<Action>) => () => {
	dispatch({ type: 'update_friends_badge' });
};

const resetFriendsBadge = (dispatch: Dispatch<Action>) => () => {
	dispatch({ type: 'reset_friends_badge' });
};

type ContextValue = {
	state: State;
	actions: {
		updateInvitesBadge: ReturnType<typeof updateInvitesBadge>;
		resetInvitesBadge: ReturnType<typeof resetInvitesBadge>;
		updateFriendsBadge: ReturnType<typeof updateFriendsBadge>;
		resetFriendsBadge: ReturnType<typeof resetFriendsBadge>;
	};
};

const INITIAL_VALUE: State = { invites: 0, friends: 0 };

const Context = createContext<ContextValue>(undefined!);

const Provider: FC = ({ children }) => {
	const [state, dispatch] = useReducer(badgeReducer, INITIAL_VALUE);

	return (
		<Context.Provider
			value={{
				state,
				actions: {
					updateInvitesBadge: updateInvitesBadge(dispatch),
					resetInvitesBadge: resetInvitesBadge(dispatch),
					updateFriendsBadge: updateFriendsBadge(dispatch),
					resetFriendsBadge: resetFriendsBadge(dispatch)
				}
			}}>
			{children}
		</Context.Provider>
	);
};

export { Context as BadgeContext, Provider as BadgeProvider };
