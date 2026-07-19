"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
const responseHandler_1 = require("../utils/responseHandler");
const validate = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            return next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                return (0, responseHandler_1.sendError)(res, 400, 'Validation Error', error.errors.map(e => ({ path: e.path.join('.'), message: e.message })));
            }
            return next(error);
        }
    };
};
exports.validate = validate;
