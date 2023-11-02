"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (config, { strapi }) => {
    strapi.log.debug('GraphQL middleware', config);
    return (context, next) => {
        return next();
    };
};
