import { Common, Schema } from '@strapi/strapi';
import pluginId from '../pluginId';
import { LoadingModel } from '../types';
import { Slug, Settings, Setting } from '../../../server/types';
import { useGet } from './useGet';
import { useSlugs } from './useSlugs';
import { usePost } from './usePost';
import { useFetchClient } from '@strapi/helper-plugin';

const useApi = () => {
	const { post } = useFetchClient();

	const fetchContentTypes = (): LoadingModel<Schema.ContentType[]> => {
		return useGet<Schema.ContentType[]>(`/${pluginId}/content-types`);
	};

	const fetchSlugs = (options: SlugOptions): LoadingModel<Slug[]> & { fetch: () => Promise<void> } => {
		return useSlugs(options);
	};

	const fetchSlug = (slug: Omit<Slug, 'slug'>): LoadingModel<Slug> => {
		return usePost<Slug>(`/${pluginId}/slug`, slug);
	};

	const fetchSettings = (): LoadingModel<Settings> => {
		return useGet<Settings>(`/${pluginId}/settings`);
	};

	const saveSetting = async (uid: Common.UID.ContentType, settings: Setting): Promise<Settings> => {
		return (await post(`/${pluginId}/settings/${uid}`, settings)).data;
	};

	return {
		fetchSettings,
		fetchContentTypes,
		fetchSlugs,
		fetchSlug,
		saveSetting,
	};
};

export default useApi;
