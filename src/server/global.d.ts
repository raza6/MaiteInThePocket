/* eslint-disable no-unused-vars */
import { User as CustomUser } from './types/user';

declare global {
    namespace Express {
        interface User extends CustomUser {}
    }
}
