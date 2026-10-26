import { useState, type FC, type FormEvent, type ChangeEvent } from 'react';
import type { Doctor, BookingFormData } from '../types';

interface BookingFormProps {
    doctor: Doctor;
    onSubmit: (bookingData: BookingFormData) => void;
    onCancel: () => void;
}

export const BookingForm: FC<BookingFormProps> = ({ doctor, onSubmit, onCancel }) => {
    const [patientName, setPatientName] = useState('');
    const [phone, setPhone] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState(doctor.availableSlots[0] || '');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!patientName.trim() || !phone.trim() || !date || !time) {
            setError('გთხოვთ შეავსოთ ყველა სავალდებულო ველი');
            return;
        }

        setError('');
        setIsSubmitting(true);

        setTimeout(() => {
            onSubmit({
                doctorId: doctor.id,
                doctorName: doctor.name,
                specialty: doctor.specialty,
                patientName,
                phone,
                date,
                time,
            });
            setIsSubmitting(false);
        }, 600);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="p-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
                    {error}
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-slate-700">პაციენტის სახელი, გვარი</label>
                <input
                    type="text"
                    value={patientName}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPatientName(e.target.value)}
                    placeholder="მაგ: გიორგი გიორგაძე"
                    className="w-full mt-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700">ტელეფონის ნომერი</label>
                <input
                    type="tel"
                    value={phone}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
                    placeholder="599 00 00 00"
                    className="w-full mt-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700">თარიღი</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setDate(e.target.value)}
                        className="w-full mt-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700">დრო</label>
                    <select
                        value={time}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => setTime(e.target.value)}
                        className="w-full mt-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {doctor.availableSlots.map((slot) => (
                            <option key={slot} value={slot}>
                                {slot}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded"
                >
                    გაუქმება
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded"
                >
                    {isSubmitting ? 'ჯავშანი მუშავდება...' : 'დადასტურება'}
                </button>
            </div>
        </form>
    );
};