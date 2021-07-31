import React, { FC } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Theme, useTheme } from 'react-native-elements';
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withSpring
} from 'react-native-reanimated';
import { MaterialTopTabBarProps } from '@react-navigation/material-top-tabs';
import { TopTabItem } from './TopTabItem';

const SCREEN_WIDTH = Dimensions.get('window').width;

const TopTabBar: FC<MaterialTopTabBarProps> = ({
	state,
	descriptors,
	navigation
}) => {
	const styles = useStyles(useTheme().theme);
	const tabWidth = SCREEN_WIDTH / state.routes.length;
	const translateValue = useSharedValue(0);

	const animatedSliderStyle = useAnimatedStyle(() => ({
		transform: [{ translateX: translateValue.value }]
	}));

	return (
		<View>
			<View style={{ flexDirection: 'row' }}>
				{state.routes.map((route, index) => {
					const { options } = descriptors[route.key];
					const label =
						options.title !== undefined
							? options.title
							: route.name;
					const badgeCount =
						typeof options.tabBarLabel === 'string'
							? Number(options.tabBarLabel)
							: 0;

					const isFocused = state.index === index;
					if (isFocused) {
						translateValue.value = withSpring(index * tabWidth);
					}

					const onPress = () => {
						const event = navigation.emit({
							type: 'tabPress',
							target: route.key,
							canPreventDefault: true
						});
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

					return (
						<TouchableOpacity
							key={label.toString()}
							accessibilityRole='button'
							accessibilityState={
								isFocused ? { selected: true } : {}
							}
							accessibilityLabel={
								options.tabBarAccessibilityLabel
							}
							testID={options.tabBarTestID}
							onPress={onPress}
							onLongPress={onLongPress}
							style={{ flex: 1, alignItems: 'center' }}>
							<TopTabItem
								label={label.toString()}
								isFocused={isFocused}
								badge={badgeCount}
							/>
						</TouchableOpacity>
					);
				})}
			</View>
			<Animated.View
				style={[
					styles.slider,
					{ width: tabWidth },
					animatedSliderStyle
				]}
			/>
		</View>
	);
};

const useStyles = ({ colors }: Theme) =>
	StyleSheet.create({
		slider: { marginTop: 8, height: 2, backgroundColor: colors?.primary }
	});

export { TopTabBar };
