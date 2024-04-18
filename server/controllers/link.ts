import { Strapi } from '@strapi/strapi';

// TODO: Handle errors.
export default ({ strapi }: { strapi: Strapi }) => ({
	// TODO: Async?.
	async getContentTypes(ctx: any) {
		ctx.body = strapi.plugin('link').service('link').getContentTypes();
	},
	async getSlugs(ctx: any) {
		const { body } = ctx.request;
		ctx.body = await strapi.plugin('link').service('link').getSlugs(body);
	},
	async getSlug(ctx: any) {
		const { body } = ctx.request;
		ctx.body = await strapi.plugin('link').service('link').getSlug(body);
	},
});
