import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { AppDataSource } from '../config/data-source';
import { User } from '../entities/User';
import { UnauthorizedError } from '../utils/errors';
import { config } from '../config/env';
import { createLogger } from '../utils/logger';

const logger = createLogger('AuthService');
const userRepository = AppDataSource.getRepository(User);

interface LoginInput {
    email: string;
    password: string;
}

interface TokenPayload extends JwtPayload {
    userId: string;
    email: string;
}

interface AuthResponse {
    token: string;
    user: {
        id: string;
        email: string;
        name: string;
    };
}

export class AuthService {

    /**
     * Login user and generate JWT token
     */
    static async login(input: LoginInput): Promise<AuthResponse> {
        const { email, password } = input;

        const user = await userRepository.findOne({
            where: { email },
            select: ['id', 'email', 'name', 'password', 'isActive'],
        });

        if (!user) {
            logger.warn('Login attempt with non-existent email', { email });
            throw new UnauthorizedError('Invalid email or password');
        }

        if (!user.isActive) {
            logger.warn('Login attempt for inactive account', { email });
            throw new UnauthorizedError('Account is deactivated');
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid) {
            logger.warn('Login attempt with wrong password', { email });
            throw new UnauthorizedError('Invalid email or password');
        }

        const tokenPayload: TokenPayload = {
            userId: user.id,
            email: user.email,
        };

        const token = jwt.sign(
            tokenPayload,
            config.jwt.secret,
            {
                expiresIn: config.jwt.expiresIn as SignOptions['expiresIn'],
            }
        );

        logger.info('User logged in successfully', {
            userId: user.id,
            email,
        });

        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
        };
    }

    /**
     * Verify JWT token
     */
    static async verifyToken(token: string): Promise<TokenPayload> {
        try {
            const decoded = jwt.verify(
                token,
                config.jwt.secret
            );

            if (
                typeof decoded === 'string' ||
                typeof decoded.userId !== 'string' ||
                typeof decoded.email !== 'string'
            ) {
                throw new UnauthorizedError('Invalid token payload');
            }

            return decoded as TokenPayload;

        } catch (error: unknown) {

            if (error instanceof UnauthorizedError) {
                throw error;
            }

            if (error instanceof jwt.TokenExpiredError) {
                throw new UnauthorizedError('Token has expired');
            }

            if (error instanceof jwt.JsonWebTokenError) {
                throw new UnauthorizedError('Invalid token');
            }

            throw new UnauthorizedError('Authentication failed');
        }
    }

    /**
     * Get user from JWT token
     */
    static async getUserFromToken(token: string): Promise<User> {
        const decoded = await this.verifyToken(token);

        const user = await userRepository.findOne({
            where: { id: decoded.userId },
            select: [
                'id',
                'email',
                'name',
                'isActive',
                'createdAt',
            ],
        });

        if (!user) {
            throw new UnauthorizedError('User not found');
        }

        if (!user.isActive) {
            throw new UnauthorizedError('Account is deactivated');
        }

        return user;
    }
}