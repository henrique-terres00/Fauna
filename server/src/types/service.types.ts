import { Document } from 'mongoose';

export interface IService extends Document {
  title: string;
  description: string;
  price: number;
  duration: number;
  icon: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceInput {
  title: string;
  description: string;
  price: number;
  duration: number;
  icon: string;
  active?: boolean;
}
