import { IUserUpdateRequest } from '../types/IUser';
import User from '../types/User';

export default class DummyDB {
  private readonly _users: Record<string, User> = {};

  constructor(newUser: User) {
    this._users[newUser.emailId] = newUser;
  }

  set newUser(newUser: User) {
    this._users[newUser.emailId] = newUser;
  }

  set updateUser(updateData: IUserUpdateRequest) {
    const updatedUser = new User(
      updateData.name,
      this._users[updateData.emailId].emailId,
      this._users[updateData.emailId].password,
    );
    this._users[updateData.emailId] = updatedUser;
  }

  getUserById(emailId: string): User | null {
    return this._users[emailId] as User | null;
  }

  deleteUserById(emailId: string): void {
    delete this._users[emailId];
  }

  get allUsers(): Record<string, User> {
    return this._users;
  }
}
