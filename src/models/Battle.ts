export interface Battle {
	_id: string;
	type: '1v1' | 'multi';
	startTime: string;
	results: {
		_id: string;
		coins: number;
		score: number;
	}[];
	playerInfo: {
		_id: string;
		username: string;
		avatar: string;
		level: string;
	}[];
}
