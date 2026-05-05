import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function AttendanceHistory({ attendances, pagination, filters }) {
    const [localFilters, setLocalFilters] = useState(filters);
    const { post } = useForm();

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setLocalFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleApplyFilter = (e) => {
        e.preventDefault();

        const params = new URLSearchParams();
        if (localFilters.start_date) params.append('start_date', localFilters.start_date);
        if (localFilters.end_date) params.append('end_date', localFilters.end_date);
        if (localFilters.name) params.append('name', localFilters.name);

        window.location.href = route('supervisor.attendanceHistory') + '?' + params.toString();
    };

    const handleResetFilter = () => {
        setLocalFilters({
            start_date: '',
            end_date: '',
            name: ''
        });
        window.location.href = route('supervisor.attendanceHistory');
    };

    return (
        <AuthenticatedLayout header="Riwayat Presensi Tim">
            <Head title="Riwayat Presensi Tim" />

            <div className="max-w-7xl mx-auto space-y-6">
                {/* Filter Section */}
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-lg">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                        </div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">Filter Riwayat Presensi</h3>
                    </div>

                    <form onSubmit={handleApplyFilter} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Start Date Filter */}
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-600 mb-2">
                                    Dari Tanggal
                                </label>
                                <input
                                    type="date"
                                    name="start_date"
                                    value={localFilters.start_date}
                                    onChange={handleFilterChange}
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* End Date Filter */}
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-600 mb-2">
                                    Sampai Tanggal
                                </label>
                                <input
                                    type="date"
                                    name="end_date"
                                    value={localFilters.end_date}
                                    onChange={handleFilterChange}
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* Name Filter */}
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-600 mb-2">
                                    Nama Karyawan
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={localFilters.name}
                                    onChange={handleFilterChange}
                                    placeholder="Cari nama karyawan..."
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                type="submit"
                                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-sm uppercase tracking-wider rounded-xl hover:from-blue-500 hover:to-indigo-500 transition flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                Terapkan Filter
                            </button>
                            <button
                                type="button"
                                onClick={handleResetFilter}
                                className="px-6 py-2.5 bg-slate-100 text-slate-700 font-black text-sm uppercase tracking-wider rounded-xl hover:bg-slate-200 transition"
                            >
                                Reset
                            </button>
                        </div>
                    </form>

                    {/* Active Filters Display */}
                    {(localFilters.start_date || localFilters.end_date || localFilters.name) && (
                        <div className="mt-4 pt-4 border-t border-slate-100">
                            <p className="text-xs font-bold text-slate-600 mb-2 uppercase tracking-widest">Filter Aktif:</p>
                            <div className="flex flex-wrap gap-2">
                                {localFilters.start_date && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg border border-blue-100">
                                        Dari: {new Date(localFilters.start_date).toLocaleDateString('id-ID')}
                                    </span>
                                )}
                                {localFilters.end_date && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg border border-blue-100">
                                        Sampai: {new Date(localFilters.end_date).toLocaleDateString('id-ID')}
                                    </span>
                                )}
                                {localFilters.name && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg border border-blue-100">
                                        Nama: {localFilters.name}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Attendance History Table */}
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-lg overflow-hidden">
                    <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-50 text-slate-500 rounded-xl flex items-center justify-center">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            </div>
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">Riwayat Presensi</h3>
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-lg">
                            Total: {pagination.total}
                        </span>
                    </div>

                    {attendances && attendances.length > 0 ? (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-slate-50/50">
                                            <th className="text-left px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nama Karyawan</th>
                                            <th className="text-left px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tanggal</th>
                                            <th className="text-center px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Jam Masuk</th>
                                            <th className="text-center px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                            <th className="text-center px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Jam Keluar</th>
                                            <th className="text-center px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Durasi Kerja</th>
                                            <th className="text-left px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pekerjaan</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {attendances.map((att) => (
                                            <tr key={att.id} className="hover:bg-slate-50/80 transition-colors group">
                                                <td className="px-8 py-5">
                                                    <span className="text-sm font-black text-slate-900">{att.user_name}</span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className="text-sm font-bold text-slate-600">{att.date}</span>
                                                </td>
                                                <td className="px-6 py-5 text-center">
                                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-xl font-black text-sm font-mono border border-blue-100">
                                                        <svg className="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                        {att.clock_in_time.substring(0, 5)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-center">
                                                    {att.status_badge.includes('Terlambat') ? (
                                                        <span className="inline-flex px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-rose-600 bg-rose-50 rounded-lg border border-rose-100">
                                                            {att.status_badge}
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 rounded-lg border border-emerald-100">
                                                            {att.status_badge}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-5 text-center">
                                                    {att.clock_out_time !== '—' ? (
                                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl font-black text-sm font-mono border border-emerald-100">
                                                            <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                            {att.clock_out_time}
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-slate-400 italic">—</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-5 text-center">
                                                    <span className="text-sm font-bold text-slate-700">{att.duration}</span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className="text-xs text-slate-600 line-clamp-2 max-w-xs">{att.work_report}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {pagination.last_page > 1 && (
                                <div className="px-8 py-6 border-t border-slate-50 flex items-center justify-between">
                                    <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">
                                        Halaman {pagination.current_page} dari {pagination.last_page}
                                    </p>
                                    <div className="flex gap-2">
                                        {pagination.current_page > 1 && (
                                            <a
                                                href={route('supervisor.attendanceHistory', {
                                                    ...localFilters,
                                                    page: pagination.current_page - 1
                                                })}
                                                className="px-3 py-1.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-lg hover:bg-slate-200"
                                            >
                                                ← Sebelumnya
                                            </a>
                                        )}
                                        {pagination.current_page < pagination.last_page && (
                                            <a
                                                href={route('supervisor.attendanceHistory', {
                                                    ...localFilters,
                                                    page: pagination.current_page + 1
                                                })}
                                                className="px-3 py-1.5 bg-blue-600 text-white font-bold text-xs rounded-lg hover:bg-blue-500"
                                            >
                                                Selanjutnya →
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="py-20 text-center flex flex-col items-center">
                            <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center mb-4">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            </div>
                            <p className="text-sm font-black text-slate-300 uppercase tracking-widest italic">Tidak ada data yang sesuai dengan filter</p>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
