"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getPluginStore = ({ strapi }) => {
    var _a;
    return (_a = strapi.store) === null || _a === void 0 ? void 0 : _a.call(strapi, {
        environment: strapi.config.environment,
        type: 'plugin',
        name: 'link',
    });
};
exports.default = ({ strapi }) => ({
    async upsertSettings(existingSettings) {
        const pluginStore = getPluginStore({ strapi });
        if (!pluginStore) {
            return {};
        }
        const linkService = strapi.plugin('link').service('link');
        const contentTypes = linkService.getContentTypes();
        const settings = contentTypes.reduce((a, value) => {
            if (value.kind === 'singleType') {
                const setting = {
                    slug: value.info.singularName.replace(/-page$/, ''),
                    ...(existingSettings ? existingSettings[value.uid] : {}),
                    kind: 'singleType',
                };
                a[value.uid] = setting;
            }
            else if (value.kind === 'collectionType') {
                const attributes = linkService.getSlugAttributes(value.uid);
                const setting = {
                    ...(existingSettings ? existingSettings[value.uid] : {}),
                    kind: 'collectionType',
                    attributes: attributes,
                };
                a[value.uid] = setting;
            }
            return a;
        }, {});
        return this.setSettings(settings);
    },
    async getSettings() {
        const pluginStore = getPluginStore({ strapi });
        if (!pluginStore) {
            return {};
        }
        const settings = (await pluginStore.get({ key: 'settings' }));
        return this.upsertSettings(settings);
    },
    async setSettings(settings) {
        const pluginStore = getPluginStore({ strapi });
        if (!pluginStore) {
            return {};
        }
        return pluginStore.set({ key: 'settings', value: settings }).then(() => settings);
    },
    async setSetting(uid, setting) {
        const pluginStore = getPluginStore({ strapi });
        if (!pluginStore) {
            return {};
        }
        const settings = (await pluginStore.get({ key: 'settings' }));
        const newSettings = {
            ...settings,
            [uid]: setting,
        };
        return this.setSettings(newSettings);
    },
});
