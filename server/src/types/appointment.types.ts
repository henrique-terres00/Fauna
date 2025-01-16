import { Document, Types } from 'mongoose';

export interface IAppointment extends Document {
  date: Date;
  time: string;
  veterinarianId: Types.ObjectId;
  serviceId: Types.ObjectId;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  petName: string;
  petAge?: number;
  petSpecies: string;
  petBreed?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AppointmentInput {
  date: Date;
  time: string;
  veterinarianId: string;
  serviceId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  petName: string;
  petAge?: number;
  petSpecies: string;
  petBreed?: string;
  notes?: string;
}
