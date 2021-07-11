export type Mode = '1v1' | 'multi' | 'test';

export interface IntroMode {
	key: Mode;
	title: string;
	description: string;
	cost: number;
	image: any;
}
