import { Schema } from '@strapi/strapi';
import pluginId from '../pluginId';
import { LoadingModel } from '../types';
import { SlugOptions, Slug } from '../../../server/types';
import { useGet } from './useGet';
import { useSlugs } from './useSlugs';

const useApi = () => {
	const fetchContentTypes = (): LoadingModel<Schema.ContentType[]> => {
		return useGet<Schema.ContentType[]>(`/${pluginId}/content-types`);
	};

	const fetchSlugs = (options: SlugOptions): LoadingModel<Slug[]> => {
		return useSlugs(options);
	};

	return {
		fetchContentTypes,
		fetchSlugs,
	};
};

export default useApi;
