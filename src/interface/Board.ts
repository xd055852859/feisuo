import { User } from "./User";

export interface Board {
  isPublic: false;
  logo: string;
  name: string;
  noVerify: boolean;
  role: number;
  showInHomePage: boolean;
  updateTime: number;
  _key: string;
  hasFav: boolean;
  lock: boolean;
}
export interface BoardDetail {
  creatorInfo: User;
  defaultRole: number;
  isPublic: boolean;
  lock: boolean;
  logo: string;
  memberCount: number;
  name: string;
  noVerify: boolean;
  role: number;
  rootKey: string;
  showInHomePage: boolean;
  spaceKey: string;
  updateTime: number;
  userKey: string;
  tagKey: string;
  tagInfo: {
    defaultView: number;
    name: string;
    _key: string;
  };
  _key: string;
}
export interface Member {
  role: number;
  userAvatar: string;
  userKey: string;
  userName: string;
}
