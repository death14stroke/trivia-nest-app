import React, { FC, useEffect, createContext } from 'react';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { useRef } from 'react';

type ContextValue = {
	playButtonSound: () => Promise<void>;
};

const Context = createContext<ContextValue>(undefined!);

const Provider: FC = ({ children }) => {
	const buttonSound = useRef<Audio.Sound>();

	useEffect(() => {
		init();

		return () => {
			buttonSound.current?.unloadAsync();
		};
	}, []);

	const init = async () => {
		try {
			buttonSound.current = (
				await Audio.Sound.createAsync(require('@assets/tap.mp3'))
			).sound;
			console.log('button sound loaded');
		} catch (err) {
			console.log('sound err:', err);
		}
	};

	const playButtonSound = async () => {
		await buttonSound.current?.playAsync();
		await buttonSound.current?.setPositionAsync(0);
	};

	return (
		<Context.Provider value={{ playButtonSound }}>
			{children}
		</Context.Provider>
	);
};

export { Context as SoundContext, Provider as SoundProvider };
