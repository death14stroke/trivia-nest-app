import { DarkTheme, Theme } from '@react-navigation/native';

export const AppTheme: Theme = {
	...DarkTheme,
	colors: {
		...DarkTheme.colors,
		primary: '#F23B5F'
	}
};
