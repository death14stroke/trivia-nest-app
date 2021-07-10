export interface CurrentUser {
	_id: string;
	email: string;
	username: string;
	avatar: string;
	status: string;
	lastSeen: Date;
	coins: number;
	level: string;
	totalScore: number;
}
