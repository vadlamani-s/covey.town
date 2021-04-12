import { nanoid } from 'nanoid';

export default class User {

  /** The unique identifier for this player * */
  private readonly _emailId: string;

  /** The player's name, which is not guaranteed to be unique within the town * */
  private readonly _name: string;

  /** The player's password set at creation* */
  private readonly _password: string;

  /** The date of creation* */
  private readonly _creationDate: Date;

  constructor(name: string, emailId: string, password: string) {
    if (name.length === 0) {
      throw new Error('Name field is empty');
    }

    if (password.length < 8) {
      throw new Error('Password is less than 8 characters');
    }

    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(emailId)) {
      throw new Error('Email is not in the right format');
    }

    this._name = name;
    this._emailId = emailId;
    this._password = password;
    this._creationDate = new Date();

  }

  get name(): string {
    return this._name;
  }

  get emailId(): string {
    return this._emailId;
  }

  get password(): string {
    return this._password;
  }

  get creationDate(): Date {
    return this._creationDate;
  }

}
