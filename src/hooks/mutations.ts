import { useContext } from 'react';
import {
	InfiniteData,
	QueryClient,
	useMutation,
	useQueryClient
} from 'react-query';
import { ProfileContext, SocketContext } from '@app/context';
import { Invite, Query, SocketEvent } from '@app/models';

type Response = {
	status: 'success' | 'error';
	message?: string;
};

type MutateCallbacks = {
	onMutate?: (msg: string) => void;
	onError?: (msg: string) => void;
};

// Accept and reject friend request
export const useFriendInviteMutations = ({
	onMutate,
	onError
}: MutateCallbacks) => {
	const queryClient = useQueryClient();
	const socket = useContext(SocketContext);
	const {
		actions: {
			acceptInvite,
			undoAcceptInvite,
			rejectInvite,
			undoRejectInvite
		}
	} = useContext(ProfileContext);

	const { mutate: acceptFriendRequest } = useMutation<
		unknown,
		string,
		string,
		InfiniteData<Invite[]> | undefined
	>(
		friendId =>
			new Promise<void>((resolve, reject) => {
				socket?.emit(
					SocketEvent.FRIEND_REQUEST_ACCEPT,
					friendId,
					(resp: Response) => {
						if (resp.status === 'error') {
							reject(resp.message);
						} else {
							resolve();
						}
					}
				);
			}),
		{
			onMutate: friendId => {
				onMutate?.('Friend request accepted');
				acceptInvite(friendId);
				const prevData = queryClient.getQueryData<
					InfiniteData<Invite[]>
				>(Query.INVITES);
				updateInvitesQueryData(friendId, queryClient);

				return prevData;
			},
			onError: (err, friendId, context) => {
				undoAcceptInvite(friendId);
				queryClient.setQueryData(Query.INVITES, context);
				onError?.(err);
			},
			onSuccess: () => {
				queryClient.invalidateQueries(Query.FRIENDS);
			}
		}
	);

	const { mutate: rejectFriendRequest } = useMutation<
		unknown,
		string,
		string,
		InfiniteData<Invite[]> | undefined
	>(
		friendId =>
			new Promise<void>((resolve, reject) => {
				socket?.emit(
					SocketEvent.FRIEND_REQUEST_REJECT,
					friendId,
					(resp: Response) => {
						if (resp.status === 'error') {
							reject(resp.message);
						} else {
							resolve();
						}
					}
				);
			}),
		{
			onMutate: friendId => {
				onMutate?.('Friend request removed');
				rejectInvite(friendId);
				const prevData = queryClient.getQueryData<
					InfiniteData<Invite[]>
				>(Query.INVITES);
				updateInvitesQueryData(friendId, queryClient);

				return prevData;
			},
			onError: (err, friendId, context) => {
				undoRejectInvite(friendId);
				queryClient.setQueryData(Query.INVITES, context);
				onError?.(err);
			}
		}
	);

	return [acceptFriendRequest, rejectFriendRequest];
};

const updateInvitesQueryData = (friendId: string, queryClient: QueryClient) => {
	queryClient.setQueryData<InfiniteData<Invite[]> | undefined>(
		Query.INVITES,
		old => {
			const oldData = old && { ...old };
			if (oldData) {
				oldData.pages = [...oldData.pages];
			}

			oldData?.pages.every((page, index) => {
				const pos = page.findIndex(({ info }) => info._id === friendId);
				if (pos === 0) {
					oldData.pages[index] = [...page.slice(1)];
					return false;
				} else if (pos > 0) {
					oldData.pages[index] = [
						...page.slice(0, pos),
						...page.slice(pos + 1)
					];
					return false;
				}

				return true;
			});

			return oldData;
		}
	);
};

export const useSendFriendRequestMutation = ({
	onMutate,
	onError
}: MutateCallbacks) => {
	const {
		actions: { addFriendRequest, undoAddFriendRequest }
	} = useContext(ProfileContext);
	const socket = useContext(SocketContext);

	const { mutate: sendFriendRequest } = useMutation<unknown, string, string>(
		friendId =>
			new Promise<void>((resolve, reject) => {
				socket?.emit(
					SocketEvent.FRIEND_REQUEST,
					friendId,
					(resp: Response) => {
						if (resp.status === 'error') {
							reject(resp.message);
						} else {
							resolve();
						}
					}
				);
			}),
		{
			onMutate: friendId => {
				onMutate?.('Friend request sent!');
				addFriendRequest(friendId);
			},
			onError: (err, friendId) => {
				console.error(err);
				onError?.(err);
				undoAddFriendRequest(friendId);
			}
		}
	);

	return sendFriendRequest;
};

export const useUnfriendMutation = ({ onMutate, onError }: MutateCallbacks) => {
	const {
		actions: { unfriend, undoUnfriend }
	} = useContext(ProfileContext);
	const socket = useContext(SocketContext);

	const { mutate: unfriendUser } = useMutation<unknown, string, string>(
		friendId =>
			new Promise<void>((resolve, reject) => {
				socket?.emit(
					SocketEvent.UNFRIEND,
					friendId,
					(resp: Response) => {
						if (resp.status === 'error') {
							reject(resp.message);
						} else {
							resolve();
						}
					}
				);
			}),
		{
			onMutate: friendId => {
				unfriend(friendId);
				onMutate?.('Removed friend');
			},
			onError: (err, friendId) => {
				undoUnfriend(friendId);
				onError?.(err);
			}
		}
	);

	return unfriendUser;
};
