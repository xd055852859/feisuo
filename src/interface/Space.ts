import { Board } from "./Board";
import { User } from "./User";

export interface Space {
  creatorInfo: null;
  memberCount: number;
  name: string;
  role: number;
  logo?: string;
  _key: string;
}
export interface SpaceDetail {
  bookList: Board[];
  role: number;
  spaceInfo: {
    logo: string;
    name: string;
    _key: string;
    memberCount: number;
    ownerInfo: User;
  };
}

export interface SpaceMember {
  nickName: null | string;
  role: number;
  userAvatar: null | string;
  userKey: string;
  userName: null | string;
}
