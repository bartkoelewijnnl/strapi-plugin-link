"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// TODO: Handle errors.
exports.default = ({ strapi }) => ({
    // TODO: Async?.
    async getContentTypes(ctx) {
        ctx.body = strapi.plugin('link').service('link').getContentTypes();
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
