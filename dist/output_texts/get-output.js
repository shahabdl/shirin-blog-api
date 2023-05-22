"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("./errors");
const getText = (textName, language) => {
    switch (language.toUpperCase()) {
        case "EN":
            return errors_1.EN[textName];
        default:
            return errors_1.EN[textName];
    }
};
exports.default = getText;
