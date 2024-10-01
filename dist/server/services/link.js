"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
// TODO: from options.
const LEADING_SLASH = true;
const getSlug = (...args) => {
    const paths = [LEADING_SLASH && '/', ...args].filter(Boolean);
    return path_1.default.join(...paths);
};
const getEntries = async (uid, field) => {
    var _a;
    const fields = field ? [field] : undefined;
    const entries = (_a = (await strapi.entityService.findMany(uid, { fields }))) !== null && _a !== void 0 ? _a : [];
    return Array.isArray(entries) ? entries : [entries];
};
exports.default = ({ strapi }) => ({
    getContentTypes() {
        const contentTypes = Object.entries(strapi.contentTypes);
        return contentTypes.reduce((a, [uid, value]) => {
            if (!uid.includes('api::')) {
                return a;
            }
            return [...a, value];
        }, []);
    },
    async getSlug(slug) {
        var _a;
        const settings = await strapi.plugin('link').service('settings').getSettings();
        strapi.log.info(JSON.stringify(slug));
        if (settings[slug.uid] === undefined || settings[slug.uid].enabled !== true) {
            return null;
        }
        if (slug.kind === 'singleType') {
            const href = settings[slug.uid].slug;
            return { ...slug, slug: getSlug(href) };
        }
        if (slug.kind === 'collectionType') {
            const attribute = settings[slug.uid].attribute;
            if (!attribute) {
                return null;
            }
            const entry = await ((_a = strapi.entityService) === null || _a === void 0 ? void 0 : _a.findOne(slug.uid, slug.id, {
                fields: [attribute],
            }));
            return entry ? { ...slug, slug: getSlug(entry[attribute]) } : null;
        }
        return null;
        // const entry = await strapi.entityService?.findOne(slug.uid, slug.id, {
        // 	// TODO make modular.
        // 	fields: ['slug'],
        // });
        // return entry ? { ...slug, slug: getSlug(entry['slug']) } : null;
    },
    getSlugAttributes(uid) {
        const contentType = strapi.contentTypes[uid];
        if (!contentType) {
            return [];
        }
        return Object.entries(contentType.attributes).reduce((a, [key, value]) => {
            if (['string', 'uid'].includes(value.type)) {
                return [...a, key];
            }
            return a;
        }, []);
    },
    async getSlugs(options) {
        const settings = await strapi.plugin('link').service('settings').getSettings();
        if (options.kind === 'singleType') {
            const slug = settings[options.uid].slug;
            const entries = await getEntries(options.uid);
            const slugs = entries.map((entry) => ({
                id: entry.id,
                uid: options.uid,
                kind: options.kind,
                slug: getSlug(slug),
            }));
            return slugs;
        }
        if (options.kind === 'collectionType') {
            const setting = settings[options.uid];
            const attribute = setting.attribute;
            if (!attribute || !setting.enabled) {
                return [];
            }
            const entries = await getEntries(options.uid, attribute);
            const slugs = entries.map((entry) => ({
                id: entry.id,
                uid: options.uid,
                kind: options.kind,
                slug: getSlug(entry[attribute]),
            }));
            return slugs;
        }
        return [];
    },
});
