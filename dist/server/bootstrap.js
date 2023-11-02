"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("./graphql");
exports.default = ({ strapi }) => {
    (0, graphql_1.setup)({ strapi });
};
