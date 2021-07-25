import axios from 'axios';
import { useCurrentUser } from '@app/hooks/firebase';

//export const BASE_URL = 'https://trivia-nest-server.herokuapp.com';
export const BASE_URL = 'http://localhost:3002';

const client = axios.create({ baseURL: BASE_URL });

client.interceptors.request.use(
	async config => {
		const token = await useCurrentUser()?.getIdToken();
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}

		return config;
	},
	err => Promise.reject(err)
);

export default client;
