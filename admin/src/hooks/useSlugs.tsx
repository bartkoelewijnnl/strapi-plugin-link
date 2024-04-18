import { useCallback, useEffect } from 'react';
import { useFetchClient } from '@strapi/helper-plugin';
import { LoadingModel } from '../types';
import type { Slug, SlugOptions } from '../../../server/types';
import pluginId from '../pluginId';
import useLoadingModel from './useLoadingModel';

export const useSlugs = (options: SlugOptions): LoadingModel<Slug[]> & { fetch: () => Promise<void> } => {
	const { post } = useFetchClient();
	const { state, setError, setData, setLoading } = useLoadingModel<Slug[]>();

	const fetch = useCallback(async () => {
		setLoading();
		
		try {
			const data = (await post(`/${pluginId}/slugs`, options)).data;
			setData(data);
		} catch (error) {
			setError(error as Error);
		}
	}, [setData, options, setError]);

	// Life cycle.
	useEffect(() => {
		fetch();
	}, [options.uid]);

	return { ...state, fetch };
};
