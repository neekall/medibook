import { useState, type FC, type FormEvent, type ChangeEvent } from 'react';
import { Calendar, Clock, Phone, User, Check, AlertCircle } from 'lucide-react';
import type { Doctor, BookingFormData } from '../types';

interface BookingFormProps {
    doctor: Doctor;
    initialSlot?: string;
    defaultPatientName?: string;
    onSubmit: (bookingData: BookingFormData) => void;
    onCancel: () => void;
}

export const BookingForm: FC<BookingFormProps> = ({
    doctor,
    initialSlot,
    defaultPatientName = '',
    onSubmit,
    onCancel,
}) => {
    const today = new Date().toISOString().split('T')[0];

    const [patientName, setPatientName] = useState(defaultPatientName);
    const [phone, setPhone] = useState('');
    const [date, setDate] = useState(today);
    const [time, setTime] = useState(initialSlot || doctor.availableSlots[0] || '');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!patientName.trim()) {
            setError('გთხოვთ მიუთითოთ პაციენტის სახელი და გვარი');
            return;
        }
        if (!phone.trim() || phone.trim().length < 8) {
            setError('გთხოვთ მიუთითოთ მოქმედი ტელეფონის ნომერი');
            return;
        }
        if (!date) {
            setError('გთხოვთ აირჩიოთ ვიზიტის თარიღი');
            return;
        }
        if (!time) {
            setError('გთხოვთ აირჩიოთ ვიზიტის დრო');
            return;
        }

        setError('');
        setIsSubmitting(true);

        setTimeout(() => {
            onSubmit({
                doctorId: doctor.id,
                doctorName: doctor.name,
                doctorAvatar: doctor.avatar,
                specialty: doctor.specialty,
                clinic: doctor.clinic,
                location: doctor.location,
                patientName: patientName.trim(),
                phone: phone.trim(),
                date,
                time,
            });
            setIsSubmitting(false);
        }, 400);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Doctor Snapshot */}
            <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <img
                    src={doctor.avatar}
                    alt={doctor.name}
                    className="w-12 h-12 rounded-lg object-cover object-[center_20%] ring-1 ring-slate-200 shrink-0"
                />
                <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                        <h4 className="font-semibold text-slate-900 text-sm truncate">{doctor.name}</h4>
                        <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 shrink-0">
                            ★ {doctor.rating}
                        </span>
                    </div>
                    <p className="text-xs text-blue-600 font-medium">{doctor.specialty}</p>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{doctor.clinic}</p>
                </div>
            </div>

            {error && (
                <div className="flex items-center gap-2 p-2.5 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle size={15} className="text-red-500 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {/* Patient Name */}
            <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                    პაციენტის სახელი, გვარი
                </label>
                <div className="relative">
                    <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        value={patientName}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            setPatientName(e.target.value);
                            if (error) setError('');
                        }}
                        placeholder="მაგ: გიორგი გიორგაძე"
                        className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                    />
                </div>
            </div>

            {/* Phone */}
            <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                    საკონტაქტო ტელეფონი
                </label>
                <div className="relative">
                    <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            setPhone(e.target.value);
                            if (error) setError('');
                        }}
                        placeholder="599 00 00 00"
                        className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                    />
                </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                        ვიზიტის თარიღი
                    </label>
                    <div className="relative">
                        <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <input
                            type="date"
                            min={today}
                            value={date}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                setDate(e.target.value);
                                if (error) setError('');
                            }}
                            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                        სასურველი დრო
                    </label>
                    <div className="relative">
                        <Clock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <select
                            value={time}
                            onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                                setTime(e.target.value);
                                if (error) setError('');
                            }}
                            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer"
                        >
                            {doctor.availableSlots.map((slot) => (
                                <option key={slot} value={slot}>
                                    {slot}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Time Slot Chips */}
            <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                    ხელმისაწვდომი საათები:
                </label>
                <div className="flex flex-wrap gap-1.5">
                    {doctor.availableSlots.map((slot) => {
                        const isSelected = time === slot;
                        return (
                            <button
                                key={slot}
                                type="button"
                                onClick={() => {
                                    setTime(slot);
                                    if (error) setError('');
                                }}
                                className={`px-2.5 py-1 text-xs font-medium rounded-md border transition-colors flex items-center gap-1 cursor-pointer ${
                                    isSelected
                                        ? 'bg-blue-600 text-white border-blue-600'
                                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                                }`}
                            >
                                {isSelected && <Check size={12} />}
                                <span>{slot}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isSubmitting}
                    className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                    გაუქმება
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'მუშავდება...' : 'ჯავშნის დადასტურება'}
                </button>
            </div>
        </form>
    );
};