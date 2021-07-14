type Relation = {
	_id: string;
	uid1: string;
	uid2: string;
	date: string;
	status: 'pending' | 'accepted';
};

export interface CurrentUser {
	_id: string;
	username: string;
	avatar: string;
	coins: number;
	level: string;
	totalScore: number;
	relations: Relation[];
}
