// create a function that generates a token based on email and user id
import jwt from 'jsonwebtoken';

export const generateToken = (email: string, id: string) => {
    return jwt.sign({ email, id }, 'secret123', { expiresIn: '5d' });
}
