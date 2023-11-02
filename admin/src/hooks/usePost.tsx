import { useCallback, useEffect } from 'react';
import { useFetchClient } from '@strapi/helper-plugin';
import { LoadingModel } from '../types';
import useLoadingModel from './useLoadingModel';

export const usePost = <T extends object>(url: string, body: object): LoadingModel<T> => {
	const { post } = useFetchClient();
	const { state, setError, setData } = useLoadingModel<T>();

	const fetch = useCallback(async () => {
		try {
			const data = (await post(url, body)).data;
			setData(data);
		} catch (error) {
			setError(error as Error);
		}
	}, [url, setData, setError]);

	// Life cycle.
	useEffect(() => {
		fetch();
	}, [url]);

	return state;
};
