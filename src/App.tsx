import { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Calendar,
  Clock,
  Trash2,
  X,
  Building2,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  User,
  Edit2,
  Check,
} from 'lucide-react';
import { INITIAL_DOCTORS, SPECIALTIES, DEFAULT_AVATAR } from './data/doctors';
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
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastNotification | null>(null);
  const [appointmentToDelete, setAppointmentToDelete] = useState<Appointment | null>(null);

  // Dynamic User Profile
  const [userName, setUserName] = useState<string>(() => {
    return localStorage.getItem('medibook_user') || '';
  });
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [tempUserName, setTempUserName] = useState('');

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

  // Debounced საძიებო სიტყვა (300ms)
  const debouncedSearch = useDebounce(searchTerm, 300);

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

    setToast({
      id: 'toast-' + Date.now(),
      title: 'ვიზიტი წარმატებით დაიჯავშნა',
      message: `${data.doctorName} • ${data.date}, ${data.time}`,
      type: 'success',
    });

    setTimeout(() => {
      setRecentlyAddedId(null);
    }, 3000);
  };

  const confirmDeleteAppointment = () => {
    if (!appointmentToDelete) return;
    setAppointments((prev) => prev.filter((apt) => apt.id !== appointmentToDelete.id));
    setAppointmentToDelete(null);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = tempUserName.trim();
    setUserName(trimmed);
    if (trimmed) {
      localStorage.setItem('medibook_user', trimmed);
    } else {
      localStorage.removeItem('medibook_user');
    }
    setIsProfileModalOpen(false);
  };

  const getInitials = (name: string) => {
    if (!name.trim()) return 'მ';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-start gap-3 p-4 bg-white border border-slate-200 rounded-xl shadow-lg text-sm max-w-sm">
          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200">
            <CheckCircle2 size={16} />
          </div>
          <div className="flex-1 min-w-0 pt-0.5">
            <h5 className="font-semibold text-slate-900 text-xs">{toast.title}</h5>
            <p className="text-xs text-slate-600 mt-0.5 truncate">{toast.message}</p>
          </div>
          <button
            onClick={() => setToast(null)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors"
            aria-label="დახურვა"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-2.5">
            <img
              src="/logo.png"
              alt="MediBook"
              className="h-9 w-auto object-contain"
            />
            <span className="text-lg font-bold tracking-tight text-slate-900">MediBook</span>
          </div>

          {/* Right Header Navigation & Dynamic User Profile */}
          <div className="flex items-center gap-3">
            <a
              href="#my-appointments"
              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1.5"
            >
              <Calendar size={14} className="text-slate-500" />
              <span className="hidden sm:inline">ჯავშნები:</span>
              <strong className="text-blue-600 font-bold">{appointments.length}</strong>
            </a>

            {/* Dynamic User Profile Button */}
            {userName ? (
              <button
                onClick={() => {
                  setTempUserName(userName);
                  setIsProfileModalOpen(true);
                }}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors text-xs cursor-pointer"
                title="პროფილის რედაქტირება"
              >
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[11px]">
                  {getInitials(userName)}
                </div>
                <span className="font-medium text-slate-800 max-w-[120px] truncate hidden sm:inline">
                  {userName}
                </span>
                <Edit2 size={12} className="text-slate-400 hidden sm:inline" />
              </button>
            ) : (
              <button
                onClick={() => {
                  setTempUserName('');
                  setIsProfileModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors text-xs font-medium cursor-pointer"
              >
                <User size={14} />
                <span>მომხმარებელი</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full space-y-6">
        {/* Page Title & Intro */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              ექიმების კატალოგი
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              მოძებნეთ ექიმი სპეციალობის მიხედვით და დაჯავშნეთ ვიზიტი მარტივად.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="მოძებნეთ ექიმი, სპეციალობა..."
              className="w-full pl-9 pr-8 py-2 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label="ძიების გასუფთავება"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Specialty Filter Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
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
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span>{spec}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                    isSelected ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Doctor Grid */}
        <section>
          {filteredDoctors.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-10 text-center max-w-md mx-auto space-y-2">
              <Search size={24} className="mx-auto text-slate-400" />
              <h3 className="font-semibold text-slate-800 text-sm">ექიმი ვერ მოიძებნა</h3>
              <p className="text-xs text-slate-500">
                სცადეთ სხვა საძიებო სიტყვა ან გაასუფთავეთ ფილტრი.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedSpecialty('ყველა');
                }}
                className="text-xs font-medium text-blue-600 hover:underline pt-2 inline-block cursor-pointer"
              >
                ფილტრების გასუფთავება
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredDoctors.map((doc) => (
                <article
                  key={doc.id}
                  className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-4 shadow-sm hover:shadow transition-shadow flex flex-col justify-between"
                >
                  <div>
                    {/* Portrait & Rating */}
                    <div className="relative h-56 w-full rounded-lg overflow-hidden bg-slate-100 mb-3 border border-slate-100">
                      <img
                        src={doc.avatar}
                        alt={doc.name}
                        className="w-full h-56 object-cover object-top"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = DEFAULT_AVATAR;
                        }}
                      />
                      <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 bg-white/95 rounded text-xs font-bold text-slate-800 shadow-sm border border-slate-200">
                        <span className="text-amber-500">★</span>
                        <span>{doc.rating.toFixed(1)}</span>
                      </div>
                    </div>

                    {/* Name & Specialty */}
                    <div>
                      <h3 className="font-bold text-base text-slate-900">{doc.name}</h3>
                      <p className="text-xs font-semibold text-blue-600 mt-0.5">{doc.specialty}</p>
                    </div>

                    {/* Clinic, Location, Experience */}
                    <div className="mt-2.5 pt-2.5 border-t border-slate-100 space-y-1 text-xs text-slate-500">
                      <div className="flex items-center gap-1.5 truncate">
                        <Building2 size={13} className="text-slate-400 shrink-0" />
                        <span className="truncate">{doc.clinic}</span>
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin size={13} className="text-slate-400 shrink-0" />
                        <span className="truncate">{doc.location}</span>
                      </div>
                      <p className="text-slate-600 font-medium">
                        გამოცდილება: <span className="font-normal">{doc.experience}</span>
                      </p>
                    </div>

                    {/* Available Slots */}
                    <div className="mt-3 pt-2.5 border-t border-slate-100">
                      <p className="text-[11px] font-medium text-slate-500 mb-1.5">
                        თავისუფალი საათები:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {doc.availableSlots.map((slot) => (
                          <button
                            key={slot}
                            onClick={() => handleOpenBooking(doc, slot)}
                            className="px-2 py-0.5 text-xs bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 rounded transition-colors cursor-pointer"
                            title={`დაჯავშნა ${slot}-ზე`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Booking Button */}
                  <button
                    onClick={() => handleOpenBooking(doc)}
                    className="mt-4 w-full py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Calendar size={14} />
                    <span>ვიზიტის დაჯავშნა</span>
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Appointments Table Section */}
        <section id="my-appointments" className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">ჩემი ჯავშნები</h2>
              <p className="text-xs text-slate-500">თქვენ მიერ დაჯავშნილი ვიზიტების სია</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
              {appointments.length} ჯავშანი
            </span>
          </div>

          {appointments.length === 0 ? (
            <div className="text-center py-8 space-y-1">
              <Calendar size={22} className="mx-auto text-slate-400" />
              <p className="text-sm font-medium text-slate-700">აქტიური ჯავშნები არ გაქვთ</p>
              <p className="text-xs text-slate-400">
                დაჯავშნეთ ვიზიტი ზემოთ მოცემული სიიდან.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 text-xs font-medium">
                    <th className="pb-2.5 pl-1">ექიმი</th>
                    <th className="pb-2.5">პაციენტი</th>
                    <th className="pb-2.5">თარიღი</th>
                    <th className="pb-2.5">დრო</th>
                    <th className="pb-2.5">სტატუსი</th>
                    <th className="pb-2.5 pr-1 text-right">მოქმედება</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {appointments.map((apt) => {
                    const isNew = apt.id === recentlyAddedId;

                    return (
                      <tr
                        key={apt.id}
                        className={`transition-colors ${
                          isNew ? 'bg-blue-50/70' : 'hover:bg-slate-50'
                        }`}
                      >
                        {/* Doctor Column */}
                        <td className="py-3 pl-1">
                          <div className="flex items-center gap-2.5">
                            {apt.doctorAvatar ? (
                              <img
                                src={apt.doctorAvatar}
                                alt={apt.doctorName}
                                className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200 shrink-0"
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src = DEFAULT_AVATAR;
                                }}
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs shrink-0">
                                {getInitials(apt.doctorName)}
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="font-semibold text-slate-900 text-xs sm:text-sm truncate">
                                {apt.doctorName}
                              </p>
                              <p className="text-[11px] text-blue-600 font-medium truncate">
                                {apt.specialty}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Patient Column */}
                        <td className="py-3 text-xs text-slate-700">
                          <p className="font-semibold text-slate-900">{apt.patientName}</p>
                          <p className="text-slate-400 text-[11px]">{apt.phone}</p>
                        </td>

                        {/* Date Column */}
                        <td className="py-3 text-xs text-slate-700">
                          <span className="inline-flex items-center gap-1 text-slate-700 font-medium">
                            <Calendar size={13} className="text-slate-400" />
                            {apt.date}
                          </span>
                        </td>

                        {/* Time Column */}
                        <td className="py-3 text-xs text-slate-700">
                          <span className="inline-flex items-center gap-1 text-slate-700 font-medium">
                            <Clock size={13} className="text-slate-400" />
                            {apt.time}
                          </span>
                        </td>

                        {/* Status Column */}
                        <td className="py-3">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <Check size={11} />
                            დადასტურებული
                          </span>
                        </td>

                        {/* Delete Action */}
                        <td className="py-3 pr-1 text-right">
                          <button
                            onClick={() => setAppointmentToDelete(apt)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                            title="ჯავშნის გაუქმება"
                            aria-label="ჯავშნის გაუქმება"
                          >
                            <Trash2 size={15} />
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
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center text-xs text-slate-500">
          <p>© 2026 MediBook</p>
        </div>
      </footer>

      {/* User Profile Modal */}
      <Modal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        title="მომხმარებლის პროფილი"
        subtitle="მიუთითეთ თქვენი სახელი და გვარი ჯავშნების გასამარტივებლად"
      >
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              თქვენი სახელი, გვარი
            </label>
            <div className="relative">
              <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={tempUserName}
                onChange={(e) => setTempUserName(e.target.value)}
                placeholder="მაგ: გიორგი გიორგაძე"
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                autoFocus
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              ეს სახელი ავტომატურად ჩაიწერება ვიზიტის დაჯავშნის ფორმაში.
            </p>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-200">
            {userName ? (
              <button
                type="button"
                onClick={() => {
                  setUserName('');
                  setTempUserName('');
                  localStorage.removeItem('medibook_user');
                  setIsProfileModalOpen(false);
                }}
                className="text-xs text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
              >
                პროფილის გასუფთავება
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsProfileModalOpen(false)}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                გაუქმება
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer"
              >
                შენახვა
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Booking Modal */}
      <Modal
        isOpen={!!selectedDoctor}
        onClose={handleCloseBooking}
        title="ვიზიტის დაჯავშნა"
        subtitle="შეავსეთ ფორმა ექიმთან ვიზიტის დასაჯავშნად"
      >
        {selectedDoctor && (
          <BookingForm
            doctor={selectedDoctor}
            initialSlot={selectedSlot}
            defaultPatientName={userName}
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
        subtitle="დაადასტურეთ ჯავშნის გაუქმება"
      >
        {appointmentToDelete && (
          <div className="space-y-4">
            <div className="flex items-start gap-2.5 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs">
              <AlertTriangle size={16} className="text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">ნამდვილად გსურთ ჯავშნის გაუქმება?</p>
                <p className="mt-0.5 text-rose-700">
                  გაუქმებული ჯავშნის აღდგენა შეუძლებელია.
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-1 text-slate-600 border border-slate-200">
              <p>
                ექიმი: <strong className="text-slate-900">{appointmentToDelete.doctorName}</strong>
              </p>
              <p>
                პაციენტი: <strong className="text-slate-900">{appointmentToDelete.patientName}</strong>
              </p>
              <p>
                დრო და თარიღი: <strong className="text-slate-900">{appointmentToDelete.date} • {appointmentToDelete.time}</strong>
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setAppointmentToDelete(null)}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                უკან
              </button>
              <button
                type="button"
                onClick={confirmDeleteAppointment}
                className="px-4 py-1.5 text-xs font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg cursor-pointer"
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