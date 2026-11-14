import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authMiddleware } from '../middleware/auth'; // O kung asa man nahimutang ang imong auth middleware file

const router = Router();

// Ang GET /api/users kinahanglan na karon og valid Bearer Token
router.get('/', authMiddleware, UserController.getAll);

// Ang GET /api/users/:id kinahanglan pud og token
router.get('/:id', authMiddleware, UserController.getById);

// Ang pag-create (POST /api/users) pwede ra walay token (kung para ra sa registration)
router.post('/', UserController.create);

export const userRoutes = router;