export interface Relation {
	_id: string;
	uid2: string;
	status: 'invite' | 'request' | 'accepted';
}
