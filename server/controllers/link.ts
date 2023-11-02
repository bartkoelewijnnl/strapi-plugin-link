import { Strapi } from '@strapi/strapi';

export default ({ strapi }: { strapi: Strapi }) => ({
	async getContentTypes(ctx) {
		try {
			ctx.body = await strapi.plugin('link').service('link').getContentTypes();
		} catch (error) {}
	},
    async getSlugs(ctx) {
        const { body } = ctx.request;
        
        try {
            ctx.body = await strapi.plugin('link').service('link').getSlugs(body);
          
        } catch (error) {}
    }
});
