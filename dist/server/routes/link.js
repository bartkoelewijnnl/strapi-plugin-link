"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    routes: [
        {
            method: 'GET',
            path: '/content-types',
            handler: 'link.getContentTypes',
            config: {
                auth: false,
                policies: [],
            },
        },
        {
            method: 'POST',
            path: '/slugs',
            handler: 'link.getSlugs',
            config: {
                auth: false,
                policies: [],
            },
        },
        {
            method: 'POST',
            path: '/slug',
            handler: 'link.getSlug',
            config: {
                auth: false,
                policies: [],
            },
        },
    ],
};
