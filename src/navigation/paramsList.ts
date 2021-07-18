import { Result } from '@app/models';

export type AppStackParamList = {
	Signup: undefined;
	mainFlow: { uid: string };
};

export type RootStackParamList = {
	Main: undefined;
	OneVsOne: undefined;
	Results: Result[];
	Multiplayer: { roomId: string } | undefined;
	Quiz: undefined;
	MatchMaking: undefined;
};

export type BottomTabParamList = {
	Home: undefined;
	History: undefined;
	Friends: undefined;
};
