import { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Calendar,
  Clock,
  Trash2,
  Menu,
  X,
  Building2,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Award,
  AlertTriangle,
  ArrowRight,
  HeartPulse,
} from 'lucide-react';
import { INITIAL_DOCTORS, SPECIALTIES } from './data/doctors';
import type { Doctor, Appointment, BookingFormData, ToastNotification } from './types';
import { useDebounce } from './hooks/useDebounce';
import { Modal } from './components/Modal';
import { BookingForm } from './components/BookingForm';

export default function App() {
  const [doctors] = useState<Doctor[]>(INITIAL_DOCTORS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('ყველა');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | undefined>(undefined);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastNotification | null>(null);
  const [appointmentToDelete, setAppointmentToDelete] = useState<Appointment | null>(null);

  // LocalStorage-დან ჯავშნების წამოღება
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const saved = localStorage.getItem('medibook_appointments');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // LocalStorage-ში შენახვა
  useEffect(() => {
    localStorage.setItem('medibook_appointments', JSON.stringify(appointments));
  }, [appointments]);

  // Toast-ის ავტომატური დახურვა 4 წამში
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  // Debounced საძიებო სიტყვა (250ms)
  const debouncedSearch = useDebounce(searchTerm, 250);

  // გაფილტვრა useMemo-თი
  const filteredDoctors = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();
    return doctors.filter((doc) => {
      const matchesSearch =
        !query ||
        doc.name.toLowerCase().includes(query) ||
        doc.specialty.toLowerCase().includes(query) ||
        doc.clinic.toLowerCase().includes(query) ||
        doc.location.toLowerCase().includes(query);
      const matchesSpecialty =
        selectedSpecialty === 'ყველა' || doc.specialty === selectedSpecialty;
      return matchesSearch && matchesSpecialty;
    });
  }, [doctors, debouncedSearch, selectedSpecialty]);

  const handleOpenBooking = (doc: Doctor, slot?: string) => {
    setSelectedDoctor(doc);
    setSelectedSlot(slot);
  };

  const handleCloseBooking = () => {
    setSelectedDoctor(null);
    setSelectedSlot(undefined);
  };

  const handleBooking = (data: BookingFormData) => {
    const newAppointment: Appointment = {
      id: 'apt-' + Date.now(),
      ...data,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };
    setAppointments((prev) => [newAppointment, ...prev]);
    setRecentlyAddedId(newAppointment.id);
    handleCloseBooking();

    // Trigger toast notification
    setToast({
      id: 'toast-' + Date.now(),
      title: 'ვიზიტი წარმატებით დაიჯავშნა!',
      message: `${data.doctorName} • ${data.date}, ${data.time}`,
      type: 'success',
    });

    // Reset recently added animation trigger after 3s
    setTimeout(() => {
      setRecentlyAddedId(null);
    }, 3000);
  };

  const confirmDeleteAppointment = () => {
    if (!appointmentToDelete) return;
    setAppointments((prev) => prev.filter((apt) => apt.id !== appointmentToDelete.id));
    setAppointmentToDelete(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 flex items-start gap-3 p-4 bg-white/95 backdrop-blur-md border border-emerald-200/80 rounded-2xl shadow-xl shadow-emerald-500/10 text-sm max-w-sm animate-in slide-in-from-top-3 duration-200">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200/60">
            <CheckCircle2 size={18} />
          </div>
          <div className="flex-1 min-w-0 pt-0.5">
            <h5 className="font-semibold text-slate-900 text-xs tracking-tight">{toast.title}</h5>
            <p className="text-xs text-slate-600 mt-0.5 truncate">{toast.message}</p>
          </div>
          <button
            onClick={() => setToast(null)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
            aria-label="დახურვა"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur-md bg-white/85 border-b border-slate-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              aria-label="მენიუს გახსნა"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Brand Logo: Squircle Cross */}
            <div className="flex items-center gap-2.5 cursor-pointer select-none">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm shadow-blue-500/25 ring-1 ring-blue-700/30">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
                  <path d="M10.5 4a1.5 1.5 0 0 1 3 0v5.5H19a1.5 1.5 0 0 1 0 3h-5.5V18a1.5 1.5 0 0 1-3 0v-5.5H5a1.5 1.5 0 0 1 0-3h5.5V4z" />
                </svg>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-slate-900">MediBook</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200/60">
                  Clinical
                </span>
              </div>
            </div>
          </div>

          {/* System Status Pill & Profile */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-[11px] font-medium text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>სისტემა აქტიურია • 24/7 მხარდაჭერა</span>
            </div>

            <a
              href="#my-appointments"
              className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1.5"
            >
              <Calendar size={14} className="text-slate-500" />
              <span className="hidden sm:inline">ჯავშნები:</span>
              <strong className="text-blue-600 font-bold">{appointments.length}</strong>
            </a>

            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              ნნ
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-8">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-blue-50/70 via-slate-50 to-white border border-slate-200/70 p-6 sm:p-10 shadow-sm">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/70 border border-blue-200 text-blue-800 text-xs font-semibold">
              <ShieldCheck size={14} className="text-blue-600" />
              <span>ევროპული სტანდარტის სამედიცინო სერვისი</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              იპოვეთ საუკეთესო ექიმი და დაჯავშნეთ ვიზიტი ონლაინ
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              გაეცანით ექიმების პროფილებს, გადაამოწმეთ ხელმისაწვდომი საათები და მიიღეთ დადასტურება წამებში.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-slate-200/60">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shrink-0">
                <HeartPulse size={18} />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">სპეციალისტები</p>
                <p className="text-sm font-bold text-slate-900">100% ვერიფიცირებული</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0">
                <Award size={18} />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">საშუალო რეიტინგი</p>
                <p className="text-sm font-bold text-slate-900">★ 4.9 / 5.0</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 shrink-0">
                <Clock size={18} />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">დაჯავშნის დრო</p>
                <p className="text-sm font-bold text-slate-900">&lt; 30 წამი</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100 shrink-0">
                <ShieldCheck size={18} />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">მონაცემთა დაცვა</p>
                <p className="text-sm font-bold text-slate-900">GDPR / ISO 27001</p>
              </div>
            </div>
          </div>
        </section>

        {/* Filter & Search Bar */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="მოძებნეთ ექიმი, სპეციალობა, კლინიკა ან უბანი..."
                className="w-full pl-10 pr-9 py-2.5 bg-white border border-slate-200/90 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm shadow-sm transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label="ძიების გასუფთავება"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Results Counter */}
            <div className="text-xs text-slate-500 font-medium self-end sm:self-center">
              ნაპოვნია <strong className="text-slate-900">{filteredDoctors.length}</strong> ექიმი
            </div>
          </div>

          {/* Specialty Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {SPECIALTIES.map((spec) => {
              const isSelected = selectedSpecialty === spec;
              const count =
                spec === 'ყველა'
                  ? doctors.length
                  : doctors.filter((d) => d.specialty === spec).length;

              return (
                <button
                  key={spec}
                  onClick={() => setSelectedSpecialty(spec)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-sm ring-1 ring-slate-900'
                      : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80'
                  }`}
                >
                  <span>{spec}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isSelected ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Doctor Catalog Grid */}
        <section>
          {filteredDoctors.length === 0 ? (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center max-w-md mx-auto space-y-3">
              <div className="w-12 h-12 mx-auto rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center">
                <Search size={22} />
              </div>
              <h3 className="font-bold text-slate-800 text-base">ექიმი ვერ მოიძებნა</h3>
              <p className="text-xs text-slate-500">
                სცადეთ სხვა საძიებო სიტყვა ან შეცვალეთ სპეციალობის ფილტრი.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedSpecialty('ყველა');
                }}
                className="mt-2 text-xs font-semibold text-blue-600 hover:text-blue-700 underline"
              >
                ფილტრების გასუფთავება
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDoctors.map((doc) => (
                <article
                  key={doc.id}
                  className="group relative bg-white border border-slate-200/80 hover:border-blue-400/90 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden"
                >
                  <div>
                    {/* Doctor Portrait Header */}
                    <div className="relative h-52 w-full rounded-xl overflow-hidden bg-slate-100 mb-4 ring-1 ring-slate-200/60">
                      <img
                        src={doc.avatar}
                        alt={doc.name}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      {/* Availability Badge */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-white/95 backdrop-blur-md rounded-lg text-[11px] font-semibold text-emerald-700 shadow-sm border border-emerald-100/80">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>ხელმისაწვდომია დღეს</span>
                      </div>

                      {/* Rating Badge */}
                      <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-white/95 backdrop-blur-md rounded-lg text-xs font-bold text-slate-800 shadow-sm border border-slate-100">
                        <span className="text-amber-500">★</span>
                        <span>{doc.rating.toFixed(1)}</span>
                      </div>
                    </div>

                    {/* Doctor Info */}
                    <div className="space-y-1">
                      <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors">
                        {doc.name}
                      </h3>
                      <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                        {doc.specialty}
                      </p>
                    </div>

                    {/* Clinic and Meta details */}
                    <div className="mt-3.5 space-y-1.5 text-xs text-slate-500 border-t border-slate-100 pt-3">
                      <div className="flex items-center gap-2 truncate">
                        <Building2 size={13} className="text-slate-400 shrink-0" />
                        <span className="text-slate-700 font-medium truncate">{doc.clinic}</span>
                      </div>
                      <div className="flex items-center gap-2 truncate">
                        <MapPin size={13} className="text-slate-400 shrink-0" />
                        <span className="truncate">{doc.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award size={13} className="text-slate-400 shrink-0" />
                        <span>გამოცდილება: {doc.experience}</span>
                      </div>
                    </div>

                    {/* Interactive Time Slots */}
                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <p className="text-[11px] font-semibold text-slate-600 mb-2 flex items-center justify-between">
                        <span>თავისუფალი საათები:</span>
                        <span className="text-[10px] text-blue-600 font-normal">დააჭირეთ სასურველ დროს</span>
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {doc.availableSlots.map((slot) => (
                          <button
                            key={slot}
                            onClick={() => handleOpenBooking(doc, slot)}
                            className="px-2.5 py-1 text-xs font-medium bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 hover:border-blue-300 border border-slate-200/80 rounded-lg transition-colors cursor-pointer"
                            title={`დაჯავშნა ${slot}-ზე`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Primary Booking Button */}
                  <button
                    onClick={() => handleOpenBooking(doc)}
                    className="mt-5 w-full py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold rounded-xl shadow-sm shadow-blue-500/20 hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Calendar size={14} />
                    <span>ვიზიტის დაჯავშნა</span>
                    <ArrowRight size={14} className="opacity-70 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Appointments Table Section */}
        <section id="my-appointments" className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">ჩემი ჯავშნები</h2>
              <p className="text-xs text-slate-500 mt-0.5">აქტიური სამედიცინო ვიზიტების სრული რეესტრი</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200/60">
              {appointments.length} ჯავშანი
            </span>
          </div>

          {appointments.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <div className="w-10 h-10 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                <Calendar size={18} />
              </div>
              <p className="text-sm font-medium text-slate-700">აქტიური ჯავშნები არ გაქვთ</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                აირჩიეთ სასურველი სპეციალისტი ზემოთ მოცემული სიიდან და დაჯავშნეთ ვიზიტი.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 text-[11px] uppercase tracking-wider font-semibold">
                    <th className="pb-3 pl-2">ექიმი და კლინიკა</th>
                    <th className="pb-3">პაციენტი</th>
                    <th className="pb-3">თარიღი</th>
                    <th className="pb-3">დრო</th>
                    <th className="pb-3">სტატუსი</th>
                    <th className="pb-3 pr-2 text-right">მოქმედება</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {appointments.map((apt) => {
                    const isNew = apt.id === recentlyAddedId;

                    return (
                      <tr
                        key={apt.id}
                        className={`transition-colors ${
                          isNew ? 'animate-highlight bg-blue-50/60' : 'even:bg-slate-50/40 hover:bg-slate-50'
                        }`}
                      >
                        {/* Doctor Column */}
                        <td className="py-3.5 pl-2">
                          <div className="flex items-center gap-3">
                            {apt.doctorAvatar ? (
                              <img
                                src={apt.doctorAvatar}
                                alt={apt.doctorName}
                                className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
                              />
                            ) : (
                              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs shrink-0">
                                Dr
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="font-semibold text-slate-900 text-xs sm:text-sm truncate">
                                {apt.doctorName}
                              </p>
                              <p className="text-[11px] text-blue-600 font-medium truncate">
                                {apt.specialty}
                                {apt.clinic && <span className="text-slate-400 font-normal"> • {apt.clinic}</span>}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Patient Column */}
                        <td className="py-3.5 text-xs text-slate-700">
                          <p className="font-semibold text-slate-900">{apt.patientName}</p>
                          <p className="text-slate-400 text-[11px]">{apt.phone}</p>
                        </td>

                        {/* Date Column */}
                        <td className="py-3.5 text-xs text-slate-700">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium">
                            <Calendar size={13} className="text-slate-400" />
                            {apt.date}
                          </span>
                        </td>

                        {/* Time Column */}
                        <td className="py-3.5 text-xs text-slate-700">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium">
                            <Clock size={13} className="text-slate-400" />
                            {apt.time}
                          </span>
                        </td>

                        {/* Status Column */}
                        <td className="py-3.5">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            დადასტურებული
                          </span>
                        </td>

                        {/* Delete Action */}
                        <td className="py-3.5 pr-2 text-right">
                          <button
                            onClick={() => setAppointmentToDelete(apt)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="ჯავშნის გაუქმება"
                            aria-label="ჯავშნის გაუქმება"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200/80 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">MediBook Clinical Systems</span>
            <span>•</span>
            <span>ვერსია 2.4</span>
          </div>
          <p className="text-center sm:text-right">
            გადაუდებელი შემთხვევებისთვის დარეკეთ: <strong className="text-rose-600">112</strong>
          </p>
        </div>
      </footer>

      {/* Booking Modal */}
      <Modal
        isOpen={!!selectedDoctor}
        onClose={handleCloseBooking}
        title="ვიზიტის დაჯავშნა"
        subtitle="შეავსეთ ფორმა ექიმთან კონსულტაციის დასაჯავშნად"
      >
        {selectedDoctor && (
          <BookingForm
            doctor={selectedDoctor}
            initialSlot={selectedSlot}
            onSubmit={handleBooking}
            onCancel={handleCloseBooking}
          />
        )}
      </Modal>

      {/* Deletion Confirmation Modal */}
      <Modal
        isOpen={!!appointmentToDelete}
        onClose={() => setAppointmentToDelete(null)}
        title="ჯავშნის გაუქმება"
        subtitle="დაადასტურეთ თქვენი გადაწყვეტილება"
      >
        {appointmentToDelete && (
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3.5 bg-rose-50 border border-rose-200/80 rounded-xl text-rose-800 text-xs">
              <AlertTriangle size={18} className="text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">ნამდვილად გსურთ ჯავშნის გაუქმება?</p>
                <p className="mt-1 text-rose-700">
                  გაუქმების შემდეგ დროის მონაკვეთი კვლავ გახდება ხელმისაწვდომი სხვა პაციენტებისთვის.
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1 text-slate-600 border border-slate-200/80">
              <p>
                ექიმი: <strong className="text-slate-900">{appointmentToDelete.doctorName}</strong> ({appointmentToDelete.specialty})
              </p>
              <p>
                პაციენტი: <strong className="text-slate-900">{appointmentToDelete.patientName}</strong>
              </p>
              <p>
                დრო და თარიღი: <strong className="text-slate-900">{appointmentToDelete.date} • {appointmentToDelete.time}</strong>
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setAppointmentToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                უკან დაბრუნება
              </button>
              <button
                type="button"
                onClick={confirmDeleteAppointment}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-sm cursor-pointer"
              >
                დიახ, გაუქმება
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}