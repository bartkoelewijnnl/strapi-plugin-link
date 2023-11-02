"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setup = void 0;
const crud_1 = require("./crud");
const types_1 = require("./types");
const setup = ({ strapi }) => {
    // TODO: check if GraphQL is enabled.
    const extensionService = strapi.plugin('graphql').service('extension');
    const shadowTypes = (0, crud_1.getShadowTypes)({ strapi });
    // Disable link fields.
    Object.entries(shadowTypes).forEach(([uid, shadow]) => {
        shadow.fields.forEach((field) => {
            extensionService.shadowCRUD(uid).field(field).disable();
        });
    });
    const extension = ({ nexus }) => {
        const types = (0, types_1.getTypes)({ shadowTypes, strapi, nexus });
        return {
            types,
        };
    };
    extensionService.use(extension);
};
exports.setup = setup;
