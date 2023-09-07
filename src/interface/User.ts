export interface Person {
  userAvatar?: string;
  userName?: string;
  _key: string;
}

export interface User extends Person {
  email?: string;
  mobile?: string;
  privateSpace: string;
}
