"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTypes = void 0;
const getTypes = ({ shadowTypes, strapi, nexus }) => {
    const types = Object.values(shadowTypes).map((shadow) => {
        return nexus.extendType({
            type: shadow.globalId,
            // TODO: Auth(?).
            auth: false,
            definition: (t) => {
                shadow.fields.forEach((field) => {
                    t.field(field, {
                        type: 'Slug',
                        resolve: (root) => {
                            const slug = root[field];
                            if (!slug) {
                                return null;
                            }
                            return strapi.plugin('link').service('link').getSlug(slug);
                        },
                    });
                });
            },
        });
    });
    return [
        nexus.objectType({
            name: 'Slug',
            auth: false,
            definition(t) {
                t.nonNull.field('id', { type: 'ID' });
                t.nonNull.string('uid');
                t.nonNull.string('kind');
                t.string('label');
                t.string('slug');
            },
        }),
        ...types,
    ];
};
exports.getTypes = getTypes;
