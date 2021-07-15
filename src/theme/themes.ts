import { DarkTheme, Theme as NavigationTheme } from '@react-navigation/native';
import { Theme as NativeTheme } from 'react-native-elements';
import { Colors } from './colors';

export const AppNativeTheme: NativeTheme = {
	...DarkTheme,
	colors: {
		...DarkTheme.colors,
		primary: '#F23B5F',
		secondary: 'blue'
	}
};

export const AppNavigationTheme: NavigationTheme = {
	...DarkTheme,
	colors: {
		...DarkTheme.colors,
		primary: Colors.carnation
	}
};
