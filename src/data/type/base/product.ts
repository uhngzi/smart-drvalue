import { processRType } from "./process";

export type productLinesRType = {
  id: string;
  productLinesGroup: {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
  },
  process: processRType;
  prcWkRemark: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export type productLinesCUType = {
  productLinesGroup: { id: string; };
  process: { id: string; };
  prcWkRemark: string;
}

export type productLinesGroupRType = {
  id: string;
  name: string;
  productLines: Array<{
    id: string;
    process: processRType;
    prcWkRemark: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
  }>
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export type productLinesGroupCUType = {
  name: string;
}