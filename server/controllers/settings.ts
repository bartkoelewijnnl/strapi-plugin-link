'use strict';

import { Strapi } from '@strapi/strapi';

export default ({ strapi }: { strapi: Strapi }) => ({
	async getSettings(ctx) {
		ctx.body = await strapi.plugin('link').service('settings').getSettings();
	},
	async setSettings(ctx) {
		const { body } = ctx.request;

		await strapi.plugin('link').service('settings').setSettings(body);
		ctx.body = await strapi.plugin('link').service('settings').getSettings();
	},
	async setSetting(ctx) {
		const { uid } = ctx.params;
		const { body } = ctx.request;

		ctx.body = await strapi.plugin('link').service('settings').setSetting(uid, body);
	},
});
