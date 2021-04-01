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
