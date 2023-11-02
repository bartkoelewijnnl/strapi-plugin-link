import { Strapi } from '@strapi/strapi';

// TODO: Handle errors.
export default ({ strapi }: { strapi: Strapi }) => ({
	async getContentTypes(ctx) {
		ctx.body = await strapi.plugin('link').service('link').getContentTypes();
	},
	async getSlugs(ctx) {
		const { body } = ctx.request;
		ctx.body = await strapi.plugin('link').service('link').getSlugs(body);
	},
	async getSlug(ctx) {
		const { body } = ctx.request;
		ctx.body = await strapi.plugin('link').service('link').getSlug(body);
	},
});
