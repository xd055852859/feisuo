import { User } from "./User";

export interface ResultProps {
  msg: string;
  data: any;
  status: number;
  pageNum?: number;
  totalNum?: number;
  total?: number;
}
export interface ApiData {
  url: string;
  params: object;
  docDataName?: string[];
}
export enum ROLELIST {
  //箭头类型
  "SpaceSuperAdmin" = -2,
  "SpaceAdmin" = -1,
  "SuperAdmin" = 0,
  "Admin" = 1,
  "Editor" = 2,
  "author" = 3,
  "Member" = 4,
}
export const ROLE_OPTIONS = [
  {
    label: "空间超管",
    value: ROLELIST.SpaceSuperAdmin,
  },
  {
    label: "空间管理员",
    value: ROLELIST.SpaceAdmin,
  },
  {
    label: "超管",
    value: ROLELIST.SuperAdmin,
  },
  {
    label: "管理员",
    value: ROLELIST.Admin,
  },
  {
    label: "编辑",
    value: ROLELIST.Editor,
  },
  {
    label: "作者",
    value: ROLELIST.author,
  },
  {
    label: "成员",
    value: ROLELIST.Member,
  },
];
export const SPACE_ROLE_OPTIONS = [
  {
    label: "超管",
    value: ROLELIST.SuperAdmin,
  },
  {
    label: "管理员",
    value: ROLELIST.Admin,
  },
  {
    label: "编辑",
    value: ROLELIST.Editor,
  },
  {
    label: "作者",
    value: ROLELIST.author,
  },
  {
    label: "成员",
    value: ROLELIST.Member,
  },
];
