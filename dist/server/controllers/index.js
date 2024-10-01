"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const link_1 = __importDefault(require("./link"));
const settings_1 = __importDefault(require("./settings"));
exports.default = {
    link: link_1.default,
    settings: settings_1.default,
};
