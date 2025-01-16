import { Document } from 'mongoose';

export interface IVeterinarian extends Document {
  name: string;
  email: string;
  phone: string;
  specialties: string[];
  crmv: string;
  active: boolean;
  workDays: string[];
  workHours: {
    start: string;
    end: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface VeterinarianInput {
  name: string;
  email: string;
  phone: string;
  specialties: string[];
  crmv: string;
  workDays: string[];
  workHours: {
    start: string;
    end: string;
  };
  active?: boolean;
}
