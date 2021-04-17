import bcrypt from 'bcryptjs';
import { model, Schema } from 'mongoose';
import { IUserDocument } from '../types/IUser';

/**
 * The User schema is used for the creation the Mongo databse for storing the user information. This is
 * is used for the authorization purpose. The file contains method for hashing the password before being 
 * stored in the database.
 */

const LoginSchema = new Schema<IUserDocument>({
  name: { type: String, required: true },
  emailId: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
  creationDate: { type: Date, default: new Date() },
});

export function generateHash(password: string): string {
  const salt = bcrypt.genSaltSync();
  const hashedPassword = bcrypt.hashSync(password, salt);
  return hashedPassword;
}

export const UserModel = model('user', LoginSchema, 'users');
