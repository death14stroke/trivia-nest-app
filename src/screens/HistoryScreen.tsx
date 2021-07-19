import React, { FC, useContext } from 'react';
import {
	FlatList,
	ImageBackground,
	ListRenderItem,
	StyleSheet
} from 'react-native';
import { Text } from 'react-native-elements';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useInfiniteQuery } from 'react-query';
import _ from 'lodash';
import { FontFamily } from '@app/theme';
import { ProfileContext } from '@app/context';
import { Battle } from '@app/models';
import { apiBattleHistory } from '@app/api/users';
import { BattleCard } from '@app/components';

const PAGE_SIZE = 10;

const HistoryScreen: FC = () => {
	const styles = useStyles(useSafeAreaInsets());
	const { state: user } = useContext(ProfileContext);

	const { data, isLoading, fetchNextPage } = useInfiniteQuery<Battle[]>(
		'battles',
		async ({ pageParam }) => {
			const { data } = await apiBattleHistory(PAGE_SIZE, pageParam);
			return data;
		},
		{
			staleTime: 5 * 60 * 1000,
			getNextPageParam: lastPage =>
				lastPage.length === PAGE_SIZE
					? lastPage[lastPage.length - 1]
					: undefined
		}
	);

	const renderBattleCard: ListRenderItem<Battle> = ({
		item: { type, results, playerInfo, startTime }
	}) => {
		const isWinner = results[0]._id === user?._id;
		const userScore = results.find(res => res._id === user?._id);
		const opponentScore = !isWinner ? results[0] : results[1];
		const userInfo = playerInfo.find(info => info._id === user._id);
		const opponentInfo = playerInfo.find(
			info => info._id === opponentScore._id
		);

		return (
			<BattleCard
				userInfo={userInfo!}
				opponentInfo={opponentInfo!}
				userScore={userScore!}
				opponentScore={opponentScore}
				type={type}
				containerStyle={{ marginVertical: 8 }}
				time={new Date(startTime)}
			/>
		);
	};

	const battles = _.flatten(data?.pages);

	return (
		<ImageBackground
			source={require('@assets/background.jpg')}
			style={styles.root}>
			<Text h3 h3Style={styles.header}>
				Recent matches
			</Text>
			<FlatList
				data={battles}
				keyExtractor={battle => battle._id}
				renderItem={renderBattleCard}
				showsVerticalScrollIndicator={false}
				style={{ flex: 1 }}
				onEndReached={() => {
					if (!isLoading) {
						fetchNextPage();
					}
				}}
			/>
		</ImageBackground>
	);
};

const useStyles = ({ top }: EdgeInsets) =>
	StyleSheet.create({
		root: {
			flex: 1,
			paddingTop: top,
			paddingHorizontal: 8
		},
		header: {
			paddingVertical: 4,
			fontFamily: FontFamily.Bold
		}
	});

export { HistoryScreen };
