"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginCustomer = exports.registerCustomer = exports.loginOrganizer = exports.registerOrganizer = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Organizer_1 = __importDefault(require("../models/Organizer"));
const Customer_1 = __importDefault(require("../models/Customer"));
const responseHandler_1 = require("../utils/responseHandler");
const generateToken = (id, role) => {
    return jsonwebtoken_1.default.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};
const registerOrganizer = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existing = await Organizer_1.default.findOne({ email });
        if (existing)
            return (0, responseHandler_1.sendError)(res, 400, 'Email already in use');
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const organizer = await Organizer_1.default.create({ name, email, password: hashedPassword });
        (0, responseHandler_1.sendSuccess)(res, 201, 'Organizer registered', { token: generateToken(organizer.id, 'Organizer') });
    }
    catch (err) {
        (0, responseHandler_1.sendError)(res, 500, err.message);
    }
};
exports.registerOrganizer = registerOrganizer;
const loginOrganizer = async (req, res) => {
    try {
        const { email, password } = req.body;
        const organizer = await Organizer_1.default.findOne({ email });
        if (!organizer)
            return (0, responseHandler_1.sendError)(res, 401, 'Invalid credentials');
        const isMatch = await bcryptjs_1.default.compare(password, organizer.password);
        if (!isMatch)
            return (0, responseHandler_1.sendError)(res, 401, 'Invalid credentials');
        (0, responseHandler_1.sendSuccess)(res, 200, 'Login successful', { token: generateToken(organizer.id, 'Organizer') });
    }
    catch (err) {
        (0, responseHandler_1.sendError)(res, 500, err.message);
    }
};
exports.loginOrganizer = loginOrganizer;
const registerCustomer = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existing = await Customer_1.default.findOne({ email });
        if (existing)
            return (0, responseHandler_1.sendError)(res, 400, 'Email already in use');
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const customer = await Customer_1.default.create({ name, email, password: hashedPassword });
        (0, responseHandler_1.sendSuccess)(res, 201, 'Customer registered', { token: generateToken(customer.id, 'Customer') });
    }
    catch (err) {
        (0, responseHandler_1.sendError)(res, 500, err.message);
    }
};
exports.registerCustomer = registerCustomer;
const loginCustomer = async (req, res) => {
    try {
        const { email, password } = req.body;
        const customer = await Customer_1.default.findOne({ email });
        if (!customer)
            return (0, responseHandler_1.sendError)(res, 401, 'Invalid credentials');
        const isMatch = await bcryptjs_1.default.compare(password, customer.password);
        if (!isMatch)
            return (0, responseHandler_1.sendError)(res, 401, 'Invalid credentials');
        (0, responseHandler_1.sendSuccess)(res, 200, 'Login successful', { token: generateToken(customer.id, 'Customer') });
    }
    catch (err) {
        (0, responseHandler_1.sendError)(res, 500, err.message);
    }
};
exports.loginCustomer = loginCustomer;
