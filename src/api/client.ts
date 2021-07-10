import axios from 'axios';
import { useCurrentUser } from '@app/hooks/firebase';

const client = axios.create({
	baseURL: 'http://localhost:3002'
});

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
