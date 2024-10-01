"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTypes = void 0;
const getTypes = ({ shadowTypes, strapi, nexus }) => {
    const types = Object.values(shadowTypes).map((shadow) => {
        return nexus.extendType({
            type: shadow.globalId,
            auth: false,
            definition: (t) => {
                shadow.fields.forEach((field) => {
                    t.field(field, {
                        type: 'Slug',
                        resolve: async (root) => {
                            const value = root[field];
                            if (!value) {
                                return null;
                            }
                            if (value.type === 'external') {
                                return {
                                    href: value.link,
                                    type: value.type,
                                    label: value.label,
                                    target: value.target,
                                    link: {
                                        slug: 'sd',
                                    },
                                };
                            }
                            if (value.type === 'internal') {
                                const link = await strapi.plugin('link').service('link').getSlug(value.link);
                                return {
                                    href: link.slug,
                                    type: value.type,
                                    label: value.label,
                                    target: value.target,
                                    link: value.link,
                                };
                            }
                        },
                    });
                });
            },
        });
    });
    return [
        // nexus.objectType({
        // 	name: 'SlugLinkInternal',
        // 	auth: false,
        // 	definition(t: any) {
        // 		t.nonNull.field('id', { type: 'ID' });
        // 		t.nonNull.string('uid');
        // 		t.nonNull.string('kind');
        // 	},
        // }),
        // nexus.extendType({
        // 	name: 'SlugLinkExternal',
        // 	auth: false,
        // 	definition(t: any) {
        // 		t.nonNull.string('slug');
        // 	},
        // }),
        // nexus.unionType({
        // 	name: 'SlugLink',
        // 	definition(t: any) {
        // 		t.members('SlugLinkInternal', 'SlugLinkExternal');
        // 	},
        // 	resolveType: (value: { type: LinkValue['type'] }) => {
        // 		return value.type === 'internal' ? 'SlugLinkInternal' : 'SlugLinkInternal';
        // 	},
        // }),
        nexus.objectType({
            name: 'Slug',
            auth: false,
            definition(t) {
                t.nonNull.string('href');
                t.nonNull.string('type');
                t.nonNull.string('label');
                t.nonNull.string('target');
                // t.field('link', {
                // 	type: 'SlugLink',
                // 	resolveType: (value: { link: LinkValue['link'] }) => {
                // 		return value.link;
                // 	},
                // });
            },
        }),
        ...types,
    ];
};
exports.getTypes = getTypes;
