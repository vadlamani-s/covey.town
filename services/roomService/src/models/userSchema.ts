/* eslint-disable */
import bcrypt from 'bcryptjs';
import { mongo, Mongoose, Schema, model } from 'mongoose';
import { userInfo } from 'os';
import { IUser, IUserDocument } from '../types/IUser';

const SALT_WORK_FACTOR = 10;

const LoginSchema = new Schema<IUserDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
  creationDate: { type: Date, default: new Date() },
});


LoginSchema.pre('save', function (next) {
  const user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);

      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});


LoginSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
      if (err) return cb(err);
      cb(null, isMatch);
  });
};

export const UserModel = model('user', LoginSchema, "users");
