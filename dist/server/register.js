"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const package_json_1 = __importDefault(require("../package.json"));
const pluginId_1 = __importDefault(require("../admin/src/pluginId"));
const graphql_1 = require("./graphql");
const name = package_json_1.default.strapi.name;
exports.default = ({ strapi }) => {
    (0, graphql_1.setup)({ strapi });
    strapi.customFields.register({
        name: name,
        plugin: pluginId_1.default,
        type: 'json',
    });
};
