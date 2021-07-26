export const SocketEvent = {
	// 1v1 events
	JOIN_WAITING_ROOM: 'join_waiting_room',
	LEAVE_WAITING_ROOM: 'leave_waiting_room',
	// multiplayer events
	CREATE_MULTIPLAYER_ROOM: 'create_multiplayer_room',
	LEAVE_MULTIPLAYER_ROOM: 'leave_multiplayer_room',
	LEAVE_MULTIPLAYER_ROOM_ALERT: 'leave_multiplayer_room_alert',
	INVITE_MULTIPLAYER_ROOM: 'invite_multiplayer_room',
	JOIN_MULTIPLAYER_ROOM: 'join_multiplayer_room',
	JOIN_MULTIPLAYER_ROOM_ALERT: 'join_multiplayer_room_alert',
	ROOM_INFO: 'room_info',
	ROOM_OWNER_UPDATE: 'room_owner_update',
	// battle events
	STARTING: 'starting',
	READY: 'ready',
	START: 'start',
	QUESTION: 'question',
	ANSWER: 'answer',
	RESULTS: 'results',
	LEAVE_BATTLE: 'leave_battle',
	LEAVE_1V1_BATTLE: 'leave_1v1_battle',
	// others
	USER_UPDATE: 'user_update',
	RELATIONS: 'relations',
	FRIEND_REQUEST: 'friend_request',
	FRIEND_REQUEST_ACCEPT: 'friend_request_accept',
	FRIEND_REQUEST_REJECT: 'friend_request_reject',
	UNFRIEND: 'unfriend'
};
