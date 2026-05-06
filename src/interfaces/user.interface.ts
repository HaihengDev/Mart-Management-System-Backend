export interface IUser {
  id: Number;
  username: String;
  password: String;
  role: 'employee' | 'admin';
}
