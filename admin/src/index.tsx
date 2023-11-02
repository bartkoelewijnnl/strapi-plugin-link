import { prefixPluginTranslations } from '@strapi/helper-plugin';

import pluginPkg from '../../package.json';
import pluginId from './pluginId';
import Initializer from './components/Initializer';
import PluginIcon from './components/PluginIcon';

const name = pluginPkg.strapi.name;

export default {
	register(app: any) {
		app.customFields.register({
			name,
			type: 'json',
			pluginId,
			icon: PluginIcon,
			intlLabel: {
				id: 'link.label',
				defaultMessage: 'Link',
			},
			intlDescription: {
				id: 'link.description',
				defaultMessage: 'The rich text editor for every use case',
			},
			components: {
				Input: async () => import('./components/LinkField'),
			},
		});
		app.addMenuLink({
			to: `/plugins/${pluginId}`,
			icon: PluginIcon,
			intlLabel: {
				id: `${pluginId}.plugin.name`,
				defaultMessage: name,
			},
			Component: async () => {
				const component = await import(/* webpackChunkName: "[request]" */ './pages/App');

				return component;
			},
			permissions: [
				// Uncomment to set the permissions of the plugin here
				// {
				//   action: '', // the action name should be plugin::plugin-name.actionType
				//   subject: null,
				// },
			],
		});
		app.registerPlugin({
			id: pluginId,
			initializer: Initializer,
			isReady: false, // ensures the Initializer component is mounted in the application
			name,
		});
	},

	bootstrap(app: any) {},

	async registerTrads(app: any) {
		const { locales } = app;

		const importedTrads = await Promise.all(
			(locales as any[]).map((locale) => {
				return import(`./translations/${locale}.json`)
					.then(({ default: data }) => {
						return {
							data: prefixPluginTranslations(data, pluginId),
							locale,
						};
					})
					.catch(() => {
						return {
							data: {},
							locale,
						};
					});
			}),
		);

		return Promise.resolve(importedTrads);
	},
};
