import bcrypt from 'bcrypt';


/**
 * Hashes the given password using bcrypt.
 *
 * @param {string} password - The password to be hashed.
 * @return {Promise<string>} The hashed password.
 */
export async function hashPassword(password: string): Promise<string> {
    const saltRounds: number = 10;
    const hashedPassword: string = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}



/**
 * Compares a password with a hashed password and returns a boolean indicating whether they match.
 *
 * @param {string} password - The password to compare.
 * @param {string} hashedPassword - The hashed password to compare against.
 * @return {Promise<boolean>} - A Promise that resolves to a boolean indicating whether the passwords match.
 */
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
}