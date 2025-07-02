// LOKASI: src/pages/industry/Dashboard.tsx

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api'; 
import { useAuth } from '../../contexts/AuthContext';
import DashboardSection from '../../components/dashboard/DashboardSection';

import { Search, ChevronDown, ChevronsRight, Users } from 'lucide-react';

// [PENTING] Sesuaikan interface ini dengan struktur data DARI API ANDA.
// Saya akan memberikan beberapa kemungkinan nama properti di bawah.
interface Student {
  userId: string;
  // Kemungkinan 1: Nama properti standar
  name: string;
  email: string;
  keahlian: string | null;

  // Kemungkinan 2: Jika data dari backend menggunakan nama properti yang berbeda
  // Jika ini kasusnya, hapus komentar di bawah dan sesuaikan JSX
  // nama_mahasiswa?: string;
  // email_mahasiswa?: string;

  // Kemungkinan 3: Jika data user ada di dalam objek bersarang
  // User?: {
  //   name: string;
  //   email: string;
  // };
}

const skills = ["UI/UX", "Frontend", "Backend", "Data Analyst"];

const IndustryDashboard: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<string>('');
  
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get('/students');
        // Log data mentah untuk debugging
        console.log("Data Mahasiswa Aktual dari API:", response.data); 
        setStudents(response.data);
      } catch (err) {
        console.error("Gagal mengambil data mahasiswa:", err);
        setError("Tidak dapat memuat data mahasiswa. Coba lagi nanti.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const stats = useMemo(() => {
    if (isLoading || students.length === 0) return { totalStudents: 0 };
    return { totalStudents: students.length };
  }, [students, isLoading]);

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      // Sesuaikan 'student.name' jika nama properti berbeda
      const studentName = student.name || ''; 
      const matchesSearch = studentName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSkill = selectedSkill ? student.keahlian === selectedSkill : true;
      return matchesSearch && matchesSkill;
    });
  }, [students, searchTerm, selectedSkill]);

  const handleViewPortfolio = (studentUserId: string) => {
    if (!currentUser || !currentUser.role) {
      console.error("Gagal navigasi: currentUser atau role tidak ditemukan.", currentUser);
      return; 
    }
    const targetUrl = `/industry/portofolio/${studentUserId}`;
    navigate(targetUrl);
  };

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Memuat data...</div>;
  }
  if (error) {
    return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  }
 
  return (
    <div className="space-y-8">
      {/* Bagian Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm flex items-center gap-5 border border-slate-200">
            <div className="bg-teal-100 p-4 rounded-full">
                <Users className="h-8 w-8 text-teal-600" />
            </div>
            <div>
                <p className="text-sm text-slate-500">Total Talenta Tersedia</p>
                <p className="text-3xl font-bold text-slate-800">{stats.totalStudents}</p>
            </div>
        </div>
      </div>

      {/* Bagian Pencarian */}
      <DashboardSection title="Pencarian Talenta Mahasiswa">
        <p className="mt-1 text-md text-slate-500 mb-6">
            Temukan mahasiswa berdasarkan nama atau keahlian spesifik untuk kebutuhan industri Anda.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <div className="relative md:col-span-3">
                <input
                    type="text"
                    placeholder="Cari nama mahasiswa..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            </div>
            <div className="relative md:col-span-2">
                <select
                    value={selectedSkill}
                    onChange={(e) => setSelectedSkill(e.target.value)}
                    className="w-full appearance-none pl-4 pr-10 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                    <option value="">Semua Keahlian</option>
                    {skills.map(skill => (
                        <option key={skill} value={skill}>{skill}</option>
                    ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>
        </div>

        {/* Tabel Mahasiswa */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-slate-50">
                        <tr className="border-b border-slate-200">
                            <th className="px-6 py-4 font-semibold text-slate-600 text-left">Nama Mahasiswa</th>
                            <th className="px-6 py-4 font-semibold text-slate-600 text-left">Email</th>
                            <th className="px-6 py-4 font-semibold text-slate-600 text-left">Keahlian</th>
                            <th className="px-6 py-4 font-semibold text-slate-600 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="text-slate-700">
                        {filteredStudents.length > 0 ? (
                            filteredStudents.map((student) => (
                                <tr key={student.userId} className="border-b border-slate-200 last:border-b-0 hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-teal-100 text-teal-700 font-bold w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                                                {/* [FIX] Ganti 'student.name' dengan nama properti yang benar jika berbeda */}
                                                {(student.name || 'N/A').charAt(0).toUpperCase()}
                                            </div>
                                            <span className="font-semibold">{student.name || 'Nama tidak tersedia'}</span>
                                        </div>
                                    </td>
                                    {/* [FIX] Ganti 'student.email' dengan nama properti yang benar jika berbeda */}
                                    <td className="px-6 py-4">{student.email || 'Email tidak tersedia'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${student.keahlian ? 'bg-teal-100 text-teal-800' : 'bg-slate-100 text-slate-600'}`}>
                                            {/* [FIX] Ganti 'student.keahlian' dengan nama properti yang benar jika berbeda */}
                                            {student.keahlian || 'Belum diisi'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button onClick={() => handleViewPortfolio(student.userId)} className="text-teal-600 hover:text-teal-800 font-semibold flex items-center gap-1.5 mx-auto transition-colors">
                                            <span>Lihat Portofolio</span>
                                            <ChevronsRight size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan={4} className="text-center p-8 text-slate-500">
                                Tidak ada mahasiswa yang cocok dengan kriteria pencarian.
                            </td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
      </DashboardSection>
    </div>
  );
};

export default IndustryDashboard;