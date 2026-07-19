import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Organizer from '../models/Organizer';
import Customer from '../models/Customer';
import { sendSuccess, sendError } from '../utils/responseHandler';

const generateToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET as string, { expiresIn: '30d' });
};

export const registerOrganizer = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const existing = await Organizer.findOne({ email });
    if (existing) return sendError(res, 400, 'Email already in use');

    const hashedPassword = await bcrypt.hash(password, 10);
    const organizer = await Organizer.create({ name, email, password: hashedPassword });
    
    sendSuccess(res, 201, 'Organizer registered', { token: generateToken(organizer.id, 'Organizer') });
  } catch (err: any) {
    sendError(res, 500, err.message);
  }
};

export const loginOrganizer = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const organizer = await Organizer.findOne({ email });
    if (!organizer) return sendError(res, 401, 'Invalid credentials');

    const isMatch = await bcrypt.compare(password, organizer.password!);
    if (!isMatch) return sendError(res, 401, 'Invalid credentials');

    sendSuccess(res, 200, 'Login successful', { token: generateToken(organizer.id, 'Organizer') });
  } catch (err: any) {
    sendError(res, 500, err.message);
  }
};

export const registerCustomer = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const existing = await Customer.findOne({ email });
    if (existing) return sendError(res, 400, 'Email already in use');

    const hashedPassword = await bcrypt.hash(password, 10);
    const customer = await Customer.create({ name, email, password: hashedPassword });
    
    sendSuccess(res, 201, 'Customer registered', { token: generateToken(customer.id, 'Customer') });
  } catch (err: any) {
    sendError(res, 500, err.message);
  }
};

export const loginCustomer = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const customer = await Customer.findOne({ email });
    if (!customer) return sendError(res, 401, 'Invalid credentials');

    const isMatch = await bcrypt.compare(password, customer.password!);
    if (!isMatch) return sendError(res, 401, 'Invalid credentials');

    sendSuccess(res, 200, 'Login successful', { token: generateToken(customer.id, 'Customer') });
  } catch (err: any) {
    sendError(res, 500, err.message);
  }
};
