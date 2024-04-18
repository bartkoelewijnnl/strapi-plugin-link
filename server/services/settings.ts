import { Schema, Strapi } from '@strapi/strapi';
import type { Settings, Setting, SettingCollectionType } from '../types';

const getPluginStore = ({ strapi }: { strapi: Strapi }) => {
	return strapi.store?.({
		environment: strapi.config.environment,
		type: 'plugin',
		name: 'link',
	});
};

export default ({ strapi }: { strapi: Strapi }) => ({
	async upsertSettings(existingSettings?: Settings): Promise<Settings> {
		const pluginStore = getPluginStore({ strapi });

		if (!pluginStore) {
			return {};
		}

		const linkService = strapi.plugin('link').service('link');
		const contentTypes: Schema.ContentType[] = linkService.getContentTypes();
		const settings = contentTypes.reduce<Settings>((a, value) => {
			if (value.kind === 'singleType') {
				const setting: Setting = {
					slug: value.info.singularName.replace(/-page$/, ''),
					...(existingSettings ? existingSettings[value.uid] : {}),
					kind: 'singleType',
				};

				a[value.uid] = setting;
			} else if (value.kind === 'collectionType') {
				const attributes: string[] = linkService.getSlugAttributes(value.uid);

				const setting: Setting = {
					...(existingSettings ? existingSettings[value.uid] : {}),
					kind: 'collectionType',
					attributes: attributes,
				};

				a[value.uid] = setting;
			}

			return a;
		}, {});

		return this.setSettings(settings as Settings);
	},
	async getSettings(): Promise<Settings> {
		const pluginStore = getPluginStore({ strapi });

		if (!pluginStore) {
			return {};
		}
		const settings = (await pluginStore.get({ key: 'settings' })) as Settings;
		return this.upsertSettings(settings);
	},
	async setSettings(settings: Settings): Promise<Settings> {
		const pluginStore = getPluginStore({ strapi });

		if (!pluginStore) {
			return {};
		}

		return pluginStore.set({ key: 'settings', value: settings }).then(() => settings);
	},
	async setSetting(uid: string, setting: Setting): Promise<Settings> {
		const pluginStore = getPluginStore({ strapi });

		if (!pluginStore) {
			return {};
		}

		const settings = (await pluginStore.get({ key: 'settings' })) as Promise<Settings>;

		const newSettings: Settings = {
			...settings,
			[uid]: setting,
		};

		return this.setSettings(newSettings);
	},
});
