export interface IUser {
  user_id: Number;
  username: String;
  password: String;
  role: 'employee' | 'admin';
}
