export interface Question {
	_id: string;
	category: string;
	question: string;
	correctAnswer: string;
	options: { id: string; opt: string }[];
}
