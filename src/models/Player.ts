export enum UserStatus {
	ONLINE = 2,
	OFFLINE = 0,
	BUSY = 1
}

export interface Player {
	_id: string;
	username: string;
	avatar: string;
	level: string;
	status?: number;
}
