"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFields = exports.getShadowTypes = void 0;
const getShadowTypes = ({ strapi }) => {
    const components = Object.entries(strapi.components);
    const contentTypes = Object.entries(strapi.contentTypes);
    const shadow = [...components, ...contentTypes].reduce((a, [uid, value]) => {
        const fields = (0, exports.getFields)(value.attributes);
        if (Boolean(fields.length)) {
            return {
                ...a,
                [uid]: {
                    fields: fields,
                    globalId: value.globalId,
                },
            };
        }
        return a;
    }, {});
    return shadow;
};
exports.getShadowTypes = getShadowTypes;
const getFields = (attributes) => {
    return Object.entries(attributes).reduce((a, [field, attribute]) => {
        if (!attribute.hasOwnProperty('customField') && attribute.type !== 'json') {
            return a;
        }
        if (attribute['customField'] === 'plugin::link.link') {
            return [...a, field];
        }
        return a;
    }, []);
};
exports.getFields = getFields;
