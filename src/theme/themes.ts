import { DarkTheme, Theme as NavigationTheme } from '@react-navigation/native';
import { Theme as NativeTheme } from 'react-native-elements';
import { Colors } from './colors';
import { FontFamily } from './fonts';

export const AppNativeTheme: NativeTheme = {
	...DarkTheme,
	colors: {
		...DarkTheme.colors,
		primary: Colors.carnation,
		secondary: Colors.purpleHeart
	},
	Input: {
		labelStyle: { fontFamily: FontFamily.ExtraBold },
		inputStyle: { fontFamily: FontFamily.Regular },
		errorStyle: { fontFamily: FontFamily.Regular }
	},
	Text: {
		style: { fontFamily: FontFamily.Regular },
		h4Style: { fontFamily: FontFamily.SemiBold }
	},
	Button: {
		titleStyle: { fontFamily: FontFamily.SemiBold }
	}
};

export const AppNavigationTheme: NavigationTheme = {
	...DarkTheme,
	colors: {
		...DarkTheme.colors,
		primary: Colors.carnation
	}
};
