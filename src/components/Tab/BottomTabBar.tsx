import React, { FC } from 'react';
import {
	View,
	StyleSheet,
	TouchableOpacity,
	Dimensions,
	Platform
} from 'react-native';
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withSpring
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Colors } from '@app/theme';
import BottomMenuItem from './BottomMenuItem';

const SCREEN_WIDTH = Dimensions.get('window').width;

const BottomTabBar: FC<BottomTabBarProps> = ({
	state,
	descriptors,
	navigation
}) => {
	const focusedOptions = descriptors[state.routes[state.index].key].options;
	if (focusedOptions.tabBarVisible === false) {
		return null;
	}

	const tabWidth = SCREEN_WIDTH / state.routes.length;
	const translateValue = useSharedValue(tabWidth);
	const { bottom } = useSafeAreaInsets();

	const animatedSliderStyle = useAnimatedStyle(() => ({
		transform: [{ translateX: translateValue.value }]
	}));

	return (
		<View
			style={[
				styles.tabContainer,
				{ paddingBottom: Platform.OS === 'ios' ? bottom : 8 }
			]}>
			<Animated.View
				style={[
					styles.slider,
					{ width: tabWidth },
					animatedSliderStyle
				]}
			/>
			{state.routes.map((route, index) => {
				const { options } = descriptors[route.key];
				const label =
					options.tabBarLabel !== undefined
						? options.tabBarLabel
						: options.title !== undefined
						? options.title
						: route.name;

				const isFocused = state.index === index;

				const onPress = () => {
					const event = navigation.emit({
						type: 'tabPress',
						target: route.key,
						canPreventDefault: true
					});
					translateValue.value = withSpring(index * tabWidth);
					if (!isFocused && !event.defaultPrevented) {
						navigation.navigate(route.name);
					}
				};

				const onLongPress = () => {
					navigation.emit({
						type: 'tabLongPress',
						target: route.key
					});
				};

				const { tabBarIcon } = options;

				return (
					<TouchableOpacity
						key={label.toString()}
						accessibilityRole='button'
						accessibilityState={isFocused ? { selected: true } : {}}
						accessibilityLabel={options.tabBarAccessibilityLabel}
						testID={options.tabBarTestID}
						onPress={onPress}
						onLongPress={onLongPress}
						style={styles.tab}>
						<BottomMenuItem
							icon={tabBarIcon?.({
								color: 'white',
								focused: isFocused,
								size: 24
							})}
							title={label.toString()}
							isFocused={isFocused}
						/>
					</TouchableOpacity>
				);
			})}
		</View>
	);
};

const styles = StyleSheet.create({
	tabContainer: { flexDirection: 'row', backgroundColor: Colors.daisyBush },
	tab: { flex: 1, paddingTop: 4, justifyContent: 'center' },
	slider: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		backgroundColor: Colors.purpleHeart
	}
});

export { BottomTabBar };
