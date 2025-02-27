import { PrismaClient } from '@prisma/client';
import { JwtPayload } from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            user?: typeof JwtPayload | string | Record<string, any>;
            prisma?: PrismaClient;
        }
    }
}
