import { verify } from 'jsonwebtoken';
import { Credentials } from './IUser';

const { JWT_SECRET } = process.env;

export default class Validate {
  static validateAPIRequest(validatetoken: string): Credentials {
    let validatedCredentials: Credentials;
    try {
      validatedCredentials = verify(validatetoken, JWT_SECRET as string) as Credentials;
    } catch (err) {
      validatedCredentials = { signedIn: false };
    }
    return validatedCredentials;
  }
}
