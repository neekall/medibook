import { useState, type FC, type FormEvent, type ChangeEvent } from 'react';
import { Calendar, Clock, Phone, User, Check, AlertCircle, Building2 } from 'lucide-react';
import type { Doctor, BookingFormData } from '../types';

interface BookingFormProps {
    doctor: Doctor;
    initialSlot?: string;
    onSubmit: (bookingData: BookingFormData) => void;
    onCancel: () => void;
}

export const BookingForm: FC<BookingFormProps> = ({ doctor, initialSlot, onSubmit, onCancel }) => {
    const today = new Date().toISOString().split('T')[0];

    const [patientName, setPatientName] = useState('');
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
            setError('გთხოვთ აირჩიოთ ვიზიტის სასურველი თარიღი');
            return;
        }
        if (!time) {
            setError('გთხოვთ აირჩიოთ თავისუფალი დროის მონაკვეთი');
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
        }, 500);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Doctor Snapshot Card */}
            <div className="flex items-center gap-3.5 p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl">
                <img
                    src={doctor.avatar}
                    alt={doctor.name}
                    className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200"
                />
                <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                        <h4 className="font-semibold text-slate-900 text-sm truncate">{doctor.name}</h4>
                        <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60 shrink-0">
                            ★ {doctor.rating}
                        </span>
                    </div>
                    <p className="text-xs text-blue-600 font-medium">{doctor.specialty}</p>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5 truncate">
                        <Building2 size={11} className="text-slate-400 shrink-0" />
                        <span className="truncate">{doctor.clinic}</span>
                    </div>
                </div>
            </div>

            {error && (
                <div className="flex items-center gap-2 p-3 text-xs text-red-700 bg-red-50 border border-red-200/80 rounded-xl animate-in fade-in">
                    <AlertCircle size={15} className="text-red-500 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {/* Patient Name */}
            <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                    პაციენტის სახელი, გვარი
                </label>
                <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        value={patientName}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            setPatientName(e.target.value);
                            if (error) setError('');
                        }}
                        placeholder="მაგ: გიორგი გიორგაძე"
                        className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50/60 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all shadow-sm"
                        required
                    />
                </div>
            </div>

            {/* Phone Number */}
            <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                    საკონტაქტო ტელეფონი
                </label>
                <div className="relative">
                    <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            setPhone(e.target.value);
                            if (error) setError('');
                        }}
                        placeholder="599 00 00 00"
                        className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50/60 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all shadow-sm"
                        required
                    />
                </div>
            </div>

            {/* Date Selection */}
            <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                    ვიზიტის თარიღი
                </label>
                <div className="relative">
                    <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                        type="date"
                        min={today}
                        value={date}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            setDate(e.target.value);
                            if (error) setError('');
                        }}
                        className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50/60 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all shadow-sm cursor-pointer"
                        required
                    />
                </div>
            </div>

            {/* Interactive Slot Selector */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        თავისუფალი საათები
                    </label>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Clock size={12} className="text-slate-400" />
                        ხანგრძლივობა: 30 წთ
                    </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
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
                                className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all flex items-center justify-center gap-1.5 ${
                                    isSelected
                                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/25 ring-2 ring-blue-600/30'
                                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 hover:border-slate-300'
                                }`}
                            >
                                {isSelected && <Check size={13} className="stroke-[3]" />}
                                <span>{slot}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isSubmitting}
                    className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
                >
                    გაუქმება
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 rounded-xl shadow-sm shadow-blue-600/25 hover:shadow transition-all flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                        <>
                            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>ჯავშანი მუშავდება...</span>
                        </>
                    ) : (
                        <span>ჯავშნის დადასტურება</span>
                    )}
                </button>
            </div>
        </form>
    );
};