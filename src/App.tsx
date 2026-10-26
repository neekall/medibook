import { useState, useEffect, useMemo } from 'react';
import { Search, Calendar, User, Clock, Trash2, Menu, X, PlusCircle } from 'lucide-react';
import { INITIAL_DOCTORS } from './data/doctors';
import type { Doctor, Appointment, BookingFormData } from './types';
import { useDebounce } from './hooks/useDebounce';
import { Modal } from './components/Modal';
import { BookingForm } from './components/BookingForm';

export default function App() {
  const [doctors] = useState<Doctor[]>(INITIAL_DOCTORS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('ყველა');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // LocalStorage-დან ჯავშნების წამოღება
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('medibook_appointments');
    return saved ? JSON.parse(saved) : [];
  });

  // LocalStorage-ში შენახვა
  useEffect(() => {
    localStorage.setItem('medibook_appointments', JSON.stringify(appointments));
  }, [appointments]);

  // Debounced საძიებო სიტყვა (300ms)
  const debouncedSearch = useDebounce(searchTerm, 300);

  // გაფილტვრა useMemo-თი
  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      const matchesSearch =
        doc.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        doc.specialty.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesSpecialty =
        selectedSpecialty === 'ყველა' || doc.specialty === selectedSpecialty;
      return matchesSearch && matchesSpecialty;
    });
  }, [doctors, debouncedSearch, selectedSpecialty]);

  const handleBooking = (data: BookingFormData) => {
    const newAppointment: Appointment = {
      id: 'apt-' + Date.now(),
      ...data,
      status: 'confirmed',
    };
    setAppointments((prev) => [newAppointment, ...prev]);
    setSelectedDoctor(null);
  };

  const handleDeleteAppointment = (id: string) => {
    setAppointments((prev) => prev.filter((apt) => apt.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* ჰედერი */}
      <header className="bg-white border-b sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded"
              aria-label="მენიუს გახსნა"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="flex items-center gap-2">
              <PlusCircle className="text-blue-600" size={28} />
              <h1 className="text-xl font-bold tracking-tight">MediBook</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500 hidden sm:inline">
              აქტიური ჯავშნები: <strong className="text-slate-800">{appointments.length}</strong>
            </span>
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
              ნნ
            </div>
          </div>
        </div>
      </header>

      {/* ძირითადი ლეიაუთი */}
      <div className="max-w-7xl mx-auto px-4 py-6 flex-1 w-full grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
        {/* საიდბარი / ფილტრები */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-white p-6 shadow-lg transform transition-transform md:translate-x-0 md:static md:w-auto md:p-0 md:shadow-none md:bg-transparent ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
        >
          <div className="flex justify-between items-center md:hidden mb-4">
            <h2 className="text-lg font-semibold">ფილტრაცია</h2>
            <button onClick={() => setIsSidebarOpen(false)} aria-label="დახურვა">
              <X size={20} />
            </button>
          </div>

          <div className="bg-white p-4 rounded-lg border space-y-4">
            <h3 className="font-semibold text-slate-700 text-sm">სპეციალობა</h3>
            <div className="space-y-1">
              {['ყველა', 'კარდიოლოგი', 'ნევროლოგი', 'პედიატრი', 'თერაპევტი'].map((spec) => (
                <button
                  key={spec}
                  onClick={() => {
                    setSelectedSpecialty(spec);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${selectedSpecialty === spec
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-slate-600 hover:bg-slate-50'
                    }`}
                >
                  {spec}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* მთავარი შინაარსი */}
        <main className="space-y-6">
          {/* საძიებო ველი */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="მოძებნეთ ექიმი სახელის ან სპეციალობის მიხედვით..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-sm"
            />
          </div>

          {/* ექიმების კატალოგი */}
          <section>
            <h2 className="text-lg font-semibold mb-4 text-slate-800">ექიმების კატალოგი</h2>
            {filteredDoctors.length === 0 ? (
              <p className="text-sm text-slate-500 py-6 text-center bg-white border rounded-lg">
                ექიმი მითითებული პარამეტრებით ვერ მოიძებნა.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDoctors.map((doc) => (
                  <article
                    key={doc.id}
                    className="bg-white border rounded-lg p-5 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-slate-800">{doc.name}</h3>
                          <p className="text-sm text-blue-600 font-medium mt-0.5">{doc.specialty}</p>
                        </div>
                        <span className="text-xs bg-amber-50 text-amber-700 font-semibold px-2 py-0.5 rounded border border-amber-200">
                          ★ {doc.rating}
                        </span>
                      </div>
                      <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                        <User size={14} />
                        <span>გამოცდილება: {doc.experience}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedDoctor(doc)}
                      className="mt-5 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors"
                    >
                      ვიზიტის დაჯავშნა
                    </button>
                  </article>
                ))}
              </div>
            )}
          </section>

          {/* დაჯავშნილი ვიზიტების სია (CRUD) */}
          <section className="bg-white border rounded-lg p-5 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 text-slate-800">ჩემი ჯავშნები</h2>
            {appointments.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-4">აქტიური ჯავშნები არ გაქვთ.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b text-slate-500 text-xs uppercase tracking-wider">
                      <th className="pb-3 font-medium">ექიმი</th>
                      <th className="pb-3 font-medium">პაციენტი</th>
                      <th className="pb-3 font-medium">თარიღი</th>
                      <th className="pb-3 font-medium">დრო</th>
                      <th className="pb-3 font-medium text-right">მოქმედება</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {appointments.map((apt) => (
                      <tr key={apt.id} className="hover:bg-slate-50">
                        <td className="py-3 font-medium text-slate-800">
                          {apt.doctorName}
                          <span className="block text-xs text-slate-400 font-normal">{apt.specialty}</span>
                        </td>
                        <td className="py-3 text-slate-600">
                          {apt.patientName}
                          <span className="block text-xs text-slate-400">{apt.phone}</span>
                        </td>
                        <td className="py-3 text-slate-600">
                          <span className="flex items-center gap-1.5">
                            <Calendar size={14} className="text-slate-400" />
                            {apt.date}
                          </span>
                        </td>
                        <td className="py-3 text-slate-600">
                          <span className="flex items-center gap-1.5">
                            <Clock size={14} className="text-slate-400" />
                            {apt.time}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => handleDeleteAppointment(apt.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded transition-colors"
                            title="ჯავშნის გაუქმება"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </main>
      </div>

      {/* ჯავშნის მოდალი */}
      <Modal
        isOpen={!!selectedDoctor}
        onClose={() => setSelectedDoctor(null)}
        title={selectedDoctor ? `${selectedDoctor.name} - ვიზიტის დაჯავშნა` : ''}
      >
        {selectedDoctor && (
          <BookingForm
            doctor={selectedDoctor}
            onSubmit={handleBooking}
            onCancel={() => setSelectedDoctor(null)}
          />
        )}
      </Modal>
    </div>
  );
}