import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import {
  Award,
  Folder,
  UserCheck,
  BarChart3,
  ChevronRight,
  Link as LinkIcon,
} from 'lucide-react';

// =================== Type Definitions ===================
interface PortofolioItem {
  id: string;
  judul: string;
  deskripsi: string;
  kategori: 'Proyek' | 'Sertifikasi' | 'Organisasi';
  tautan?: string | null;
  created_at: string;
}

interface StatsData {
  sertifikat: number;
  proyek: number;
  organisasi: number;
}

// =================== UI Components ===================

const SectionHeader: React.FC<{
  icon: React.ReactNode;
  title: string;
  children?: React.ReactNode;
}> = ({ icon, title, children }) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
    <div className="flex items-center gap-3">
      <div className="text-teal-500">{icon}</div>
      <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
    </div>
    {children && <div className="mt-3 sm:mt-0">{children}</div>}
  </div>
);

const TabelDashboard: React.FC<{
  data: PortofolioItem[];
  type: 'prestasi' | 'proyek';
}> = ({ data, type }) => {
  const columns =
    type === 'prestasi'
      ? ['No', 'Judul Prestasi', 'Penyelenggara', 'Tanggal']
      : ['No', 'Judul Proyek', 'Deskripsi', 'Tautan'];

  return (
    <div className="bg-white shadow-md rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100/80">
            <tr className="border-b border-slate-200">
              {columns.map((col, i) => (
                <th
                  key={i}
                  className="px-6 py-4 font-semibold text-slate-600 text-left whitespace-nowrap"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-slate-700">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center p-8 text-slate-500"
                >
                  Belum ada data {type}.
                </td>
              </tr>
            ) : (
              data.slice(0, 5).map((item, i) => (
                <tr
                  key={item.id}
                  className="border-b border-slate-200 last:border-b-0 hover:bg-slate-50/50"
                >
                  <td className="px-6 py-4 text-center w-16">{i + 1}</td>
                  <td className="px-6 py-4 font-medium">{item.judul}</td>
                  <td className="px-6 py-4">{item.deskripsi}</td>
                  <td className="px-6 py-4 text-center">
                    {type === 'proyek' ? (
                      item.tautan ? (
                        <a
                          href={item.tautan}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-teal-600 hover:text-teal-800 inline-block"
                        >
                          <LinkIcon size={18} />
                        </a>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )
                    ) : (
                      new Date(item.created_at).toLocaleDateString('id-ID')
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// =================== Main Component ===================

const StudentDashboard: React.FC = () => {
  const { currentUser } = useAuth();

  const [stats, setStats] = useState<StatsData>({
    sertifikat: 0,
    proyek: 0,
    organisasi: 0,
  });

  const [prestasi, setPrestasi] = useState<PortofolioItem[]>([]);
  const [proyek, setProyek] = useState<PortofolioItem[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    if (!currentUser?.userId) {
      setIsLoading(false);
      setError('Sesi tidak valid.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get('/portfolio');
      const data: PortofolioItem[] = response.data;

      const sertifikat = data.filter((d) => d.kategori === 'Sertifikasi');
      const proyek = data.filter((d) => d.kategori === 'Proyek');

      setPrestasi(sertifikat);
      setProyek(proyek);
      setStats({
        sertifikat: sertifikat.length,
        proyek: proyek.length,
        organisasi: 0, // jika nanti ada, tambahkan logikanya
      });
    } catch (err) {
      console.error(err);
      setError('Gagal mengambil data.');
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // =================== Loading & Error State ===================
  if (isLoading)
    return <div className="p-8 text-center text-slate-500">Memuat data dashboard...</div>;

  if (error)
    return <div className="p-8 text-center text-red-500">Error: {error}</div>;

  // =================== UI Rendering ===================
  return (
    <div className="bg-slate-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-800">
            Selamat Datang, {currentUser?.name || 'Mahasiswa'}!
          </h1>
          <p className="mt-2 text-lg text-slate-500">
            Ini adalah ringkasan perjalanan akademik dan portofolio Anda.
          </p>
        </div>

        {/* Statistik */}
        <div className="mb-16">
          <SectionHeader icon={<BarChart3 size={24} />} title="Ringkasan Statistik" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard icon={<Award size={24} />} label="Total Prestasi" value={stats.sertifikat} color="teal" />
            <StatCard icon={<Folder size={24} />} label="Total Proyek" value={stats.proyek} color="blue" />
            <StatCard icon={<UserCheck size={24} />} label="Status Mahasiswa" value="Aktif" color="green" />
          </div>
        </div>

        {/* Tabel Prestasi & Proyek */}
        <div className="space-y-16">
          <DataSection
            title="Prestasi & Sertifikasi Terbaru"
            icon={<Award size={24} />}
            link="/student/kelola-sertifikasi"
            data={prestasi}
            type="prestasi"
          />
          <DataSection
            title="Proyek Terbaru"
            icon={<Folder size={24} />}
            link="/student/kelola-proyek"
            data={proyek}
            type="proyek"
          />
        </div>
      </div>
    </div>
  );
};

// =================== Helper Components ===================

const StatCard = ({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: 'teal' | 'blue' | 'green';
}) => {
  const bg = {
    teal: 'bg-teal-100 text-teal-600',
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
  }[color];

  return (
    <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-5">
      <div className={`${bg} p-4 rounded-lg`}>{icon}</div>
      <div>
        <div className="text-sm font-medium text-slate-500">{label}</div>
        <div className="text-3xl font-bold text-slate-800">{value}</div>
      </div>
    </div>
  );
};

const DataSection = ({
  title,
  icon,
  link,
  data,
  type,
}: {
  title: string;
  icon: React.ReactNode;
  link: string;
  data: PortofolioItem[];
  type: 'prestasi' | 'proyek';
}) => (
  <div>
    <SectionHeader icon={icon} title={title}>
      <Link
        to={link}
        className="flex items-center gap-2 text-sm font-semibold text-teal-600 hover:text-teal-800"
      >
        Lihat Semua <ChevronRight size={16} />
      </Link>
    </SectionHeader>
    <TabelDashboard data={data} type={type} />
  </div>
);

export default StudentDashboard;
