import { apiBattleHistory } from '@app/api/users';
import { BattleCard } from '@app/components';
import { ProfileContext } from '@app/context';
import { Battle } from '@app/models';
import _ from 'lodash';
import React, { FC, useContext } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import { useInfiniteQuery } from 'react-query';

const PAGE_SIZE = 10;

const HistoryScreen: FC = () => {
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
		const opponentInfo = playerInfo.find(
			info => info._id === opponentScore._id
		);

		return (
			<BattleCard
				userInfo={user!}
				opponentInfo={opponentInfo!}
				userScore={userScore!}
				opponentScore={opponentScore}
				type={type}
				containerStyle={{ marginHorizontal: 4, marginVertical: 8 }}
				time={new Date(startTime)}
			/>
		);
	};

	const battles = _.flatten(data?.pages);

	return (
		<FlatList
			data={battles}
			keyExtractor={battle => battle._id}
			renderItem={renderBattleCard}
			style={{ flex: 1 }}
			onEndReached={() => {
				if (!isLoading) {
					fetchNextPage();
				}
			}}
		/>
	);
};

export { HistoryScreen };
