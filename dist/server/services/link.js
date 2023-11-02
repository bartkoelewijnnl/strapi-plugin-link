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
    async getContentTypes() {
        const { contentTypes } = strapi;
        return Promise.all(await Object.entries(contentTypes).reduce(async (a, [uid, value]) => {
            if (!uid.includes('api::')) {
                return a;
            }
            return [...(await a), value];
        }, Promise.resolve([])));
    },
    async getSlug(slug, field) {
        var _a;
        if (slug.kind === 'singleType') {
            return {
                ...slug,
                slug: getSlug('todo'),
            };
        }
        const entry = await ((_a = strapi.entityService) === null || _a === void 0 ? void 0 : _a.findOne(slug.uid, slug.id, {
            // TODO make modular.
            fields: ['slug'],
        }));
        return entry
            ? {
                ...slug,
                slug: getSlug(entry['slug']),
            }
            : null;
    },
    async getSlugs(options) {
        if (options.kind === 'singleType') {
            const entries = await getEntries(options.uid);
            const slugs = entries.map((entry) => ({
                id: entry.id,
                uid: options.uid,
                kind: options.kind,
                slug: getSlug(options.slug),
            }));
            return slugs;
        }
        if (options.kind === 'collectionType') {
            const entries = await getEntries(options.uid, options.field);
            const slugs = entries.map((entry) => ({
                id: entry.id,
                uid: options.uid,
                kind: options.kind,
                slug: getSlug(options.prefix, entry[options.field]),
            }));
            return slugs;
        }
        return [];
    },
});
