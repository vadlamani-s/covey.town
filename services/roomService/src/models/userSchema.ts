import bcrypt from 'bcryptjs';
import { model, Schema } from 'mongoose';
import { IUserDocument } from '../types/IUser';


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
