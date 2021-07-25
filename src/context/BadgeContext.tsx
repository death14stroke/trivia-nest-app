import React, { FC, useReducer, createContext, Dispatch } from 'react';

interface Action {
	type: 'update_invites_badge' | 'update_friends_badge';
	payload: number;
}

type State = { invites: number; friends: number };

const badgeReducer = (state: State, action: Action): State => {
	switch (action.type) {
		case 'update_invites_badge':
			return { ...state, invites: action.payload };
		case 'update_friends_badge':
			return { ...state, friends: action.payload };
		default:
			return state;
	}
};

const updateInvitesBadge = (dispatch: Dispatch<Action>) => (count: number) => {
	dispatch({ type: 'update_invites_badge', payload: count });
};

const updateFriendsBadge = (dispatch: Dispatch<Action>) => (count: number) => {
	dispatch({ type: 'update_friends_badge', payload: count });
};

type ContextValue = {
	state: State;
	actions: {
		updateInvitesBadge: ReturnType<typeof updateInvitesBadge>;
		updateFriendsBadge: ReturnType<typeof updateFriendsBadge>;
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
					updateFriendsBadge: updateFriendsBadge(dispatch)
				}
			}}>
			{children}
		</Context.Provider>
	);
};

export { Context as BadgeContext, Provider as BadgeProvider };
