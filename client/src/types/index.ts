export type IconName = 'stethoscope' | 'syringe' | 'pill' | 'scissors' | 'heart' | 'thermometer' | 'dog' | 'cat' | 'bird' | 'fish';

export interface Service {
  _id: string;
  title: string;
  description: string;
  price: number;
  duration: number;
  icon: IconName;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Appointment {
  _id: string;
  petName: string;
  petType: string;
  petOwnerName: string;
  email: string;
  phone: string;
  serviceId: string | { 
    _id: string;
    title: string;
    description: string;
    price: number;
    duration: number;
    icon: IconName;
    active: boolean;
  };
  veterinarianId: string | { 
    _id: string;
    name: string;
    specialization: string;
    experience: string;
    description: string;
    imageUrl: string;
    active: boolean;
  };
  date: string;
  time: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface AppointmentData {
  petName: string;
  petType: string;
  petOwnerName: string;
  email: string;
  phone: string;
  serviceId: string;
  veterinarianId: string;
  date: string;
  time: string;
  notes?: string;
  status?: 'pending' | 'confirmed' | 'cancelled';
}

export interface Testimonial {
  _id: string;
  name: string;
  pet: string;
  text: string;
  rating: number;
  active: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface ServiceFormData {
  title: string;
  description: string;
  icon: IconName;
  price: number;
  duration: number;
  active: boolean;
}

export interface TestimonialFormData {
  name: string;
  pet: string;
  text: string;
  rating: number;
}

export interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedService?: Service;
  services: Service[];
}

export interface TeamMember {
  _id: string;
  name: string;
  specialization: string;
  experience: string;
  description: string;
  imageUrl: string;
  active: boolean;
  availableDays: string[];
  availableHours: string[];
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface Contact {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  updatedAt?: string;
}