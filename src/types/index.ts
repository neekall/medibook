export interface Doctor {
    id: string;
    name: string;
    specialty: string;
    rating: number;
    experience: string;
    availableSlots: string[];
    avatar: string;
    clinic: string;
    location: string;
}

export interface Appointment {
    id: string;
    doctorId: string;
    doctorName: string;
    doctorAvatar?: string;
    specialty: string;
    clinic?: string;
    location?: string;
    patientName: string;
    phone: string;
    date: string;
    time: string;
    status: 'confirmed' | 'pending';
    createdAt?: string;
}

export type BookingFormData = Omit<Appointment, 'id' | 'status'>;

export interface ToastNotification {
    id: string;
    title: string;
    message: string;
    type?: 'success' | 'info' | 'error';
}