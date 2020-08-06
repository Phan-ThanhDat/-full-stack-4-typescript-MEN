"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Regex function for search functionality
const escapeRegex = (string) => {
    return string.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};
// Exporting Function
// module.exports = escapeRegex
exports.default = escapeRegex;
//# sourceMappingURL=escapeRegex.js.map