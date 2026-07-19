import { Router } from 'express';
import {
  registerOrganizer,
  loginOrganizer,
  registerCustomer,
  loginCustomer
} from '../controllers/authController';
import { validate } from '../middlewares/validate';
import { registerSchema, loginSchema } from '../validations/auth.schema';

const router = Router();

router.post('/organizer/register', validate(registerSchema), registerOrganizer);
router.post('/organizer/login', validate(loginSchema), loginOrganizer);
router.post('/customer/register', validate(registerSchema), registerCustomer);
router.post('/customer/login', validate(loginSchema), loginCustomer);

export default router;
