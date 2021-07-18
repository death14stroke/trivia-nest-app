import React, { FC, useRef } from 'react';
import {
	View,
	StyleSheet,
	TouchableOpacity,
	Animated,
	Dimensions
} from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import BottomMenuItem from './BottomMenuItem';
import { Colors } from '@app/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BottomTabBar: FC<BottomTabBarProps> = ({
	state,
	descriptors,
	navigation,
	activeTintColor = Colors.carnation,
	inactiveTintColor = Colors.purpleHeart
}) => {
	const focusedOptions = descriptors[state.routes[state.index].key].options;
	if (focusedOptions.tabBarVisible === false) {
		return null;
	}

	const totalWidth = Dimensions.get('window').width;
	const tabWidth = totalWidth / state.routes.length;
	const translateValue = useRef(new Animated.Value(0)).current;
	const { bottom } = useSafeAreaInsets();

	return (
		<View style={styles.tabContainer}>
			<Animated.View
				style={[
					styles.slider,
					{
						transform: [{ translateX: translateValue }],
						width: tabWidth
					}
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
					Animated.spring(translateValue, {
						toValue: index * tabWidth,
						velocity: 10,
						useNativeDriver: true
					}).start();

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
						style={{
							flex: 1,
							marginBottom: bottom,
							paddingTop: 4
						}}>
						<BottomMenuItem
							icon={tabBarIcon?.({
								focused: isFocused,
								color: isFocused
									? activeTintColor
									: inactiveTintColor,
								size: 24
							})}
							color={isFocused ? 'white' : inactiveTintColor}
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
	tabContainer: {
		flexDirection: 'row',
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: Colors.daisyBush
	},
	slider: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		backgroundColor: Colors.purpleHeart
	}
});

export { BottomTabBar };
