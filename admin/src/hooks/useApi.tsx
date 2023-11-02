import { Schema } from '@strapi/strapi';
import pluginId from '../pluginId';
import { LoadingModel } from '../types';
import { SlugOptions, Slug } from '../../../server/types';
import { useGet } from './useGet';
import { useSlugs } from './useSlugs';
import { usePost } from './usePost';

const useApi = () => {
	const fetchContentTypes = (): LoadingModel<Schema.ContentType[]> => {
		return useGet<Schema.ContentType[]>(`/${pluginId}/content-types`);
	};

	const fetchSlugs = (options: SlugOptions): LoadingModel<Slug[]> => {
		return useSlugs(options);
	};

	const fetchSlug = (slug: Omit<Slug, 'slug'>): LoadingModel<Slug> => {
		return usePost<Slug>(`/${pluginId}/slug`, slug);
	};

	return {
		fetchContentTypes,
		fetchSlugs,
		fetchSlug,
	};
};

export default useApi;
