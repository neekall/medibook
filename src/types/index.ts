export interface Doctor {
    id: string;
    name: string;
    specialty: string;
    rating: number;
    experience: string;
    availableSlots: string[];
}

export interface Appointment {
    id: string;
    doctorId: string;
    doctorName: string;
    specialty: string;
    patientName: string;
    phone: string;
    date: string;
    time: string;
    status: 'confirmed' | 'pending';
}

export type BookingFormData = Omit<Appointment, 'id' | 'status'>;