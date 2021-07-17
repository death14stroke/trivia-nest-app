import { Result } from '@app/models';

export type AppStackParamList = {
	Signup: undefined;
	mainFlow: { uid: string };
};

export type RootStackParamList = {
	Home: undefined;
	OneVsOne: undefined;
	Results: Result[];
	Multiplayer: { roomId: string } | undefined;
};
