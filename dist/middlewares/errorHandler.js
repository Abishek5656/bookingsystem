"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const responseHandler_1 = require("../utils/responseHandler");
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    const message = err.message || 'Internal Server Error';
    (0, responseHandler_1.sendError)(res, statusCode, message, process.env.NODE_ENV === 'development' ? err.stack : undefined);
};
exports.errorHandler = errorHandler;
