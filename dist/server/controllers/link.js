"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ strapi }) => ({
    async getContentTypes(ctx) {
        try {
            ctx.body = await strapi.plugin('link').service('link').getContentTypes();
        }
        catch (error) { }
    },
    async getSlugs(ctx) {
        const { body } = ctx.request;
        try {
            ctx.body = await strapi.plugin('link').service('link').getSlugs(body);
        }
        catch (error) { }
    }
});
