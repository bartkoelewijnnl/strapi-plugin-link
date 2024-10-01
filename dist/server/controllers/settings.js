'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ strapi }) => ({
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
